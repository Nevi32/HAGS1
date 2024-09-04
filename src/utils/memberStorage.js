const MEMBERS_STORAGE_KEY = 'hagsMembers';
const PROJECT_ID_KEY = 'lastProjectId';

export const saveNewMember = (memberInfo) => {
  const existingMembers = getMembers();
  
  // Use the project ID provided by the user, or generate a new one if not provided
  const projectId = memberInfo.projectId || getNextProjectId();
  
  const memberWithProjectId = {
    ...memberInfo,
    projectId: projectId
  };

  const updatedMembers = [...existingMembers, memberWithProjectId];
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));
  
  // Update the last project ID only if a new one was generated
  if (!memberInfo.projectId) {
    localStorage.setItem(PROJECT_ID_KEY, projectId);
  }
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
  const lastProjectId = localStorage.getItem(PROJECT_ID_KEY) || '000000';
  return (parseInt(lastProjectId) + 1).toString().padStart(6, '0');
};