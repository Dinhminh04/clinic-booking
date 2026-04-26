"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Clinic_Speciality extends Model {
    static associate(models) {}
  }
  Doctor_Clinic_Speciality.init(
    {
      doctorId: DataTypes.INTEGER,
      clinicID: DataTypes.INTEGER,
      specialityID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Clinic_Speciality",
      tableName: "doctor_clinic_speciality",
      createdAt: "createAT",
      updatedAt: "updateAT",
    },
  );
  return Doctor_Clinic_Speciality;
};
