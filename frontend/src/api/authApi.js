import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true,
});

export const login = async (credentials) => {
  const response = await instance.post('/login', credentials);
  return response.data;
};

export const register = async (credentials) => {
  const response = await instance.post('/register', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await instance.post('/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await instance.get('/me');
  return response.data;
};

export default instance;
