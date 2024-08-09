import { openDB } from 'idb';
import { getUserInfo } from './localStorage';

const DB_NAME = 'HagsOfflineDB';
const USER_STORE = 'users';

async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(USER_STORE, { keyPath: 'email' });
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

export const authenticateUser = async (email, password) => {
  try {
    const userInfo = getUserInfo();
    if (!userInfo) {
      const db = await getOfflineDb();
      const user = await db.get(USER_STORE, email);
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }
      const hashedPassword = await hashPassword(password);
      if (hashedPassword !== user.password) {
        return { success: false, message: 'Invalid email or password' };
      }
      return { success: true, message: 'Login successful' };
    }

    if (userInfo.email !== email) {
      return { success: false, message: 'Invalid email or password' };
    }

    const hashedPassword = await hashPassword(password);
    
    if (hashedPassword !== userInfo.password) {
      return { success: false, message: 'Invalid email or password' };
    }

    return { success: true, message: 'Login successful' };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'An error occurred during authentication' };
  }
};