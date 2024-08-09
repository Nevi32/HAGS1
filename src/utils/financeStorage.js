import { openDB } from 'idb';

const DB_NAME = 'HagsOfflineDB';
const FINANCES_STORE = 'finances';

async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(FINANCES_STORE, { keyPath: 'id', autoIncrement: true });
    },
  });
}

export const saveFinance = async (financeInfo) => {
  try {
    const db = await getOfflineDb();
    await db.add(FINANCES_STORE, financeInfo);
    
    // Also update localStorage for immediate access
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
  const finances = await getFinances();
  return finances.reduce((total, finance) => total + finance.amount, 0);
};
