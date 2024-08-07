// src/utils/memberStorage.js

const MEMBERS_STORAGE_KEY = 'hagsMembers';

export const saveNewMember = (memberInfo) => {
  const existingMembers = getMembers();
  const updatedMembers = [...existingMembers, memberInfo];
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));
};

export const getMembers = () => {
  const members = localStorage.getItem(MEMBERS_STORAGE_KEY);
  return members ? JSON.parse(members) : [];
};

export const clearAllMembers = () => {
  localStorage.removeItem(MEMBERS_STORAGE_KEY);
};