import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers } from '../utils/memberStorage';
import '../styles/projects.css';

function Projects() {
  const { theme } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = () => {
      const members = getMembers() || [];
      const projectMembers = members.reduce((acc, member) => {
        if (!acc[member.projectId]) {
          acc[member.projectId] = [];
        }
        acc[member.projectId].push(member);
        return acc;
      }, {});
      setProjects(Object.keys(projectMembers).map(projectId => ({
        projectId,
        memberCount: projectMembers[projectId].length,
      })));
    };

    loadProjects();
    window.addEventListener('storage', loadProjects);

    return () => {
      window.removeEventListener('storage', loadProjects);
    };
  }, []);

  return (
    <div className={`projects-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Projects</h1>
        <div className="projects-container">
          {projects.map((project, index) => (
            <div key={index} className="project">
              <div className="project-id">Project {project.projectId}</div>
              <div className="project-count">{project.memberCount} Members</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Projects;
