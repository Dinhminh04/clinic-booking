const bookingService = require("../services/bookingService");

let createBooking = async (req, res) => {
  try {
    let data = await bookingService.createBooking(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

let getBookingByPatient = async (req, res) => {
  try {
    let data = await bookingService.getBookingByPatient(req.query.patientId);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ errCode: -1, errMessage: "Error" });
  }
};

module.exports = { createBooking, getBookingByPatient };
