const MEMBERS_STORAGE_KEY = 'hagsMembers';
const FINANCES_STORAGE_KEY = 'hagsFinances';
const PROJECT_ID_KEY = 'lastProjectId';
const USER_INFO_KEY = 'userInfo';

export const saveUserInfo = async (userInfo) => {
  const hashedPassword = await hashPassword(userInfo.password);
  const secureUserInfo = {
    ...userInfo,
    password: hashedPassword,
  };
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(secureUserInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

export const clearUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY);
};

export const saveNewMember = (memberInfo) => {
  const existingMembers = getMembers();

  // Get the current last project ID from localStorage
  let lastProjectId = localStorage.getItem(PROJECT_ID_KEY) || '0';

  // Check if there are existing members and adjust lastProjectId if needed
  if (existingMembers.length > 0) {
    const lastMember = existingMembers[existingMembers.length - 1];
    const lastMemberProjectId = lastMember.projectId;

    if (parseInt(lastMemberProjectId) > parseInt(lastProjectId)) {
      lastProjectId = lastMemberProjectId;
      localStorage.setItem(PROJECT_ID_KEY, lastProjectId);
    }
  }

  // Generate the new project ID
  const newProjectId = (parseInt(lastProjectId) + 1).toString().padStart(6, '0');

  // Prepare the new member data with the correct project ID
  const memberWithProjectId = {
    ...memberInfo,
    projectId: newProjectId
  };

  // Update the list of members and save it to localStorage
  const updatedMembers = [...existingMembers, memberWithProjectId];
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));

  // Update the project ID in localStorage
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

export const saveFinance = (financeInfo) => {
  const existingFinances = getFinances();
  const updatedFinances = [...existingFinances, financeInfo];
  localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(updatedFinances));
};

export const getFinances = () => {
  const finances = localStorage.getItem(FINANCES_STORAGE_KEY);
  return finances ? JSON.parse(finances) : [];
};

export const clearAllFinances = () => {
  localStorage.removeItem(FINANCES_STORAGE_KEY);
};

export const getTotalFinance = () => {
  const finances = getFinances();
  return finances.reduce((total, finance) => total + finance.amount, 0);
};

// Function to hash passwords (if needed)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
