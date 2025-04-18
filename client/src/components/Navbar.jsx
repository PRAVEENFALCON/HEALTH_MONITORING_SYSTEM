// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Healthcare Monitor</Link>
      </div>
      
      {isAuthenticated ? (
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;