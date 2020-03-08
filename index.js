require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { passport } = require("./auth");
const routes = require("./routes");
const db = require("./db");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// JUST TO TEST LOCALLY : removes CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  next();
});

// init passport
app.use(passport.initialize());

// set routes
routes(app);

// connect to db
db.sync({ force: false })
  .then(() => {
    app.listen(port, () => console.log(`Running on http://localhost:${port}`));
  })
  .catch(err =>
    console.log("BTW, did you enter wrong database credentials?", err)
  );
