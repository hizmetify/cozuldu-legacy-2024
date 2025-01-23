import axiosInstance from './axiosInstance';

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};
