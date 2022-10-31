const db = require("../config/SeqdataBase");
const { Sequelize } = require("sequelize");

exports.getRecipes = (req, res, next) => {
  res.status(200).send({ message: "welcome!" });
};
