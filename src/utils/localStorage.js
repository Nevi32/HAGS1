// src/utils/localStorage.js

export const saveUserInfo = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };
  
  export const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };
  
  export const clearUserInfo = () => {
    localStorage.removeItem('userInfo');
  };
  