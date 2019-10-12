require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

// Authentication
// const auth = require("./auth");

// Server
app.listen(port);
console.log("API server started on: " + port);

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
var routes = require("./api/routes");
routes(app); // register the route
