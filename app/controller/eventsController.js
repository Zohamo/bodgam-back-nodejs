"use strict";

const Event = require("../model/eventsModel.js");

exports.getAll = function(req, res) {
  Event.getAll(function(err, event) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", event);
    res.send(event);
  });
};

exports.create = function(req, res) {
  var new_event = new Event(req.body);

  // handles errors
  if (!new_event.task || !new_event.status) {
    res
      .status(400)
      .send({ error: true, message: "Missing Event required field(s)" });
  } else {
    Event.create(new_event, function(err, event) {
      if (err) res.send(err);
      res.json(event);
    });
  }
};

exports.getById = function(req, res) {
  Event.getById(req.params.eventId, function(err, event) {
    if (err) res.send(err);
    res.json(event);
  });
};

exports.update = function(req, res) {
  Event.update(req.params.eventId, new Event(req.body), function(err, event) {
    if (err) res.send(err);
    res.json(event);
  });
};

exports.delete = function(req, res) {
  Event.delete(req.params.eventId, function(err, event) {
    if (err) res.send(err);
    res.json({ message: "Event successfully deleted" });
  });
};
