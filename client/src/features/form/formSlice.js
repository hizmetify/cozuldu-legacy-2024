import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  formData: {},
  status: null,
  error: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setStatus: (state, action) => {
      state.status = action.payload.status;
      state.error = action.payload.error || null;
    },
    resetForm: () => initialState,
  },
});

export const { setStep, updateFormData, setStatus, resetForm } = formSlice.actions;
export default formSlice.reducer;