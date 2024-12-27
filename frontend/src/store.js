import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './features/toastSlice';
import authReducer from './features/authSlice';
import sidebarReducer from './features/sidebarSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    auth: authReducer,
    sidebar: sidebarReducer,
  },
  devTools: true,
});
