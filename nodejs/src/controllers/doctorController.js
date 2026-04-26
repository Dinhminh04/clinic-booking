const doctorService = require("../services/doctorService");

let getAllDoctors = async (req, res) => {
  try {
    let specialtyId = req.query.specialtyId || null;
    let data = await doctorService.getAllDoctors(specialtyId);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let createDoctor = async (req, res) => {
  try {
    let data = await doctorService.createDoctor(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let updateDoctor = async (req, res) => {
  try {
    let data = await doctorService.updateDoctor(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let deleteDoctor = async (req, res) => {
  try {
    let data = await doctorService.deleteDoctor(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

module.exports = { getAllDoctors, createDoctor, updateDoctor, deleteDoctor };
