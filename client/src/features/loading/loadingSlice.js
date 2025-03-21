import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  message: 'Yükleniyor...',
  fullScreen: true,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.isLoading = true;
      state.message = action.payload?.message || state.message;
      state.fullScreen = action.payload?.fullScreen !== false;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setLoadingMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { startLoading, stopLoading, setLoadingMessage } =
  loadingSlice.actions;

export const selectLoading = (state) => state.loading.isLoading;
export const selectLoadingMessage = (state) => state.loading.message;
export const selectLoadingFullScreen = (state) => state.loading.fullScreen;

export default loadingSlice.reducer;
