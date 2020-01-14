const express = require("express");
const router = express.Router();
const { hasAuthorization, auth } = require("../../controllers/user/auth");
const {
  profile,
  createProfile,
  getProfile,
  updateProfile,
  getDoctorBySpecialities,
  getDoctorByAddress,
  createApointment,
  deleteAppointment,
  getAppointments,
  getAppointment,
  deleteReview,
  getReviews,
  postReview
} = require("../../controllers/user/user");

// user profile
router.get("/user/profile/:id", getProfile);
router.put("/user/profile", auth, createProfile);
router.put("/user/profile/:id", auth, hasAuthorization, updateProfile);
// search doctors
router.get("/getDoctorsBySpecialities",getDoctorBySpecialities);
router.get("/getDoctorByAddress", getDoctorByAddress);

// appointment
router.post('/user/createApointment',auth, createApointment)
router.delete('/user/deleteAppointment/:id',auth,hasAuthorization,deleteAppointment)
router.get('/user/getAppointments/:id',auth,hasAuthorization,getAppointments)
router.get('/user/getAppointment/:id',auth,hasAuthorization,getAppointment)
// user reviews doctor
router.get('/user/reviews',getReviews)
router.route("/user/review/:id")
      .post(auth,hasAuthorization,postReview)
      .delete(auth,hasAuthorization,deleteReview)
// delete user account soon...
router.param("id", profile);
module.exports = router;
