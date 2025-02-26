import axiosInstance from './axiosInstance';

export const updateEmail = async (email) => {
  try {
    const response = await axiosInstance.put('/user/emailUpdate', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};

export const updateNameInfo = async (name, lastname) => {
  try {
    const response = await axiosInstance.put('/user/nameInfoUpdate', {
      name,
      lastname,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};

export const deleteAccount = async (password) => {
  try {
    const response = await axiosInstance.delete('/user/deleteAccount', {
      data: password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};
