import React, { useContext, useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers, saveMembers } from '../utils/memberStorage';
import '../styles/projects.css';

function Projects() {
  const { theme } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState(null);

  const loadProjects = useCallback(() => {
    const members = getMembers();
    setProjects(members.map(member => ({
      ...member,
      projectId: member.projectId || generateProjectId()
    })));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const generateProjectId = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const filteredProjects = projects.filter(project => 
    project.fullName.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, '')) ||
    project.groupName.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, ''))
  );

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.projectId !== projectId);
      setProjects(updatedProjects);
      saveMembers(updatedProjects);
    }
  };

  const handleSave = (editedProject) => {
    const updatedProjects = projects.map(p => 
      p.projectId === editedProject.projectId ? editedProject : p
    );
    setProjects(updatedProjects);
    saveMembers(updatedProjects);
    setEditingProject(null);
  };

  return (
    <div className={`projects-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Projects</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by member name or group..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="projects-list">
          {filteredProjects.map((project) => (
            <div key={project.projectId} className="project-card">
              <h2>{project.fullName}</h2>
              <p><strong>Group:</strong> {project.groupName}</p>
              <p><strong>Contact:</strong> {project.contact}</p>
              <p><strong>Project ID:</strong> {project.projectId}</p>
              <p><strong>Seedlings:</strong> {project.varietyOfSeedlings} ({project.numberOfSeedlingsOrdered})</p>
              <p><strong>Amount to be Paid:</strong> Ksh {project.amountToBePaid}</p>
              <p><strong>Amount Paid:</strong> Ksh {project.amountPaid}</p>
              <p><strong>Deposit Paid:</strong> Ksh {project.depositPaid}</p>
              <p><strong>Balance:</strong> Ksh {project.balance}</p>
              <p><strong>Payment Date:</strong> {project.dateOfPayment}</p>
              <p><strong>Complete Payment By:</strong> {project.dateToCompletePayment}</p>
              <div className="project-actions">
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button onClick={() => handleDelete(project.projectId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {editingProject && (
        <EditProjectForm 
          project={editingProject} 
          onSave={handleSave} 
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}

function EditProjectForm({ project, onSave, onClose }) {
  const [editedProject, setEditedProject] = useState(project);

  const handleChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProject);
  };

  return (
    <div className="edit-project-overlay">
      <div className="edit-project-form">
        <h2>Edit Project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input type="text" name="fullName" value={editedProject.fullName} onChange={handleChange} />
          </label>
          <label>
            Group Name:
            <input type="text" name="groupName" value={editedProject.groupName} onChange={handleChange} />
          </label>
          <label>
            Contact:
            <input type="text" name="contact" value={editedProject.contact} onChange={handleChange} />
          </label>
          <label>
            Project ID:
            <input type="text" name="projectId" value={editedProject.projectId} readOnly />
          </label>
          <label>
            Variety of Seedlings:
            <input type="text" name="varietyOfSeedlings" value={editedProject.varietyOfSeedlings} onChange={handleChange} />
          </label>
          <label>
            Number of Seedlings Ordered:
            <input type="number" name="numberOfSeedlingsOrdered" value={editedProject.numberOfSeedlingsOrdered} onChange={handleChange} />
          </label>
          <label>
            Amount to be Paid:
            <input type="number" name="amountToBePaid" value={editedProject.amountToBePaid} onChange={handleChange} />
          </label>
          <label>
            Amount Paid:
            <input type="number" name="amountPaid" value={editedProject.amountPaid} onChange={handleChange} />
          </label>
          <label>
            Deposit Paid:
            <input type="number" name="depositPaid" value={editedProject.depositPaid} onChange={handleChange} />
          </label>
          <label>
            Balance:
            <input type="number" name="balance" value={editedProject.balance} onChange={handleChange} />
          </label>
          <label>
            Date of Payment:
            <input type="date" name="dateOfPayment" value={editedProject.dateOfPayment} onChange={handleChange} />
          </label>
          <label>
            Date to Complete Payment:
            <input type="date" name="dateToCompletePayment" value={editedProject.dateToCompletePayment} onChange={handleChange} />
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

export default Projects;