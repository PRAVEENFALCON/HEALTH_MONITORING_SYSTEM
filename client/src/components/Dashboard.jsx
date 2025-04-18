// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VitalsChart from './VitalsChart';
import AlertBanner from './AlertBanner';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
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
        
        const patientsRes = await axios.get('/api/patients', config);
        setPatients(patientsRes.data);
        
        // Find abnormal vitals for alerts
        const alertsList = [];
        
        for (const patient of patientsRes.data) {
          const vitalsRes = await axios.get(`/api/vitals/patient/${patient._id}/latest`, config);
          
          if (vitalsRes.data) {
            const vitals = vitalsRes.data;
            
            // Check for abnormal vitals
            if (vitals.heartRate && !vitals.heartRate.isNormal) {
              alertsList.push({
                patientId: patient._id,
                patientName: patient.name,
                vitalType: 'Heart Rate',
                value: `${vitals.heartRate.value} ${vitals.heartRate.unit}`,
                timestamp: vitals.recordedAt
              });
            }
            
            if (vitals.temperature && !vitals.temperature.isNormal) {
              alertsList.push({
                patientId: patient._id,
                patientName: patient.name,
                vitalType: 'Temperature',
                value: `${vitals.temperature.value} ${vitals.temperature.unit}`,
                timestamp: vitals.recordedAt
              });
            }
            
            if (vitals.bloodPressure && !vitals.bloodPressure.isNormal) {
              alertsList.push({
                patientId: patient._id,
                patientName: patient.name,
                vitalType: 'Blood Pressure',
                value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} ${vitals.bloodPressure.unit}`,
                timestamp: vitals.recordedAt
              });
            }
            
            // Add more vitals checks here
          }
        }
        
        setAlerts(alertsList);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Healthcare Monitoring Dashboard</h1>
      
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2>Critical Alerts</h2>
          {alerts.map((alert, index) => (
            <AlertBanner key={index} alert={alert} />
          ))}
        </div>
      )}
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <div className="stat-value">{patients.length}</div>
        </div>
        <div className="stat-card">
          <h3>Critical Alerts</h3>
          <div className="stat-value">{alerts.length}</div>
        </div>
      </div>
      
      <div className="recent-patients">
        <h2>Recent Patients</h2>
        <div className="patient-list">
          {patients.slice(0, 5).map((patient) => (
            <Link to={`/patient/${patient._id}`} key={patient._id} className="patient-card">
              <h3>{patient.name}</h3>
              <p>Age: {patient.age}</p>
              <p>Gender: {patient.gender}</p>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="vitals-overview">
        <h2>Average Vitals</h2>
        <VitalsChart patients={patients} />
      </div>
    </div>
  );
};

export default Dashboard;