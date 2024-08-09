// src/utils/localStorage.js

import { openDB } from 'idb';

const DB_NAME = 'HagsOfflineDB';
const USER_STORE = 'users';
const MEMBERS_STORE = 'members';
const FINANCES_STORE = 'finances';
const METADATA_STORE = 'metadata';

const PROJECT_ID_KEY = 'lastProjectId';

async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(USER_STORE, { keyPath: 'email' });
      db.createObjectStore(MEMBERS_STORE, { keyPath: 'projectId' });
      db.createObjectStore(FINANCES_STORE, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
    },
  });
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const saveUserInfo = async (userInfo) => {
  try {
    const hashedPassword = await hashPassword(userInfo.password);
    const secureUserInfo = {
      ...userInfo,
      password: hashedPassword,
    };
    const db = await getOfflineDb();
    await db.put(USER_STORE, secureUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(secureUserInfo));
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

export const getUserInfo = async () => {
  try {
    const db = await getOfflineDb();
    const userInfo = await db.get(USER_STORE, 'userEmail'); // Assume email is used as the key
    if (!userInfo) {
      const localUserInfo = localStorage.getItem('userInfo');
      return localUserInfo ? JSON.parse(localUserInfo) : null;
    }
    return userInfo;
  } catch (error) {
    console.error('Error getting user info:', error);
    const localUserInfo = localStorage.getItem('userInfo');
    return localUserInfo ? JSON.parse(localUserInfo) : null;
  }
};

export const clearUserInfo = async () => {
  try {
    const db = await getOfflineDb();
    await db.delete(USER_STORE, 'userEmail');
    localStorage.removeItem('userInfo');
  } catch (error) {
    console.error('Error clearing user info:', error);
  }
};

export const saveNewMember = async (memberInfo) => {
  try {
    const db = await getOfflineDb();
    const lastProjectId = await db.get(METADATA_STORE, PROJECT_ID_KEY) || { value: '0' };
    const newProjectId = (parseInt(lastProjectId.value) + 1).toString().padStart(6, '0');
    
    const memberWithProjectId = {
      ...memberInfo,
      projectId: newProjectId
    };

    await db.add(MEMBERS_STORE, memberWithProjectId);
    await db.put(METADATA_STORE, { key: PROJECT_ID_KEY, value: newProjectId });

    // Update localStorage for immediate access
    const existingMembers = await getMembers();
    localStorage.setItem(MEMBERS_STORE, JSON.stringify([...existingMembers, memberWithProjectId]));
  } catch (error) {
    console.error('Error saving new member:', error);
  }
};

export const getMembers = async () => {
  try {
    const db = await getOfflineDb();
    return await db.getAll(MEMBERS_STORE);
  } catch (error) {
    console.error('Error getting members:', error);
    const members = localStorage.getItem(MEMBERS_STORE);
    return members ? JSON.parse(members) : [];
  }
};

export const clearAllMembers = async () => {
  try {
    const db = await getOfflineDb();
    await db.clear(MEMBERS_STORE);
    localStorage.removeItem(MEMBERS_STORE);
  } catch (error) {
    console.error('Error clearing members:', error);
  }
};

export const saveMembers = async (members) => {
  try {
    const db = await getOfflineDb();
    await db.clear(MEMBERS_STORE);
    await Promise.all(members.map(member => db.add(MEMBERS_STORE, member)));
    localStorage.setItem(MEMBERS_STORE, JSON.stringify(members));
  } catch (error) {
    console.error('Error saving members:', error);
  }
};

export const getNextProjectId = async () => {
  try {
    const db = await getOfflineDb();
    const lastProjectId = await db.get(METADATA_STORE, PROJECT_ID_KEY) || { value: '0' };
    return (parseInt(lastProjectId.value) + 1).toString().padStart(6, '0');
  } catch (error) {
    console.error('Error getting next project ID:', error);
    const lastProjectId = localStorage.getItem(PROJECT_ID_KEY) || '0';
    return (parseInt(lastProjectId) + 1).toString().padStart(6, '0');
  }
};

export const saveFinance = async (financeInfo) => {
  try {
    const db = await getOfflineDb();
    await db.add(FINANCES_STORE, financeInfo);
    
    // Update localStorage for immediate access
    const existingFinances = await getFinances();
    localStorage.setItem(FINANCES_STORE, JSON.stringify([...existingFinances, financeInfo]));
  } catch (error) {
    console.error('Error saving finance:', error);
  }
};

export const getFinances = async () => {
  try {
    const db = await getOfflineDb();
    return await db.getAll(FINANCES_STORE);
  } catch (error) {
    console.error('Error getting finances:', error);
    const finances = localStorage.getItem(FINANCES_STORE);
    return finances ? JSON.parse(finances) : [];
  }
};

export const clearAllFinances = async () => {
  try {
    const db = await getOfflineDb();
    await db.clear(FINANCES_STORE);
    localStorage.removeItem(FINANCES_STORE);
  } catch (error) {
    console.error('Error clearing finances:', error);
  }
};

export const getTotalFinance = async () => {
  try {
    const finances = await getFinances();
    return finances.reduce((total, finance) => total + finance.amount, 0);
  } catch (error) {
    console.error('Error calculating total finance:', error);
    return 0;
  }
};