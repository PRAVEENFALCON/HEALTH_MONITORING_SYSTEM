// server/models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  contactNumber: {
    type: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    contactNumber: String
  },
  medicalHistory: {
    conditions: [String],
    allergies: [String],
    medications: [String]
  },
  registeredDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);