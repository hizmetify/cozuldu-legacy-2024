import axiosInstance from './axiosInstance';

export const fetchStats = async () => {
  const response = await axiosInstance.get('/stats/getStats');
  return response.data;
};
