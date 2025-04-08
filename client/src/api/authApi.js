import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const register = async (credentials) => {
  const response = await axiosInstance.post('/auth/register', credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post(
    '/auth/logout',
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const emailSend = async () => {
  const response = await axiosInstance.post(
    '/auth/emailSend',
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const emailVerify = async ({ code }) => {
  try {
    const response = await axiosInstance.post(
      '/auth/emailVerify',
      { code },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Email verify error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const resendVerificationCode = async () => {
  try {
    const response = await axiosInstance.post(
      '/auth/emailSend',
      {},
      {
        withCredentials: true,
      }
    ); 
    return response.data;
  } catch (error) {
    console.error('Resend error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const passwordSend = async (credentials) => {
  const response = await axiosInstance.post('/auth/sendPass', credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const passwordChange = async (credentials) => {
  const response = await axiosInstance.post('/auth/changePass', credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me', {
    withCredentials: true,
  });
  return response.data;
};

export const logs = async (category,adId) => {
  const response = await axiosInstance.post('/auth/logs', { category, adId
  });
  return response.data;
};