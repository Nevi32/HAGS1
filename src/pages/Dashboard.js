import React, { useState } from 'react';
import Logo from '../assets/h.jpg';
import '../styles/dstyle.css';

function Dashboard() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const firstLetter = userInfo.email ? userInfo.email[0].toUpperCase() : 'U';
  const [menuOpen, setMenuOpen] = useState(false);

  const cards = [
    { title: 'Members', value: '43', change: '+6%' },
    { title: 'Groups', value: '17', change: '-3%' },
    { title: 'Projects', value: '7', change: '+9%' },
    { title: 'Finances', value: '$27.3k', change: '+3%' }
  ];

  const sections = ['Members', 'Projects'];

  const handleCardClick = (title) => {
    console.log(`Clicked on ${title} card`);
    // Add your logic here for what should happen when a card is clicked
  };

  return (
    <div className="dashboard">
      <header>
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="logo-text">HAGS</span>
        </div>
        <nav className={menuOpen ? 'open' : ''}>
          {sections.map((section, index) => (
            <a key={index} href={`#${section.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{section}</a>
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

      <main>
        <h1>Dashboard</h1>

        <div className="cards-container">
          {cards.map((card, index) => (
            <div key={index} className="card" onClick={() => handleCardClick(card.title)}>
              <div className="change" style={{color: card.change.includes('+') ? 'green' : 'red'}}>
                {card.change}
              </div>
              <div className="value">{card.value}</div>
              <div className="title">{card.title}</div>
            </div>
          ))}
        </div>

        <div className="charts-container">
          <div className="chart development-activity">
            <h2>Development Activity</h2>
            {/* Add your chart component here */}
          </div>
          <div className="chart-small">
            <h2>Chart title</h2>
            {/* Add your pie chart component here */}
          </div>
          <div className="chart-small">
            <h2>Chart title</h2>
            {/* Add your donut chart component here */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;