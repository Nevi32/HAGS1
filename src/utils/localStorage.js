// src/utils/localStorage.js

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