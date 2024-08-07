import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers } from '../utils/memberStorage';
import '../styles/dstyle.css';

function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [memberCount, setMemberCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [totalFinance, setTotalFinance] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const members = getMembers();
      setMemberCount(members.length);
      const uniqueGroups = new Set(members.map(member => member.groupName));
      setGroupCount(uniqueGroups.size);

      // Calculate total finance from depositPaid and formFee
      const totalFinance = members.reduce((total, member) => {
        const depositPaid = parseFloat(member.depositPaid) || 0;
        const formFee = parseFloat(member.formFee) || 0;
        return total + depositPaid + formFee;
      }, 0);
      setTotalFinance(totalFinance);
    };

    loadData();

    // Add event listener for storage changes
    window.addEventListener('storage', loadData);

    // Cleanup
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const cards = [
    { title: 'Members', value: memberCount.toString(), change: '+6%', route: '/regmembers' },
    { title: 'Groups', value: groupCount.toString(), change: '-3%', route: '/groups' },
    { title: 'Projects', value: '7', change: '+9%', route: '/projects' }, // This value is static for now
    { title: 'Finances', value: `Ksh ${totalFinance.toFixed(2)}`, change: '+3%', route: '/finances' }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className={`dashboard ${theme}`}>
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

