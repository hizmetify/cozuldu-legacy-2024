import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials, {
    withCredentials: true, // 🌟 Cookie'nin set edilmesi için GEREKLİ
  });
  return response.data;
};

export const register = async (credentials) => {
  const response = await axiosInstance.post('/auth/register', credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout', {}, {
    withCredentials: true,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me', {
    withCredentials: true,
  });
  return response.data;
};
