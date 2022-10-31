const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const RecipeStep = sequelize.define(
    "recipeStep",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  return RecipeStep;
};
