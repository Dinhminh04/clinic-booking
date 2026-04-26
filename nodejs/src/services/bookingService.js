const db = require("../models/index");

let createBooking = async (data) => {
  try {
    await db.Booking.create({
      statusId: data.statusId || "S1",
      doctorId: data.doctorId,
      patientID: data.patientID,
      date: data.date,
      timeType: data.timeType,
    });
    return { errCode: 0, errMessage: "OK" };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

let getBookingByPatient = async (patientId) => {
  try {
    let bookings = await db.Booking.findAll({
      where: { patientID: patientId },
    });
    return { errCode: 0, errMessage: "OK", data: bookings };
  } catch (e) {
    console.log(e);
    return { errCode: -1, errMessage: "Error" };
  }
};

module.exports = { createBooking, getBookingByPatient };
