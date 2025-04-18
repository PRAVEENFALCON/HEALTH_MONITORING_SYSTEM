// server/routes/vitalsRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getPatientVitals, 
  getLatestVitals, 
  addVitals 
} = require('../controllers/vitalsController');
const { protect } = require('../middleware/auth');

router.route('/patient/:patientId')
  .get(protect, getPatientVitals);

router.route('/patient/:patientId/latest')
  .get(protect, getLatestVitals);

router.route('/patient/:patientId')
  .post(protect, addVitals);

module.exports = router;