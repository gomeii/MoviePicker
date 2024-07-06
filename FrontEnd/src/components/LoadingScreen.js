import React from 'react';
import './styling/LoadingScreen.css'; // Create this CSS file for loading styles

const LoadingScreen = () => {
  return (
    <div className="loading-screen ">
      <div className="spinner"></div>
      <h2>Loading...</h2>
    </div>
  );
};

export default LoadingScreen;