const db = require("../models/index");
const bcrypt = require("bcrypt");

let handleUserLogin = async (email, password) => {
  try {
    let userData = {};
    let isExist = await checkUserEmail(email);

    if (!isExist) {
      userData.errCode = 1;
      userData.errMessage = "Email không tồn tại trong hệ thống!";
      return userData;
    }

    let user = await db.User.findOne({
      where: { email: email },
      attributes: ["email", "roleId", "password", "firstName", "lastName"],
    });

    if (user) {
      let check = await bcrypt.compare(password, user.password);
      if (!check) {
        userData.errCode = 2;
        userData.errMessage = "Sai mật khẩu!";
        return userData;
      }

      userData.errCode = 0;
      userData.errMessage = "OK";
      delete user.password;
      userData.user = user;
    }

    return userData;
  } catch (e) {
    console.log(e);
  }
};

let checkUserEmail = async (email) => {
  let user = await db.User.findOne({ where: { email: email } });
  return !!user;
};

module.exports = {
  handleUserLogin,
};
