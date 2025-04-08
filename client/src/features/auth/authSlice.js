import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getMe as getMeApi,
} from '../../api/authApi';
 
const getErrorMessage = (error) =>
  error || 
  error.response?.error ||
  error.response?.data?.message ||
  error.message ||
  'Bilinmeyen bir hata oluştu. Lütfen bir süre sonra tekrar deneyiniz.';

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMeApi();  
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials);
      
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userInfo, { rejectWithValue }) => {
    try {
      const user = await registerApi(userInfo);
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.isError = false;
          state.errorMessage = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.errorMessage = null;
          if (
            action.type === 'auth/login/fulfilled' ||
            action.type === 'auth/register/fulfilled' ||
            action.type === 'auth/fetchMe/fulfilled'
          ) {
            state.user = action.payload;
            state.isAuthenticated = true;
          }
          if (action.type === 'auth/logout/fulfilled') {
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.errorMessage = action.payload;
        }
      );
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
