const clinicService = require("../services/clinicService");

let getAllClinics = async (req, res) => {
  try {
    let data = await clinicService.getAllClinics();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let createClinic = async (req, res) => {
  try {
    let data = await clinicService.createClinic(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let updateClinic = async (req, res) => {
  try {
    let data = await clinicService.updateClinic(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let deleteClinic = async (req, res) => {
  try {
    let data = await clinicService.deleteClinic(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

module.exports = {
  getAllClinics,
  createClinic,
  updateClinic,
  deleteClinic,
};
