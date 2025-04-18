// client/src/components/AlertBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AlertBanner = ({ alert }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="alert-banner">
      <div className="alert-icon">⚠️</div>
      <div className="alert-content">
        <h4>
          <Link to={`/patient/${alert.patientId}`}>
            {alert.patientName}
          </Link>
        </h4>
        <p>
          <strong>{alert.vitalType}:</strong> {alert.value}
        </p>
        <p className="alert-time">Recorded: {formatTime(alert.timestamp)}</p>
      </div>
    </div>
  );
};

export default AlertBanner;