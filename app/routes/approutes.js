"use strict";
module.exports = function(app) {
  // todoList Routes
  var todoList = require("../controller/todoListController");
  app
    .route("/tasks")
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app
    .route("/tasks/:taskId")
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);

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
