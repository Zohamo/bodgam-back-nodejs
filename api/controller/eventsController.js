"use strict";

const Event = require("../model/eventsModel");

exports.create = function(req, res) {
  var new_event = new Event(req.body);

  // handle errors
  if (
    !new_event.title ||
    !new_event.start_datetime ||
    !new_event.user_id ||
    !new_event.location_id
  ) {
    res
      .status(400)
      .send({ error: true, message: "Missing Event required field(s)" });
  } else {
    Event.create(new_event, (err, event) => {
      if (err) res.send(err);
      res.json(event);
    });
  }
};

exports.getById = function(req, res) {
  Event.getById(req.params.eventId, (err, event) => {
    if (err) res.send(err);
    res.json(event);
  });
};

exports.getAll = function(req, res) {
  Event.getAll((err, event) => {
    if (err) res.send(err);
    res.send(event);
  });
};

exports.update = function(req, res) {
  Event.update(req.params.eventId, new Event(req.body), (err, event) => {
    if (err) res.send(err);
    res.json(event);
  });
};

exports.delete = function(req, res) {
  Event.delete(req.params.eventId, (err, event) => {
    if (err) res.send(err);
    res.json({ message: "Event successfully deleted" });
  });
};
