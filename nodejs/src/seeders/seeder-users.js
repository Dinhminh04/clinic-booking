"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let hashPassword = await bcrypt.hash("123456", 10);
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: hashPassword,
        firstName: "DinhMinh",
        lastName: "Nguyen",
        address: "VN",
        phonenumber: "0382065808",
        gender: 1,
        image: null,
        roleId: "ADMIN",
        positionId: "P0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
