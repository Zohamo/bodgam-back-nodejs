module.exports = (app, models, userToken) => {
  const prepareEventReq = eventReq => {
    console.log("!!!!!!!!!! eventReq", eventReq);
    eventReq.locationId = eventReq.location.id;
    delete eventReq.location;
    return eventReq;
  };

  /**
   * GET ALL > OK
   */

  app.get("/api/events", (req, res) =>
    models.event
      .findAll({
        include: [
          { model: models.location },
          {
            model: models.user,
            as: "host"
          }
        ]
      })
      .then(eventsRes => {
        console.log("eventsRes", eventsRes);
        res.json(eventsRes);
      })
  );

  /**
   * GET ALL FROM USER > OK
   */

  app.get("/api/users/:userId/events", (req, res) =>
    models.event
      .findAll({
        where: { userId: req.params.userId },
        include: [
          { model: models.location },
          {
            model: models.user,
            as: "host"
          }
        ]
      })
      .then(eventsRes => res.json(eventsRes))
  );

  /**
   * GET ONE > OK
   */

  app.get("/api/events/:id", (req, res) =>
    models.event
      .findByPk(req.params.id, { include: models.location })
      .then(eventRes => {
        console.log("findByPk eventRes", eventRes);

        models.profile
          .findOne({ where: { id: eventRes.dataValues.userId } })
          .then(profileRes => {
            console.log("------- profileRes", profileRes);
            const eventToSend = Object.assign({}, eventRes.dataValues, {
              host: profileRes.dataValues
            });
            delete eventToSend.locationId;
            delete eventToSend.userId;
            console.log(">>>>>>>>>>>> eventToSend", eventToSend);
            res.json(eventToSend);
          });
      })
  );

  /**
   * CREATE > OK
   */

  app.post("/api/events", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to create an Event." });
    } else {
      const eventReq = Object.assign(
        { userId: user.id, hostId: user.id },
        req.body
      );
      console.log("REQ event", eventReq);

      models.event
        .create(prepareEventReq(eventReq))
        .then(eventRes => res.json(eventRes));
    }
  });

  /**
   * UPDATE > OK
   */

  app.put("/api/events/:id", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to update this Event." });
    } else if (user.id !== req.body.host.id) {
      res.status(403).json({
        message:
          "You're trying to update an event that is not yours : " +
          user.id +
          " !== " +
          req.body.host.id
      });
    } else {
      const eventReq = Object.assign({ userId: user.id }, req.body);
      console.log("REQ event", eventReq);

      models.event
        .update(prepareEventReq(eventReq), {
          where: {
            id: req.params.id
          }
        })
        .then(eventRowsUpdated => {
          console.log("RES eventRowsUpdated", eventRowsUpdated);

          if (eventRowsUpdated[0] !== 1) {
            res
              .status(500)
              .json({ message: "An error occured during Event update." });
          } else {
            res.json(eventReq);
          }
        });
    }
  });

  /**
   * DELETE > OK
   */

  app.delete("/api/events/:id", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to delete this Event." });
    } else {
      models.event.findByPk(req.params.id).then(eventRes => {
        if (user.id !== eventRes.dataValues.userId) {
          res.status(403).json({
            message:
              "You're trying to update an event that is not yours : " +
              user.id +
              " !== " +
              req.body.host.id
          });
        } else {
          // TODO : destroy only if date > today
          models.event
            .destroy({
              where: {
                id: req.params.id
              }
            })
            .then(result => res.json(result));
        }
      });
    }
  });
};
