const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment")
exports.profile = async (req, res, next) => {
    const doctor = await Doctor.findById(req.params.id).select("-password -salt")
    if (!doctor) {
        return res.status(400).json({ error: 'Doctor not found with this id' })
    }
    req.profile = doctor
    next();
}

// getProfile
exports.getProfile = async (req, res) => {
    res.json(req.profile)
}

// update profile
exports.updateProfile = async (req, res) => {
    const { specialities, name, lastname,email,address } = req.body;
 
    let profile = req.profile
    if(specialities) profile.specialities = specialities;
    if(name) profile.name = name;
    if(lastname) profile.lastname = lastname;
    if(email) profile.email = email;
    if(address) profile.address = address;
    profile = await profile.save();
    profile.salt = undefined;
    profile.password = undefined;
    res.json(profile);
}
exports.getAppointments =async (req,res) => {
    let appointments = await Appointment.find({doctor: req.doctor._id}).populate('user' ,'-password -salt')
 
    if(appointments.length<1) return res.status(400).json({error:"Appointment has not been created"})
    res.json(appointments)
}

exports.deleteAppointment =async(req,res) => {
    await Appointment.findByIdAndRemove(req.query.a_id)
    res.json({msg:"Appointment has been canceled"})
  }
  exports.getAppointment = async(req,res) => {
    let appointment = await Appointment.findOne({_id: req.query.a_id}).populate('user' ,'-password -salt')
    !appointment && res.status(400).json({error:"Appointment has not been created"})
    res.json(appointment)
  }
// get Doctors
exports.getDoctors = async(req,res) => {
    const doctors = await Doctor.find({}).select(
      "-password -salt"
    );
    if(!doctors) {
        return res.status(400).json({error:" No doctors available"})
    }
    res.json(doctors)
}

