"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Doctor_Clinic_Speciality", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      cliniciD: {
        type: Sequelize.INTEGER,
      },
      specialityID: {
        type: Sequelize.INTEGER,
      },
      createAT: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updateAT: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Doctor_Clinic_Speciality");
  },
};
