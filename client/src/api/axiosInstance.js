import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Bir hata oluştu:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
