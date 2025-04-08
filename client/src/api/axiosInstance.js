import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network veya Sunucuya erişilemedi:', error.message);
      
    } else {
      const { status, data } = error.response;
      const errorMessage = data?.message || error.message;
      console.error('İstek hata aldı:');
      console.error('Status Kodu:', status);
      console.error('Hata Mesajı:', errorMessage);
      console.error('Hata Detayı (data):', data);
      return Promise.reject(data?.error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
