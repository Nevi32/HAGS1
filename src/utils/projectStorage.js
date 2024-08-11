const PROJECTS_STORAGE_KEY = 'hagsProjects';

export const saveProject = (projectInfo) => {
  const existingProjects = getProjects();
  const updatedProjects = [...existingProjects, projectInfo];
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
};

export const getProjects = () => {
  const projects = localStorage.getItem(PROJECTS_STORAGE_KEY);
  return projects ? JSON.parse(projects) : [];
};

export const clearAllProjects = () => {
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
};

