import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMembers, updateMember } from '../utils/memberStorage';
import '../styles/viewmembers.css';

function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchedMembers = getAllMembers();
    setMembers(fetchedMembers);
  }, []);

  const handleEditClick = (member) => {
    setEditingMemberId(member.memberUniqueId);
    setEditFormData({ ...member });
  };

  const handleCancelClick = () => {
    setEditingMemberId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = () => {
    updateMember(editingMemberId, editFormData);
    setMembers(members.map(member => member.memberUniqueId === editingMemberId ? editFormData : member));
    setEditingMemberId(null);
    setEditFormData({});
  };

  return (
    <div className="view-members-page">
      <Navbar />
      <main>
        <h1>View Members</h1>

        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>National ID</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Group Name</th>
              <th>Project ID</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.memberUniqueId}>
                <td>{member.fullName}</td>
                <td>{member.nationalId}</td>
                <td>{member.contact}</td>
                <td>{member.status}</td>
                <td>{member.groupName}</td>
                <td>{member.projectId}</td>
                <td>
                  <button onClick={() => handleEditClick(member)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingMemberId && (
          <div className="edit-form-container">
            <h2>Edit Member</h2>
            <form>
              <label>
                Full Name:
                <input type="text" name="fullName" value={editFormData.fullName} onChange={handleEditFormChange} required />
              </label>
              <label>
                National ID:
                <input type="text" name="nationalId" value={editFormData.nationalId} onChange={handleEditFormChange} required />
              </label>
              <label>
                Contact:
                <input type="tel" name="contact" value={editFormData.contact} onChange={handleEditFormChange} required />
              </label>
              <label>
                Status:
                <select name="status" value={editFormData.status} onChange={handleEditFormChange} required>
                  <option value="Chairperson">Chairperson</option>
                  <option value="Vice-Chairperson">Vice-Chairperson</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="project-manager">Project Manager</option>
                  <option value="regular-member">Regular Member</option>
                </select>
              </label>
              <label>
                Group Name:
                <input type="text" name="groupName" value={editFormData.groupName} onChange={handleEditFormChange} required />
              </label>
              <label>
                Project ID:
                <input type="text" name="projectId" value={editFormData.projectId} readOnly />
              </label>
            </form>
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewMembers;
