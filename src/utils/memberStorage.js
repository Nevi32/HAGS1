const MEMBERS_STORE = 'members';
const PROJECT_ID_KEY = 'lastProjectId';

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get all members
export const getMembers = () => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return [];
  }
  try {
    const members = localStorage.getItem(MEMBERS_STORE);
    return members ? JSON.parse(members) : [];
  } catch (error) {
    console.error('Error getting members:', error);
    return [];
  }
};

// Save all members
const saveMembers = (members) => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }
  try {
    localStorage.setItem(MEMBERS_STORE, JSON.stringify(members));
  } catch (error) {
    console.error('Error saving members:', error);
  }
};

// Get the next project ID
export const getNextProjectId = () => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return '000001';
  }
  try {
    const lastProjectId = localStorage.getItem(PROJECT_ID_KEY) || '000000';
    const nextId = (parseInt(lastProjectId, 10) + 1).toString().padStart(6, '0');
    localStorage.setItem(PROJECT_ID_KEY, nextId);
    return nextId;
  } catch (error) {
    console.error('Error getting next project ID:', error);
    return '000001';
  }
};

// Add a new member
export const addMember = (memberInfo) => {
  const members = getMembers();
  const newMember = {
    ...memberInfo,
    projectId: getNextProjectId()
  };
  members.push(newMember);
  saveMembers(members);
  return newMember;
};

// Update an existing member
export const updateMember = (projectId, updatedInfo) => {
  const members = getMembers();
  const index = members.findIndex(member => member.projectId === projectId);
  if (index !== -1) {
    members[index] = { ...members[index], ...updatedInfo };
    saveMembers(members);
    return members[index];
  }
  return null;
};

// Remove a member
export const removeMember = (projectId) => {
  const members = getMembers();
  const updatedMembers = members.filter(member => member.projectId !== projectId);
  saveMembers(updatedMembers);
};

// Clear all members
export const clearAllMembers = () => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }
  try {
    localStorage.removeItem(MEMBERS_STORE);
    localStorage.removeItem(PROJECT_ID_KEY);
  } catch (error) {
    console.error('Error clearing members:', error);
  }
};

// Get total finance
export const getTotalFinance = () => {
  const members = getMembers();
  return members.reduce((total, member) => {
    const depositPaid = parseFloat(member.depositPaid) || 0;
    const formFee = parseFloat(member.formFee) || 0;
    return total + depositPaid + formFee;
  }, 0);
};

// Get unique group count
export const getUniqueGroupCount = () => {
  const members = getMembers();
  const uniqueGroups = new Set(members.map(member => member.groupName));
  return uniqueGroups.size;
};

// Get highest project ID
export const getHighestProjectId = () => {
  const members = getMembers();
  return members.reduce((max, member) => {
    const currentId = parseInt(member.projectId, 10);
    return currentId > max ? currentId : max;
  }, 0);
};