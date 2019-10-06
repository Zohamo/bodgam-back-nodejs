"use strict";
module.exports = function(app) {
  // Events Routes
  const events = require("../controller/eventsController");
  app
    .route("/events")
    .get(events.getAll)
    .post(events.create);

  app
    .route("/events/:eventId")
    .get(events.getById)
    .put(events.update)
    .delete(events.delete);
};
