// client/src/components/PatientDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VitalsChart from './VitalsChart';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const patientRes = await axios.get(`/api/patients/${id}`, config);
        setPatient(patientRes.data);
        
        const vitalsRes = await axios.get(`/api/vitals/patient/${id}`, config);
        setVitals(vitalsRes.data);
        
        setLoading(false);
      } catch (error) {
        setError('Error fetching patient data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!patient) {
    return <div className="error">Patient not found</div>;
  }

  return (
    <div className="patient-detail">
      <h1>{patient.name}</h1>
      
      <div className="patient-info">
        <div className="info-card">
          <h3>Personal Information</h3>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Contact:</strong> {patient.contactNumber}</p>
        </div>
        
        <div className="info-card">
          <h3>Emergency Contact</h3>
          <p><strong>Name:</strong> {patient.emergencyContact?.name}</p>
          <p><strong>Relationship:</strong> {patient.emergencyContact?.relationship}</p>
          <p><strong>Contact:</strong> {patient.emergencyContact?.contactNumber}</p>
        </div>
      </div>
      
      <div className="medical-history">
        <h3>Medical History</h3>
        <div className="history-items">
          <div>
            <h4>Conditions</h4>
            <ul>
              {patient.medicalHistory?.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4>Allergies</h4>
            <ul>
              {patient.medicalHistory?.allergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4>Medications</h4>
            <ul>
              {patient.medicalHistory?.medications.map((medication, index) => (
                <li key={index}>{medication}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="vitals-history">
        <h2>Vitals History</h2>
        {vitals.length > 0 ? (
          <>
            <div className="latest-vitals">
              <h3>Latest Vitals (Recorded: {new Date(vitals[0].recordedAt).toLocaleString()})</h3>
              <div className="vitals-grid">
                {vitals[0].heartRate && (
                  <div className={`vital-card ${!vitals[0].heartRate.isNormal ? 'abnormal' : ''}`}>
                    <h4>Heart Rate</h4>
                    <div className="vital-value">{vitals[0].heartRate.value} {vitals[0].heartRate.unit}</div>
                    <div className="normal-range">Normal: 60-100 bpm</div>
                  </div>
                )}
                
                {vitals[0].temperature && (
                  <div className={`vital-card ${!vitals[0].temperature.isNormal ? 'abnormal' : ''}`}>
                    <h4>Temperature</h4>
                    <div className="vital-value">{vitals[0].temperature.value} {vitals[0].temperature.unit}</div>
                    <div className="normal-range">Normal: 36.1-37.2°C</div>
                  </div>
                )}
                
                {vitals[0].bloodPressure && (
                  <div className={`vital-card ${!vitals[0].bloodPressure.isNormal ? 'abnormal' : ''}`}>
                    <h4>Blood Pressure</h4>
                    <div className="vital-value">
                      {vitals[0].bloodPressure.systolic}/{vitals[0].bloodPressure.diastolic} {vitals[0].bloodPressure.unit}
                    </div>
                    <div className="normal-range">Normal: 90-120/60-80 mmHg</div>
                  </div>
                )}
                
                {vitals[0].respirationRate && (
                  <div className={`vital-card ${!vitals[0].respirationRate.isNormal ? 'abnormal' : ''}`}>
                    <h4>Respiration Rate</h4>
                    <div className="vital-value">
                      {vitals[0].respirationRate.value} {vitals[0].respirationRate.unit}
                    </div>
                    <div className="normal-range">Normal: 12-20 breaths/min</div>
                  </div>
                )}
                
                {vitals[0].oxygenSaturation && (
                  <div className={`vital-card ${!vitals[0].oxygenSaturation.isNormal ? 'abnormal' : ''}`}>
                    <h4>Oxygen Saturation</h4>
                    <div className="vital-value">
                      {vitals[0].oxygenSaturation.value} {vitals[0].oxygenSaturation.unit}
                    </div>
                    <div className="normal-range">Normal: 95-100%</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="vitals-chart">
              <h3>Vitals Trend</h3>
              <VitalsChart data={vitals} />
            </div>
          </>
        ) : (
          <p>No vitals data available for this patient.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;