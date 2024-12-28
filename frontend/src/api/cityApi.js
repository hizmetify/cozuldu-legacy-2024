import axios from 'axios';

export const fetchCities = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/cities', {
      withCredentials: true, 
    });
    return response.data;
  } catch (error) {
    console.error('Şehirler yüklenirken bir hata oluştu:', error);
  }
};
