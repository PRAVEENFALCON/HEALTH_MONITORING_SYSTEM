// server/models/Vitals.js
const mongoose = require('mongoose');

const VitalsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  heartRate: {
    value: Number,
    unit: {
      type: String,
      default: 'bpm'
    },
    isNormal: Boolean
  },
  temperature: {
    value: Number,
    unit: {
      type: String,
      default: '°C'
    },
    isNormal: Boolean
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
    unit: {
      type: String,
      default: 'mmHg'
    },
    isNormal: Boolean
  },
  respirationRate: {
    value: Number,
    unit: {
      type: String,
      default: 'breaths/min'
    },
    isNormal: Boolean
  },
  oxygenSaturation: {
    value: Number,
    unit: {
      type: String,
      default: '%'
    },
    isNormal: Boolean
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Vitals', VitalsSchema);
