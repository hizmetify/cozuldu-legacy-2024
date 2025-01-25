import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    name: '',
    lastname: '',
    email: '',
    phone: '',
    city: '',
    profilePic: '',
    portfolioLink: '',
    password: '',
    confirmPassword: '',
  },
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    updateRegisterData: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    clearRegisterData: (state) => {
      state.data = initialState.data;
    },
  },
});

export const { updateRegisterData, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
