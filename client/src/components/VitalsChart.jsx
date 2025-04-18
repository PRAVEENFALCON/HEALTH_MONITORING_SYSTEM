// client/src/components/VitalsChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalsChart = ({ data }) => {
  // Process data for chart
  const chartData = data.map(vital => {
    return {
      name: new Date(vital.recordedAt).toLocaleString(),
      heartRate: vital.heartRate?.value || null,
      temperature: vital.temperature?.value || null,
      systolic: vital.bloodPressure?.systolic || null,
      diastolic: vital.bloodPressure?.diastolic || null,
      respirationRate: vital.respirationRate?.value || null,
      oxygenSaturation: vital.oxygenSaturation?.value || null
    };
  }).reverse(); // Show oldest to newest

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="heartRate" 
          stroke="#ff4d4f" 
          activeDot={{ r: 8 }} 
          name="Heart Rate (bpm)" 
        />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#faad14" 
          name="Temperature (°C)" 
        />
        <Line 
          type="monotone" 
          dataKey="systolic" 
          stroke="#1890ff" 
          name="Systolic BP (mmHg)" 
        />
        <Line 
          type="monotone" 
          dataKey="diastolic" 
          stroke="#52c41a" 
          name="Diastolic BP (mmHg)" 
        />
        <Line 
          type="monotone" 
          dataKey="respirationRate" 
          stroke="#722ed1" 
          name="Respiration (breaths/min)" 
        />
        <Line 
          type="monotone" 
          dataKey="oxygenSaturation" 
          stroke="#13c2c2" 
          name="O2 Saturation (%)" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VitalsChart;