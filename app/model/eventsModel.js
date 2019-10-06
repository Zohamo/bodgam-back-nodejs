"user strict";
var sql = require("./db.js");

//Task object constructor
var Event = function(event) {
  this.created_at = new Date();
  this.updated_at = new Date();
  this.title = event.title;
  this.start_datetime = new Date();
  this.end_datetime = new Date();
  this.level = event.level;
  this.min_players = event.min_players;
  this.max_players = event.max_players;
  this.players_id = event.players_id;
  this.description = event.description;
  this.user_id = event.user_id;
  this.location_id = event.location_id;
};
Event.createEvent = function(newEvent, result) {
  sql.query("INSERT INTO events SET ?", newEvent, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};
Event.getById = function(eventId, result) {
  sql.query("SELECT * FROM events WHERE id = ? ", eventId, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};
Event.getAll = function(result) {
  sql.query("SELECT * FROM events", function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      console.log("events : ", res);

      result(null, res);
    }
  });
};
Event.update = function(id, event, result) {
  sql.query("UPDATE events SET ? WHERE id = ?", [event, id], function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
Event.delete = function(id, result) {
  sql.query("DELETE FROM events WHERE id = ?", [id], function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

module.exports = Event;
