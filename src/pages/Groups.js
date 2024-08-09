import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers } from '../utils/memberStorage';
import '../styles/groups.css';

function Groups() {
  const { theme } = useContext(ThemeContext);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadGroups = () => {
      const members = getMembers() || [];
      const groupedMembers = members.reduce((acc, member) => {
        if (!acc[member.groupName]) {
          acc[member.groupName] = [];
        }
        acc[member.groupName].push(member);
        return acc;
      }, {});
      setGroups(Object.keys(groupedMembers).map(groupName => ({
        groupName,
        memberCount: groupedMembers[groupName].length,
      })));
    };

    loadGroups();
    window.addEventListener('storage', loadGroups);

    return () => {
      window.removeEventListener('storage', loadGroups);
    };
  }, []);

  return (
    <div className={`groups-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Groups</h1>
        <div className="groups-container">
          {groups.map((group, index) => (
            <div key={index} className="group">
              <div className="group-name">{group.groupName}</div>
              <div className="group-count">{group.memberCount} Members</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Groups;
