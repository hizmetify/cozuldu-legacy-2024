import axiosInstance from './axiosInstance';

export const fetchCities = async () => {
  const response = await axiosInstance.get('/cities');
  return response.data;
};
