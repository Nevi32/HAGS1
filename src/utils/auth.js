// src/utils/auth.js
import { getUserInfo } from './localStorage';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const authenticateUser = async (email, password) => {
  const userInfo = getUserInfo();
  
  if (!userInfo || userInfo.email !== email) {
    return { success: false, message: 'Invalid email or password' };
  }

  const hashedPassword = await hashPassword(password);
  
  if (hashedPassword !== userInfo.password) {
    return { success: false, message: 'Invalid email or password' };
  }

  return { success: true, message: 'Login successful' };
};