import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers, saveMembers } from '../utils/memberStorage';
import '../styles/groups.css';

function Groups() {
  const { theme } = useContext(ThemeContext);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadGroups();
    window.addEventListener('storage', loadGroups);
    return () => {
      window.removeEventListener('storage', loadGroups);
    };
  }, []);

  const loadGroups = () => {
    const members = getMembers();
    const groupsData = members.reduce((acc, member) => {
      if (!acc[member.groupName]) {
        acc[member.groupName] = { name: member.groupName, members: [] };
      }
      acc[member.groupName].members.push(member);
      return acc;
    }, {});
    setGroups(Object.values(groupsData));
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (group) => {
    setEditingGroup(group);
    setEditName(group.name);
  };

  const handleSave = () => {
    const members = getMembers();
    const updatedMembers = members.map(member => 
      member.groupName === editingGroup.name ? { ...member, groupName: editName } : member
    );
    saveMembers(updatedMembers);
    loadGroups();
    setEditingGroup(null);
    showPopup('Group updated successfully', 'success');
    window.dispatchEvent(new Event('storage'));
  };

  const handleDelete = (group) => {
    if (window.confirm(`Are you sure you want to delete the group "${group.name}" and all its members?`)) {
      const members = getMembers();
      const updatedMembers = members.filter(member => member.groupName !== group.name);
      saveMembers(updatedMembers);
      loadGroups();
      showPopup('Group and its members deleted successfully', 'success');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className={`groups-page ${theme}`}>
      <Navbar />
      <main>
        <div className="content-wrapper">
          <div className="search-bar-container">
            <h1>Groups</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="groups-grid-container">
            <div className="groups-grid">
              {filteredGroups.map(group => (
                <div key={group.name} className="group-card">
                  {editingGroup === group ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="edit-input"
                      />
                      <button onClick={handleSave} className="save-btn">Save</button>
                    </>
                  ) : (
                    <>
                      <h2>{group.name}</h2>
                      <p>Total Members: {group.members.length}</p>
                      <div className="card-actions">
                        <button onClick={() => handleEdit(group)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(group)} className="delete-btn">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default Groups;
