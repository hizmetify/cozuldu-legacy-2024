import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/auth/authSlice';
import registerReducer from './features/register/registerSlice';
import sidebarReducer from './features/sidebar/sidebarSlice';
import adsReducer from './features/ad/adSlice';
import toastReducer from './features/toast/toastSlice';
import userReducer from './features/user/userSlice';
import loadingReducer from './features/loading/loadingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  sidebar: sidebarReducer,
  ads: adsReducer,
  toast: toastReducer,
  user: userReducer,
  loading: loadingReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
