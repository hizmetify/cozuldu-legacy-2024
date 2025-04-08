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
    const response = await axiosInstance.delete(`/user/deleteAccount/${password}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};

export const favoriAction = async (adId) => {
  try {
    const response = await axiosInstance.post('/user/favoriAction', {
      adId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};
export const favoriGet = async () => {
  try {
    const response = await axiosInstance.get('/user/favori/get');
    return response;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};
export const favoriIs = async (adId) => {
  try {
    const response = await axiosInstance.post('/user/favori/is', { adId });
    return response;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};
export const viewingIs = async (adId) => {
  try {
    const response = await axiosInstance.post('/user/isViewing', { adId });
    return response;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};
export const contactTeacher = async (adId) => {
  try {
    const response = await axiosInstance.post('/user/teacherContact', { adId });

    return response;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};
export const countFav = async (adId) => {
  try {
    const response = await axiosInstance.post('/user/favori/count', { adId });

    return response;
  } catch (error) {
    throw error.response?.data || 'Bir hata oluştu';
  }
};

export const getUserDetails = async () => {
  const response = await axiosInstance.get('/user/getUserDetails');
  return response.data;
};
export const profilePicChange = async (adData ) => { 
  try { 
    
  const response = await axiosInstance.put(`/user/profilPicChange`, adData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true, // Cookie ile token gidiyorsa şart
  }); 
  
  return response;
} catch (error) {
  throw error.response?.message || 'Bir hata oluştu';
}
};