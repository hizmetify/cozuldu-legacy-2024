import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateEmail, updateNameInfo, deleteAccount } from '../../api/userApi';

export const updateUserEmail = createAsyncThunk(
  'user/updateEmail',
  async (email, { rejectWithValue }) => {
    try {
      return await updateEmail(email);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserName = createAsyncThunk(
  'user/updateNameInfo',
  async ({ name, lastname }, { rejectWithValue }) => {
    try {
      return await updateNameInfo(name, lastname);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeUserAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      return await deleteAccount(password);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(updateUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, email: action.payload.email };
      })
      .addCase(updateUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          name: action.payload.name,
          lastname: action.payload.lastname,
        };
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(removeUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
