import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './features/toastSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    auth: authReducer,
  },
});
