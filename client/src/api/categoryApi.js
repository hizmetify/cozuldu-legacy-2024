import axiosInstance from './axiosInstance';

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const fetchSubCategories = async (categoryId) => {
  if (!categoryId) {
    console.error('Hata: Kategori ID geçersiz!');
    return [];
  }
  const response = await axiosInstance.get(
    `/categories/${categoryId}/subcategories`
  );
  return response.data;
};

export const fetchAddSubcategoryByCategory = async (validate) => {
  const response = await axiosInstance.post(
    '/categories/addSubcategoryByCategory',
    validate
  );
  return response.data;
};

export const fetchAdsByCategory = async (categoryId, filters = {}) => {
  try {
    if (!categoryId) {
      console.error('Hata: Kategori ID geçersiz!');
      return { data: [], total: 0 };
    }

    const queryParams = new URLSearchParams();
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
