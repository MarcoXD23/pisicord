import api from '../api/axios';

export const loginService = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const registerService = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const logoutService = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const getProfileService = async () => {
  const response = await api.get('/me');
  return response.data;
};

