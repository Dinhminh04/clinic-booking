const db = require("../models/index");
const bcrypt = require("bcrypt");

let getAllDoctors = async (specialtyId) => {
  try {
    let doctors = await db.User.findAll({
      where: { roleId: "R2" },
      attributes: [
        "id",
        "email",
        "firstName",
        "lastName",
        "address",
        "phonenumber",
        "image",
        "positionId",
      ],
    });

    let result = [];
    for (let doctor of doctors) {
      let doctorData = doctor.toJSON();

      // Convert image buffer → base64
      if (doctorData.image && Buffer.isBuffer(doctorData.image)) {
        doctorData.image = doctorData.image.toString("base64");
      }

      let assignment = await db.Doctor_Clinic_Speciality.findOne({
        where: { doctorId: doctor.id },
      });
      if (assignment) {
        let clinic = await db.Clinic.findOne({
          where: { id: assignment.clinicID },
        });
        let specialty = await db.specialty.findOne({
          where: { id: assignment.specialityID },
        });
        doctorData.clinicName = clinic ? clinic.name : "";
        doctorData.specialtyName = specialty ? specialty.name : "";
        doctorData.specialtyId = assignment.specialityID;
        doctorData.clinicId = assignment.clinicID;
      } else {
        doctorData.clinicName = "";
        doctorData.specialtyName = "";
        doctorData.specialtyId = null;
        doctorData.clinicId = null;
      }
      result.push(doctorData);
    }

    if (specialtyId) {
      result = result.filter((d) => d.specialtyId === parseInt(specialtyId));
    }

    return { errCode: 0, errMessage: "OK", data: result };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let createDoctor = async (data) => {
  try {
    let hashPassword = await bcrypt.hash(data.password || "123456", 10);
    let doctor = await db.User.create({
      email: data.email,
      password: hashPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phonenumber: data.phonenumber,
      gender: 1,
      roleId: "R2",
      positionId: data.positionId || "P0",
      image: data.image || "",
    });
    if (data.specialtyId && data.clinicId) {
      await db.Doctor_Clinic_Speciality.create({
        doctorId: doctor.id,
        clinicID: data.clinicId,
        specialityID: data.specialtyId,
      });
    }
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let updateDoctor = async (data) => {
  try {
    let doctor = await db.User.findOne({ where: { id: data.id } });
    if (!doctor) return { errCode: 1, errMessage: "Doctor not found" };

    doctor.firstName = data.firstName;
    doctor.lastName = data.lastName;
    doctor.address = data.address;
    doctor.phonenumber = data.phonenumber;
    doctor.positionId = data.positionId;
    if (data.image) doctor.image = data.image;
    await doctor.save();

    // Update specialty + clinic
    if (data.specialtyId && data.clinicId) {
      let assignment = await db.Doctor_Clinic_Speciality.findOne({
        where: { doctorId: data.id },
      });
      if (assignment) {
        assignment.clinicID = data.clinicId;
        assignment.specialityID = data.specialtyId;
        await assignment.save();
      } else {
        await db.Doctor_Clinic_Speciality.create({
          doctorId: data.id,
          clinicID: data.clinicId,
          specialityID: data.specialtyId,
        });
      }
    }

    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let deleteDoctor = async (id) => {
  try {
    await db.Doctor_Clinic_Speciality.destroy({ where: { doctorId: id } });
    await db.User.destroy({ where: { id: id } });
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

module.exports = { getAllDoctors, createDoctor, updateDoctor, deleteDoctor };
