import axiosInstance from './axiosInstance';

export const getAllAdsRequest = async () => {
  try {
    const response = await axiosInstance.get('/ads');
    return response.data;
  } catch (error) {
    console.error('İlanlar yüklenirken bir hata oluştu', error);
    throw error.response?.data || error.message;
  }
};

export const getUserAdsRequest = async () => {
  try {
    const response = await axiosInstance.get('/ads/my-ads');
    return response.data;
  } catch (error) {
    console.error('İlanlar yüklenirken bir hata oluştu', error);
    throw error.response?.data || error.message;
  }
};

export const getSingleAdRequest = async (adId) => {
  try {
    const response = await axiosInstance.get(`/ads/${adId}`);
    return response.data;
  } catch (error) {
    console.error('İlan yüklenirken bir sorun oluştu', error);
    throw error.response?.data || error.message;
  }
};

export const createAdRequest = async (adData) => {
  try {
    const formData = FormData();
    for (const key in adData) {
      if (key === 'images' && Array.isArray(adData.images)) {
        adData.images.forEach((file) => {
          formData.append(file);
        });
      } else {
        formData.append(key, adData[key]);
      }
    }

    const response = await axiosInstance.post('/ads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error('İlan oluşturulurken bir hata oluştu', error);
    throw error.response?.data || error.message;
  }
};

export const updateAdRequest = async ({ adId, adData }) => {
  try {
    const formData = new FormData();

    for (const key in adData) {
      if (key === 'images' && Array.isArray(adData.images)) {
        adData.images.forEach((file) => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, adData[key]);
      }
    }

    const response = await axiosInstance.put(`/ads/${adId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error('İlan güncellenirken hata oluştu', error);
    throw error.response?.data || error.message;
  }
};

export const deleteAdRequest = async (adId) => {
  try {
    const response = await axiosInstance.delete(`/ads/${adId}`);
    return response.data;
  } catch (error) {
    console.error(`İlan silinirken hata oluştu:`, error);
    throw error.response?.data || error.message;
  }
};
