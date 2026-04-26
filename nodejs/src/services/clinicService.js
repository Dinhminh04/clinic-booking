const db = require("../models/index");

let getAllClinics = async () => {
  try {
    let clinics = await db.Clinic.findAll();

    // Convert image buffer → base64 string
    let data = clinics.map((clinic) => {
      let plainClinic = clinic.get({ plain: true });
      if (plainClinic.image && Buffer.isBuffer(plainClinic.image)) {
        plainClinic.image = plainClinic.image.toString("base64");
      }
      return plainClinic;
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: data,
    };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let createClinic = async (data) => {
  try {
    await db.Clinic.create({
      name: data.name,
      address: data.address,
      description: data.description,
      image: data.image,
    });
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let updateClinic = async (data) => {
  try {
    let clinic = await db.Clinic.findOne({ where: { id: data.id } });
    if (!clinic) return { errCode: 1, errMessage: "Clinic not found" };
    clinic.name = data.name;
    clinic.address = data.address;
    clinic.description = data.description;
    clinic.image = data.image;
    await clinic.save();
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let deleteClinic = async (id) => {
  try {
    let clinic = await db.Clinic.findOne({ where: { id: id } });
    if (!clinic) return { errCode: 1, errMessage: "Clinic not found" };
    await clinic.destroy();
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

module.exports = {
  getAllClinics,
  createClinic,
  updateClinic,
  deleteClinic,
};
