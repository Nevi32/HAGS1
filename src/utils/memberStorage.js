const MEMBERS_STORAGE_KEY = 'hagsMembers';
const PROJECT_ID_KEY = 'lastProjectId';

export const saveNewMember = (memberInfo) => {
  const existingMembers = getMembers();
  const lastProjectId = localStorage.getItem(PROJECT_ID_KEY) || '0';
  const newProjectId = (parseInt(lastProjectId) + 1).toString().padStart(6, '0');
  
  const memberWithProjectId = {
    ...memberInfo,
    projectId: newProjectId
  };

  const updatedMembers = [...existingMembers, memberWithProjectId];
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));
  localStorage.setItem(PROJECT_ID_KEY, newProjectId);
};

export const getMembers = () => {
  const members = localStorage.getItem(MEMBERS_STORAGE_KEY);
  return members ? JSON.parse(members) : [];
};

export const clearAllMembers = () => {
  localStorage.removeItem(MEMBERS_STORAGE_KEY);
};

export const saveMembers = (members) => {
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
};

export const getNextProjectId = () => {
  const lastProjectId = localStorage.getItem(PROJECT_ID_KEY) || '0';
  return (parseInt(lastProjectId) + 1).toString().padStart(6, '0');
};