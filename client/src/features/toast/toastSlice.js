import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    queue: [], 
  },
  reducers: {
    showToast: (state, action) => {
      state.queue.push(action.payload);
    },
    clearToast: (state) => {
      state.queue = [];
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
