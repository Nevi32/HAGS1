// src/components/Logo.js
import React from 'react';
import logoImage from '../assets/hags-logo.png'; // Make sure to add this image to your assets folder

function Logo() {
  return (
    <div className="logo">
      <img src={logoImage} alt="HAGS Avocado Grower" />
    </div>
  );
}

export default Logo;