// src/utils/authStorage.js

const TOKEN_KEY = 'authToken';
const NAME_KEY = 'userName';

export const saveAuthData = (token, name) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (name) {
    localStorage.setItem(NAME_KEY, name);
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || null;
};

export const getUserName = () => {
  return localStorage.getItem(NAME_KEY) || null;
};
