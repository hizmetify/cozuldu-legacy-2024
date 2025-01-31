import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import registerReducer from './features/register/registerSlice';
import sidebarReducer from './features/sidebar/sidebarSlice';
import adsReducer from './features/ad/adSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    sidebar: sidebarReducer,
    ads: adsReducer,
  },
});
