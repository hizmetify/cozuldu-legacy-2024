import axiosInstance from './axiosInstance';

export const getAdsByCategoryRequest = async (categoryId, filters = {}) => {
  try {
    if (!categoryId) {
      throw new Error('Kategori ID geçersiz!');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('status','active')
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
    if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit); 
    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : '';
    
    const response = await axiosInstance.get(
      `/ads/category/${categoryId}${queryString}`
    );
     
    return response.data;
  } catch (error) {
    console.error('Kategori ilanlarını alırken hata oluştu:', error);
    throw error;
  }
};

export const getAllAdsRequest = async () => {
  const response = await axiosInstance.get('/ads');
  return response.data;
};

export const getUserAdsRequest = async () => {
  const response = await axiosInstance.get('/ads/my-ads');
  return response.data;
};

export const getSingleAdRequest = async (adId) => {
  const response = await axiosInstance.get(`/ads/${adId}`);
  return response.data;
};

export const createAdRequest = async (adData) => {
  const response = await axiosInstance.post('/ads', adData);
  return response.data;
};

export const updateAdRequest = async ({ adId, adData }) => { 
  const response = await axiosInstance.put(`/ads/${adId}`, adData);
  return response.data;
};

export const makeAdStatusChange = async ({ adId, adData }) => {
  try {
    const response = await axiosInstance.post(`/ads/statusChange/${adId}`, {
      status: adData,
    });
    const updatedAd = await getSingleAdRequest(adId);
    return updatedAd;
  } catch (error) {
    console.error('İlan durumu değiştirilirken hata oluştu:', error);
    throw error;
  }
};

export const deleteAdRequest = async (adId) => {
  const response = await axiosInstance.delete(`/ads/${adId}`);
  return response.data;
};
