import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import registerReducer from './features/register/registerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
  },
});
