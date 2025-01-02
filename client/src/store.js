import { configureStore } from '@reduxjs/toolkit';
import formReducer from './features/form/formSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  form: formReducer,
  auth: authReducer,
});
