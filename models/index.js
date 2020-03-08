const Sequelize = require("sequelize");
const db = require("../db");

/**
 * Sequelize models
 */

const User = require("./user")(db, Sequelize);
const Profile = require("./profile")(db, Sequelize);
const Privacy = require("./privacy")(db, Sequelize);
const Ratings = require("./ratings")(db, Sequelize);
const Location = require("./location")(db, Sequelize);
const Event = require("./event")(db, Sequelize);
const Event_Players = require("./event-players")(db, Sequelize);

/**
 * Associations
 */

// Profile

User.hasOne(Profile);
Profile.belongsTo(User);

Profile.hasOne(Privacy);
Privacy.belongsTo(Profile);

Profile.hasOne(Ratings);
Ratings.belongsTo(Profile);

// Location

User.hasMany(Location);
Location.belongsTo(User);

// Event

User.hasMany(Event);
Event.belongsTo(User, { as: "host" });

/* User.belongsToMany(Event, { through: Event_Players });
Event.belongsToMany(User, { through: Event_Players }); */

Event.belongsToMany(Profile, { through: Event_Players });
Profile.belongsToMany(Event, { through: Event_Players });

Location.hasMany(Event);
Event.belongsTo(Location);

/**
 * Export
 */

module.exports = db.models;
