// src/components/Navbar.js

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartBar, FaUsers, FaBolt } from 'react-icons/fa';
import Logo from '../assets/h.jpg';
import '../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const firstLetter = userInfo.email ? userInfo.email[0].toUpperCase() : 'U';
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { name: 'Dashboard', icon: FaChartBar, route: '/dashboard' },
    { name: 'Members', icon: FaUsers, route: '/viewmembers' },
    { name: 'Quick', icon: FaBolt, route: '' }
  ];

  const handleNavClick = (route) => {
    if (route) {
      navigate(route);
      setMenuOpen(false);
    }
  };

  return (
    <header>
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
        <span className="logo-text">HAGS</span>
      </div>
      <nav className={menuOpen ? 'open' : ''}>
        {sections.map((section, index) => (
          <button 
            key={index} 
            onClick={() => handleNavClick(section.route)}
            className={`nav-button ${location.pathname === section.route ? 'active' : ''}`}
          >
            <section.icon /> {section.name}
          </button>
        ))}
      </nav>
      <div className="profile">
        <div className="avatar">{firstLetter}</div>
        <span className="user-name">{userInfo.name || userInfo.email}</span>
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </header>
  );
}

export default Navbar;