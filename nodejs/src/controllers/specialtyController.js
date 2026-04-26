const specialtyService = require("../services/specialtyService");

let getAllSpecialties = async (req, res) => {
  try {
    let data = await specialtyService.getAllSpecialties();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let createSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let updateSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.updateSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let deleteSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.deleteSpecialty(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

module.exports = {
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
