import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: '',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearToast: (state) => {
      (state.message = ''), (state.type = '');
    },
  },
});


export const { showToast, clearToast } = toastSlice.actions;  
export default toastSlice.reducer;