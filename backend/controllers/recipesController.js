const db = require("../config/SeqdataBase");
const { Sequelize } = require("sequelize");

exports.addRecipes = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const {
      image,
      name,
      author,
      description,
      cookingTime,
      portions,
      level,
      dietType,
      category,
      calories,
      fats,
      proteins,
      carbohydrates,
    } = req.body;
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.updateRecipes = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.deleteRecipes = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};
