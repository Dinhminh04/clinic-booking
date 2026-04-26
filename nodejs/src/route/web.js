const express = require("express");
const homeController = require("../controllers/homeController");
const userController = require("../controllers/userController");
const clinicController = require("../controllers/clinicController");
const specialtyController = require("../controllers/specialtyController");
const doctorController = require("../controllers/doctorController");
const bookingController = require("../controllers/bookingController");
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomPage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // API Auth
  router.post("/api/login", userController.handleLogin);

  // API Clinic
  router.get("/api/get-all-clinics", clinicController.getAllClinics);
  router.post("/api/create-clinic", clinicController.createClinic);
  router.put("/api/update-clinic", clinicController.updateClinic);
  router.delete("/api/delete-clinic", clinicController.deleteClinic);

  // API Specialty
  router.get("/api/get-all-specialties", specialtyController.getAllSpecialties);
  router.post("/api/create-specialty", specialtyController.createSpecialty);
  router.put("/api/update-specialty", specialtyController.updateSpecialty);
  router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);
  // API Doctor
  router.put("/api/update-doctor", doctorController.updateDoctor);
  router.post("/api/create-doctor", doctorController.createDoctor);
  router.delete("/api/delete-doctor", doctorController.deleteDoctor);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);

  router.post("/api/create-booking", bookingController.createBooking);
  router.get(
    "/api/get-booking-by-patient",
    bookingController.getBookingByPatient,
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
