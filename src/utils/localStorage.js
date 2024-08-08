// src/utils/localStorage.js

const MEMBERS_STORAGE_KEY = 'hagsMembers';
const FINANCES_STORAGE_KEY = 'hagsFinances';
const PROJECT_ID_KEY = 'lastProjectId';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const saveUserInfo = async (userInfo) => {
  const hashedPassword = await hashPassword(userInfo.password);
  const secureUserInfo = {
    ...userInfo,
    password: hashedPassword,
  };
  localStorage.setItem('userInfo', JSON.stringify(secureUserInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
};

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