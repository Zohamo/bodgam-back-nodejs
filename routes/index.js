const models = require("../models");
const { passport, jwt, jwtOptions, userToken } = require("../auth");

const userRoute = require("./user");
const profileRoute = require("./profile");
const locationRoute = require("./location");
const eventRoute = require("./event");

module.exports = app => {
  userRoute(app, models, passport, jwt, jwtOptions);
  profileRoute(app, models, userToken);
  locationRoute(app, models, userToken, passport);
  eventRoute(app, models, userToken);
};
