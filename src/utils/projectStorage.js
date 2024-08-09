import { openDB } from 'idb';

const DB_NAME = 'HagsOfflineDB';
const PROJECTS_STORE = 'projects';

async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(PROJECTS_STORE, { keyPath: 'id', autoIncrement: true });
    },
  });
}

export const saveProject = async (projectInfo) => {
  try {
    const db = await getOfflineDb();
    await db.add(PROJECTS_STORE, projectInfo);
    
    // Also update localStorage for immediate access
    const existingProjects = await getProjects();
    localStorage.setItem(PROJECTS_STORE, JSON.stringify([...existingProjects, projectInfo]));
  } catch (error) {
    console.error('Error saving project:', error);
  }
};

export const getProjects = async () => {
  try {
    const db = await getOfflineDb();
    return await db.getAll(PROJECTS_STORE);
  } catch (error) {
    console.error('Error getting projects:', error);
    const projects = localStorage.getItem(PROJECTS_STORE);
    return projects ? JSON.parse(projects) : [];
  }
};

export const clearAllProjects = async () => {
  try {
    const db = await getOfflineDb();
    await db.clear(PROJECTS_STORE);
    localStorage.removeItem(PROJECTS_STORE);
  } catch (error) {
    console.error('Error clearing projects:', error);
  }
};

