// TODO refactor : mysql SELECT only allowed attributes ?
// prepare profile before send
const preparePublicProfile = (profile, privacy) => {
  if (!privacy || (privacy && !privacy.showBggName)) {
    delete profile.bggName;
  }
  if (!privacy || (privacy && !privacy.showBirthdate)) {
    delete profile.birthdate;
  }
  if (!privacy || (privacy && !privacy.showEmail)) {
    delete profile.email;
  }
  if (!privacy || (privacy && !privacy.showPhoneNumber)) {
    delete profile.phoneNumber;
  }
  if (!privacy || (privacy && !privacy.showWebsite)) {
    delete profile.website;
  }
  console.log("public profile", profile);
  return profile;
};

const preparePrivacyRes = privacy => {
  delete privacy.id;
  delete privacy.profileId;
  return privacy;
};

const prepareRatings = ratings => {
  delete ratings.id;
  delete ratings.profileId;
  for (const key in ratings) {
    ratings[key] = ratings[key]
      ? ratings[key].split(";").map(val => parseInt(val))
      : [];
  }
  return ratings;
};

module.exports = (app, models, userToken) => {
  /**
   * GET ALL > OK
   */

  app.get("/api/profiles", (req, res) => {
    // TODO include REQ
    models.profile
      .findAll({
        where: { isActive: 1 }
      })
      .then(profiles => {
        console.log("RES profiles", profiles);
        models.privacy.findAll().then(privacy => {
          console.log("RES privacy", privacy);
          profiles.map(profile =>
            preparePublicProfile(
              profile.dataValues,
              privacy.find(privacy => privacy.profileId === profile.id)
            )
          );
          console.log("OUT profiles", profiles);
          res.json(profiles);
        });
      });
  });

  /**
   * GET ONE > OK
   */

  app.get("/api/profiles/:id", (req, res) => {
    // TODO include REQ
    // TODO check token
    models.profile
      .findOne({
        where: { userId: req.params.id, isActive: 1 }
      })
      .then(profileRes => {
        if (!profileRes) {
          // profile doesn't exist > return
          // res.status(404).json(profile);
          res.json(profileRes);
        }
        // TODO else if token.id === userId
        else {
          // we start preparing the response
          profileRes = profileRes.dataValues;
          console.log("RES profile", profileRes);

          models.privacy
            .findOne({
              where: { profileId: profileRes.id }
            })
            .then(privacy => {
              console.log("RES privacy", privacy.dataValues);
              profileRes.privacy = preparePrivacyRes(privacy.dataValues);

              models.ratings
                .findOne({
                  where: { profileId: profileRes.id }
                })
                .then(ratings => {
                  console.log("RES ratings", ratings.dataValues);
                  profileRes.ratings = prepareRatings(ratings.dataValues);

                  // res.json(preparePublicProfile(profile, privacy));
                  console.log("RESULT", profileRes);
                  res.json(profileRes);
                });
            });
        }
      })
      .catch(console.error);
  });

  /**
   * CREATE > OK
   */

  app.post("/api/profiles", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to edit your profile." });
    } else {
      // TODO include REQ
      const profileReq = req.body;
      profileReq.id = profileReq.userId;

      models.profile.create(profileReq).then(profileRes => {
        profileRes = profileRes.dataValues;
        console.log("RES profile", profileRes);

        const privacyReq = req.body.privacy;
        privacyReq.profileId = profileRes.id;

        models.privacy.create(privacyReq).then(privacyRes => {
          profileRes.privacy = privacyRes.dataValues;
          models.ratings
            .create({ profileId: profileRes.id })
            .then(ratingsRes => {
              profileRes.ratings = ratingsRes.dataValues;
              console.log("RESULT profileRes", profileRes);
              res.json(profileRes);
            });
        });
      });
    }
  });

  /**
   * UPDATE > OK
   */

  app.put("/api/profiles/:userId", (req, res) => {
    console.log("REQ.BODY", req.body);

    // check user token
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to update your profile." });
    } else if (req.body.id !== user.id) {
      res.status(403).json({
        message: "You're trying to update a profile that is not yours."
      });
    } else {
      const profileReq = Object.assign({}, req.body);
      const privacyReq = Object.assign(
        { profileId: profileReq.id },
        req.body.privacy
      );

      models.profile
        .update(profileReq, {
          where: {
            id: req.body.id
          }
        })
        .then(profileRowsUpdated => {
          console.log("RES rowsUpdated", profileRowsUpdated);

          if (profileRowsUpdated[0] !== 1) {
            res
              .status(500)
              .json({ message: "An error occured during the Profile update." });
          } else {
            models.privacy
              .update(privacyReq, {
                where: {
                  profileId: req.body.id
                }
              })
              .then(privacyRowsUpdated => {
                const profileRes = Object.assign(
                  { privacy: preparePrivacyRes(privacyReq) },
                  profileReq
                );
                console.log("RES profileRes", profileRes);
                res.json(profileRes);
              });
          }
        });
    }
  });

  /**
   * UPDATE Privacy > OK
   */

  app.put("/api/profiles/:userId/privacy", (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to update your profile." });
    } else if (userId !== user.id) {
      res.status(403).json({
        message:
          "You're trying to update a profile that is not yours: " +
          userId +
          " !== " +
          user.id
      });
    } else {
      const privacyReq = Object.assign({ profileId: userId }, req.body);

      models.privacy
        .update(privacyReq, {
          where: {
            profileId: privacyReq.profileId
          }
        })
        .then(privacyRowsUpdated => {
          console.log("RES privacyRowsUpdated", privacyRowsUpdated);

          if (privacyRowsUpdated[0] !== 1) {
            res.status(500).json({
              message: "An error occured during the Profile Privacy update."
            });
          } else {
            const privacyRes = Object.assign({}, preparePrivacyRes(privacyReq));
            console.log("RES privacyRes", privacyRes);
            res.json(privacyRes);
          }
        });
    }
  });

  /**
   * DELETE
   */

  app.delete("/api/profiles/:userId", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to delete your profile." });
    } else if (req.params.id !== user.id) {
      res.status(403).json({
        message: "You're trying to delete a profile that is not yours."
      });
    } else {
      models.profile
        .update(
          { isDisabled: true },
          {
            where: {
              userId: req.params.userId
            }
          }
        )
        .then(result => res.json(result));
    }
  });
};
