const mongoose = require("mongoose");
const Schema = mongoose.Schema
const appointmentSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    preferedtime: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'doctor',
    },
    status:{
        type: String,
        enum: ['inactive','active','complete']
    }
});

module.exports = mongoose.model("appointment", appointmentSchema);