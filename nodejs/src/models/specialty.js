"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class specialty extends Model {
    static associate(models) {}
  }
  specialty.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "specialty",
      createdAt: "createAT",
      updatedAt: "updateAT",
    },
  );
  return specialty;
};
