const express = require('express')
const router = express.Router()
const { hasAuthorization, auth } = require('../../controllers/doctor/auth')
const { getProfile,updateProfile, profile,  getDoctors,deleteAppointment,getAppointment,getAppointments} = require('../../controllers/doctor/doctor')


// docotor profile
router
  .route("/doctor/profile/:id")
  .get(getProfile)
  .put(auth, hasAuthorization, updateProfile)
router.get('/doctor/getdoctors',getDoctors)

// appointment
router.delete('/doctor/deleteAppointment/:id',auth,hasAuthorization,deleteAppointment)
router.get('/doctor/getAppointments/:id',auth,hasAuthorization,getAppointments)
router.get('/doctor/getAppointment/:id',auth,hasAuthorization,getAppointment)

// delete docotor account soon...
router.param('id', profile)
module.exports = router
