const User = require("../../models/User");
const Doctor = require("../../models/Doctor");
const Review = require("../../models/Review");
const Appointment = require("../../models/Appointment");
exports.profile = async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -salt");
  if (!user) {
    return res.status(400).json({ error: "User not found with this id" });
  }
  req.profile = user;
  next();
};

// getProfile
exports.getProfile = async (req, res) => {
  res.json(req.profile);
};

// create profile
exports.createProfile = async (req, res) => {
  const { address, dob, phoneno } = req.body;
  let profile = await User.findOne({ _id: req.user._id, phoneno });
  if (profile) {
    return res.status(403).json({
      error: "Profile is already added!"
    });
  }
  profile = req.user
  profile.address = address;
  profile.dob = dob;
  profile.phoneno = phoneno;
  profile = await profile.save();
  profile.salt = undefined;
  profile.password = undefined;
  res.json(profile);
};
// update profile
exports.updateProfile = async (req, res) => {
  const { address, dob, phoneno, email, name, lastname } = req.body;
  let profile = req.profile;
  address && (profile.address = address);
  dob && (profile.dob = dob);
  phoneno && (profile.phoneno = phoneno);
  email && (profile.email = email);
  name && (profile.name = name);
  lastname && (profile.lastname = lastname);
  await profile.save();
    res.json(profile);
};

exports.getDoctorBySpecialities = async(req, res) => {
  const doctors = await Doctor.find({
    specialities: { $regex: req.query.specialities, $options: "i" }
  }).select('-password -salt')
    if (doctors.length === 0) {
      return res.status(400).json({error: "No doctor found"})
    }
    res.json(doctors)
};
exports.getDoctorByAddress = async(req, res) => {
  let doctors = await Doctor.find({address: { $regex: req.query.address, $options: "i" }})
  .select('-password -salt')
    if (doctors.length === 0) {
    return res.status(400).json({ error: 'No doctors found ' });
  }
  res.json(doctors);
};
// appointment
exports.createApointment = async(req,res) => {
  let newAppointment = {
    preferedtime : req.query.pt,
    user: req.user._id,
    doctor: req.query.d_id,
    status: 'inactive'
  }
  newAppointment = new Appointment(newAppointment)
  newAppointment = await newAppointment.save()
  res.json(newAppointment)
}
exports.deleteAppointment =async(req,res) => {
  await Appointment.findByIdAndRemove(req.query.a_id)
  res.json({msg:"Appointment has been canceled"})
}
exports.getAppointments =async (req,res) => {
  let appointments = await Appointment.find({user: req.user._id}).populate('doctor' ,'-password -salt')
  
  if(appointments.length<1) {return res.status(400).json({error:"Appointment has not been created"})}
  res.json(appointments)
}
exports.getAppointment =async (req,res) => {
  let appointment = await Appointment.findOne({_id: req.query.a_id}).populate('doctor' ,'-password -salt')
  !appointment && res.status(400).json({error:"Appointment not found"})
  res.json(appointment)
}
// review a doctor
exports.postReview = async(req,res) => {
  const doctor = await Doctor.findById(req.query.d_id)
  if (!doctor) {
    return res.status(400).json({ error: "Doctor not found with this id" });
  }
  let newReview = {
    user: req.user._id,
    doctor: doctor._id,
    comment: req.body.comment
  }
  newReview = new Review(newReview)
  await newReview.save()
  res.json(newReview)
}
exports.getReviews = async(req,res) => {
  const reviews = await Review.find({doctor:req.query.d_id}).populate('user','-password -salt')
  if (reviews.length<1) {
    return res.status(400).json({ error: "No comments available" });
  }
  res.json(reviews)
}
exports.deleteReview= async (req,res) => {
 await Review.findByIdAndRemove(req.query.cmt_id)
 res.json({msg:'comment deleted'})
}
