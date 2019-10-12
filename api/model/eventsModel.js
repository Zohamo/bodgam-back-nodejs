"user strict";
const sql = require("../../core/db");

class Event {
  constructor(event) {
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
  }

  static createEvent(newEvent, result) {
    sql.query("INSERT INTO events SET ?", newEvent, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.insertId);
        result(null, res.insertId);
      }
    });
  }

  static getById(eventId, result) {
    sql.query("SELECT * FROM events WHERE id = ? ", eventId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    });
  }

  static getAll(result) {
    sql.query("SELECT * FROM events", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        console.log("events : ", res);
        result(null, res);
      }
    });
  }

  static update(id, event, result) {
    sql.query("UPDATE events SET ? WHERE id = ?", [event, id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    });
  }

  static delete(id, result) {
    sql.query("DELETE FROM events WHERE id = ?", [id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    });
  }
}

module.exports = Event;
