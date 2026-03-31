import React from 'react';

const DashboardIdentity = ({ name, role }) => {
  const containerStyle = {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f4f7f9',
    borderRadius: '8px',
    border: '1px solid #e1e8ed',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#007bff', margin: '0' }}>Welcome, {name}!</h2>
      <p style={{ color: '#555', fontSize: '18px' }}>Role: <strong>{role}</strong></p>
    </div>
  );
};

export default DashboardIdentity;