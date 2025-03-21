import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import registerReducer from './features/register/registerSlice';
import sidebarReducer from './features/sidebar/sidebarSlice';
import adsReducer from './features/ad/adSlice';
import toastReducer from './features/toast/toastSlice';
import userReducer from './features/user/userSlice';
import loadingReducer from './features/loading/loadingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    sidebar: sidebarReducer,
    ads: adsReducer,
    toast: toastReducer,
    user: userReducer,
    loading: loadingReducer,
  },
});
