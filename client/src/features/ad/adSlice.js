import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllAdsRequest,
  getUserAdsRequest,
  getSingleAdRequest,
  createAdRequest,
  updateAdRequest,
  deleteAdRequest,
} from '../../api/adsApi';

const initialState = {
  allAds: [],
  userAds: [],
  selectedAd: null,
  allAdsStatus: 'idle',
  userAdsStatus: 'idle',
  singleAdStatus: 'idle',
  error: null,
};

export const fetchAllAds = createAsyncThunk(
  'ads/fetchAllAds',
  async (_, thunkAPI) => {
    try {
      const response = await getAllAdsRequest();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchUserAds = createAsyncThunk(
  'ads/fetchUserAds',
  async (_, thunkAPI) => {
    try {
      const response = await getUserAdsRequest();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchSingleAd = createAsyncThunk(
  'ads/fetchSingleAd',
  async (adId, thunkAPI) => {
    try {
      const response = await getSingleAdRequest(adId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createAd = createAsyncThunk(
  'ads/createAd',
  async (adData, thunkAPI) => {
    try {
      const response = await createAdRequest(adData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAd = createAsyncThunk(
  'ads/updateAd',
  async ({ adId, adData }, thunkAPI) => {
    try {
      const response = await updateAdRequest({ adId, adData });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAd = createAsyncThunk(
  'ads/deleteAd',
  async (adId, thunkAPI) => {
    try {
      const response = await deleteAdRequest(adId);
      return { adId, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    clearSelectedAd(state) {
      state.selectedAd = null;
      state.singleAdStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAds.pending, (state) => {
        state.allAdsStatus = 'loading';
      })
      .addCase(fetchAllAds.fulfilled, (state, action) => {
        state.allAdsStatus = 'succeeded';
        state.allAds = action.payload;
      })
      .addCase(fetchAllAds.rejected, (state, action) => {
        state.allAdsStatus = 'failed';
        state.error =
          action.payload?.message || 'İlanlar yüklenirken hata oluştu.';
      })
      .addCase(fetchUserAds.pending, (state) => {
        state.userAdsStatus = 'loading';
      })
      .addCase(fetchUserAds.fulfilled, (state, action) => {
        state.userAdsStatus = 'succeeded';
        state.userAds = action.payload;
      })
      .addCase(fetchUserAds.rejected, (state, action) => {
        state.userAdsStatus = 'failed';
        state.error =
          action.payload?.message ||
          'Kullanıcı ilanları yüklenirken hata oluştu.';
      })

      .addCase(fetchSingleAd.pending, (state) => {
        state.singleAdStatus = 'loading';
      })
      .addCase(fetchSingleAd.fulfilled, (state, action) => {
        state.singleAdStatus = 'succeeded';
        state.selectedAd = action.payload;
      })
      .addCase(fetchSingleAd.rejected, (state, action) => {
        state.singleAdStatus = 'failed';
        state.error =
          action.payload?.message || 'İlan detayları yüklenirken hata oluştu.';
      });
  },
});

export const { clearSelectedAd } = adsSlice.actions;
export default adsSlice.reducer;
