require("dotenv").config();
const Sequelize = require("sequelize");

module.exports = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT
});
