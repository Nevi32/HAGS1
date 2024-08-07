// src/pages/Dashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dstyle.css';

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Members', value: '43', change: '+6%', route: '/regmembers' },
    { title: 'Groups', value: '17', change: '-3%', route: '/groups' },
    { title: 'Projects', value: '7', change: '+9%', route: '/projects' },
    { title: 'Finances', value: '$27.3k', change: '+3%', route: '/finances' }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <main>
        <h1>Dashboard</h1>

        <div className="cards-container">
          {cards.map((card, index) => (
            <div key={index} className="card" onClick={() => handleCardClick(card.route)}>
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