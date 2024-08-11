import React, { useContext, useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers, saveMembers } from '../utils/memberStorage';
import '../styles/ViewMembers.css';

function ViewMembers() {
  const { theme } = useContext(ThemeContext);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState(null);

  const loadMembers = useCallback(() => {
    const storedMembers = getMembers();
    setMembers(storedMembers);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, '')) ||
    member.groupName.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, ''))
  );

  const handleEdit = (member) => {
    setEditingMember(member);
  };

  const handleDelete = (memberUniqueId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const updatedMembers = members.filter(m => m.memberUniqueId !== memberUniqueId);
      setMembers(updatedMembers);
      saveMembers(updatedMembers);
    }
  };

  const handleSave = (editedMember) => {
    const updatedMembers = members.map(m => 
      m.memberUniqueId === editedMember.memberUniqueId ? editedMember : m
    );
    setMembers(updatedMembers);
    saveMembers(updatedMembers);
    setEditingMember(null);
  };

  return (
    <div className={`view-members-page ${theme}`}>
      <Navbar />
      <main>
        <h1>View Members</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by member name or group..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="members-list">
          {filteredMembers.map((member) => (
            <div key={member.memberUniqueId} className="member-card">
              <h2>{member.fullName}</h2>
              <p><strong>National ID:</strong> {member.nationalId}</p>
              <p><strong>Contact:</strong> {member.contact}</p>
              <p><strong>Status:</strong> {member.status}</p>
              <p><strong>Group Name:</strong> {member.groupName}</p>
              <p><strong>Member Unique ID:</strong> {member.memberUniqueId}</p>
              <p><strong>Date of Admission:</strong> {member.dateOfAdmission}</p>
              <p><strong>Next of Kin:</strong> {member.nextOfKin}</p>
              <p><strong>Next of Kin Contact:</strong> {member.nextOfKinContact}</p>
              <p><strong>County:</strong> {member.county}</p>
              <p><strong>Sub-County:</strong> {member.subCounty}</p>
              <p><strong>Ward:</strong> {member.ward}</p>
              <p><strong>Location:</strong> {member.location}</p>
              <p><strong>Sub-Location:</strong> {member.subLocation}</p>
              <p><strong>Village:</strong> {member.village}</p>
              <div className="member-actions">
                <button onClick={() => handleEdit(member)}>Edit</button>
                <button onClick={() => handleDelete(member.memberUniqueId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {editingMember && (
        <EditMemberForm 
          member={editingMember} 
          onSave={handleSave} 
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  );
}

function EditMemberForm({ member, onSave, onClose }) {
  const [editedMember, setEditedMember] = useState(member);

  const handleChange = (e) => {
    setEditedMember({ ...editedMember, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedMember);
  };

  return (
    <div className="edit-member-overlay">
      <div className="edit-member-form">
        <h2>Edit Member</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input type="text" name="fullName" value={editedMember.fullName} onChange={handleChange} />
          </label>
          <label>
            National ID:
            <input type="text" name="nationalId" value={editedMember.nationalId} onChange={handleChange} />
          </label>
          <label>
            Contact:
            <input type="tel" name="contact" value={editedMember.contact} onChange={handleChange} />
          </label>
          <label>
            Status:
            <select name="status" value={editedMember.status} onChange={handleChange}>
              <option value="Chairperson">Chairperson</option>
              <option value="Vice-Chairperson">Vice-Chairperson</option>
              <option value="Treasurer">Treasurer</option>
              <option value="project-manager">Project Manager</option>
              <option value="regular-member">Regular Member</option>
            </select>
          </label>
          <label>
            Group Name:
            <input type="text" name="groupName" value={editedMember.groupName} onChange={handleChange} />
          </label>
          <label>
            Date of Admission:
            <input type="date" name="dateOfAdmission" value={editedMember.dateOfAdmission} onChange={handleChange} />
          </label>
          <label>
            Next of Kin:
            <input type="text" name="nextOfKin" value={editedMember.nextOfKin} onChange={handleChange} />
          </label>
          <label>
            Next of Kin Contact:
            <input type="tel" name="nextOfKinContact" value={editedMember.nextOfKinContact} onChange={handleChange} />
          </label>
          <label>
            County:
            <input type="text" name="county" value={editedMember.county} onChange={handleChange} />
          </label>
          <label>
            Sub-County:
            <input type="text" name="subCounty" value={editedMember.subCounty} onChange={handleChange} />
          </label>
          <label>
            Ward:
            <input type="text" name="ward" value={editedMember.ward} onChange={handleChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={editedMember.location} onChange={handleChange} />
          </label>
          <label>
            Sub-Location:
            <input type="text" name="subLocation" value={editedMember.subLocation} onChange={handleChange} />
          </label>
          <label>
            Village:
            <input type="text" name="village" value={editedMember.village} onChange={handleChange} />
          </label>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ViewMembers;