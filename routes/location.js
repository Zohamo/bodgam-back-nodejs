module.exports = (app, models, userToken) => {
  /**
   * GET ALL > OK
   */

  app.get("/api/locations", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to access this page." });
    } else {
      models.location
        .findAll({ where: { userId: user.id } })
        .then(result => res.json(result));
    }
  });

  /**
   * GET ONE > OK
   */

  app.get("/api/locations/:id", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to access this page." });
    } else {
      models.location
        .findByPk(req.params.id, { where: { userId: user.id } })
        .then(result => res.json(result));
    }
  });

  /**
   * CREATE > OK
   */

  app.post("/api/locations", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to create a Location." });
    } else {
      const locationReq = Object.assign({}, req.body);
      locationReq.userId = user.id;
      console.log("REQ location", locationReq);

      models.location.create(locationReq).then(locationRes => {
        console.log("RES location", locationRes);
        res.json(locationRes.dataValues);
      });
    }
  });

  /**
   * UPDATE > OK
   */

  app.put("/api/locations/:id", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to update this Location." });
    } else {
      const locationReq = Object.assign({}, req.body);
      models.location
        .update(locationReq, {
          where: {
            id: req.params.id,
            userId: user.id
          }
        })
        .then(rowsUpdated => {
          console.log("RES rowsUpdated", rowsUpdated);

          if (rowsUpdated[0] !== 1) {
            res
              .status(500)
              .json({ message: "An error occured during Location update." });
          } else {
            res.json(locationReq);
          }
        });
    }
  });

  /**
   * DELETE > OK
   * if there are events attached to this this location > isDisabled: true
   * else delete location
   */

  app.delete("/api/locations/:id", (req, res) => {
    const user = userToken(req);
    if (!user) {
      res
        .status(401)
        .json({ message: "You must be registered to delete this Location." });
    } else {
      models.event
        .findOne({
          where: { locationId: req.params.id }
        })
        .then(eventRes => {
          console.log("DELETE eventRes", eventRes);

          if (eventRes) {
            models.location
              .update(
                { isDisabled: true },
                {
                  where: {
                    id: req.params.id,
                    userId: user.id
                  }
                }
              )
              .then(result => res.json(result));
          } else {
            models.location
              .destroy({
                where: {
                  id: req.params.id,
                  userId: user.id
                }
              })
              .then(result => res.json(result));
          }
        });
    }
  });
};
