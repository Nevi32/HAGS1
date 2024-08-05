import React from 'react';
import logo from '../assets/h.jpg'; // Ensure this path is correct

function Logo() {
  return (
    <div className="logo-container lg:mb-0 mb-8">
      <img src={logo} alt="Logo" className="logo max-w-full max-h-full object-contain" />
    </div>
  );
}

export default Logo;

