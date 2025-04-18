// server/controllers/vitalsController.js
const Vitals = require('../models/Vitals');
const Patient = require('../models/Patient');

// Get all vitals for a patient
exports.getPatientVitals = async (req, res) => {
  try {
    const vitals = await Vitals.find({ patientId: req.params.patientId }).sort({ recordedAt: -1 });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get latest vitals for a patient
exports.getLatestVitals = async (req, res) => {
  try {
    const latestVitals = await Vitals.findOne({ patientId: req.params.patientId }).sort({ recordedAt: -1 });
    
    if (latestVitals) {
      res.json(latestVitals);
    } else {
      res.status(404).json({ message: 'No vitals found for this patient' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add new vitals record
exports.addVitals = async (req, res) => {
  try {
    // Check if patient exists
    const patient = await Patient.findById(req.params.patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Process vital signs and determine if they're normal
    const vitalData = {
      patientId: req.params.patientId,
      ...req.body
    };
    
    // Check heart rate normal range (60-100 bpm for adults)
    if (vitalData.heartRate) {
      vitalData.heartRate.isNormal = 
        vitalData.heartRate.value >= 60 && vitalData.heartRate.value <= 100;
    }
    
    // Check temperature normal range (36.1-37.2°C)
    if (vitalData.temperature) {
      vitalData.temperature.isNormal = 
        vitalData.temperature.value >= 36.1 && vitalData.temperature.value <= 37.2;
    }
    
    // Check blood pressure normal range (systolic: 90-120, diastolic: 60-80)
    if (vitalData.bloodPressure) {
      vitalData.bloodPressure.isNormal = 
        vitalData.bloodPressure.systolic >= 90 && 
        vitalData.bloodPressure.systolic <= 120 &&
        vitalData.bloodPressure.diastolic >= 60 && 
        vitalData.bloodPressure.diastolic <= 80;
    }
    
    // Check respiration rate normal range (12-20 breaths/min)
    if (vitalData.respirationRate) {
      vitalData.respirationRate.isNormal = 
        vitalData.respirationRate.value >= 12 && vitalData.respirationRate.value <= 20;
    }
    
    // Check oxygen saturation normal range (95-100%)
    if (vitalData.oxygenSaturation) {
      vitalData.oxygenSaturation.isNormal = 
        vitalData.oxygenSaturation.value >= 95 && vitalData.oxygenSaturation.value <= 100;
    }
    
    const vitals = new Vitals(vitalData);
    const savedVitals = await vitals.save();
    
    res.status(201).json(savedVitals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};