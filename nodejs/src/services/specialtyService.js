const db = require("../models/index");

let getAllSpecialties = async () => {
  try {
    let specialties = await db.specialty.findAll();

    // Đếm số bác sĩ cho mỗi chuyên khoa
    let data = [];
    for (let s of specialties) {
      let plain = s.toJSON();
      let count = await db.Doctor_Clinic_Speciality.count({
        where: { specialityID: s.id },
      });
      plain.doctorCount = count;
      plain.image =
        plain.image && Buffer.isBuffer(plain.image)
          ? plain.image.toString("base64")
          : plain.image;
      data.push(plain);
    }

    return { errCode: 0, errMessage: "OK", data };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let createSpecialty = async (data) => {
  try {
    await db.specialty.create({
      name: data.name,
      description: data.description,
      image: data.image,
    });
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let updateSpecialty = async (data) => {
  try {
    let specialty = await db.specialty.findOne({ where: { id: data.id } });
    if (!specialty) return { errCode: 1, errMessage: "Specialty not found" };
    specialty.name = data.name;
    specialty.description = data.description;
    if (data.image) specialty.image = data.image;
    await specialty.save();
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let deleteSpecialty = async (id) => {
  try {
    let specialty = await db.specialty.findOne({ where: { id: id } });
    if (!specialty) return { errCode: 1, errMessage: "Specialty not found" };
    await specialty.destroy();
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

module.exports = {
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
