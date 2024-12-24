import  { configureStore } from '@reduxjs/toolkit'; 
import toastReducer from './features/toastSlice';

export const store = configureStore({
    reducer: {
        toast: toastReducer,
    },
})