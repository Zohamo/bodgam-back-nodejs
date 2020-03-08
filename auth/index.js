require("dotenv").config();
// import jwt, passport and passport-jwt modules
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

// JwtStrategy which is the strategy for the authentication
const JwtStrategy = passportJWT.Strategy;

// jwtOptions
const jwtOptions = {};
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_secretOrKey;

// lets create our strategy for web token
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log("payload received", jwt_payload);
  const user = getUser({ id: jwt_payload.id });
  console.log("*********** strategy user", user);
  next(null, user || false);
});

// use the strategy
passport.use(strategy);

// decode user token
const userToken = req => {
  const token = jwtOptions.jwtFromRequest(req);
  return token ? jwt.verify(token, jwtOptions.secretOrKey) : null;
};

module.exports = { passport, jwt, jwtOptions, userToken };
