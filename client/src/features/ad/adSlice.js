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
  status: 'idle',
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllAds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allAds = action.payload;
      })
      .addCase(fetchAllAds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchUserAds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserAds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userAds = action.payload;
      })
      .addCase(fetchUserAds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchSingleAd.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSingleAd.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedAd = action.payload;
      })
      .addCase(fetchSingleAd.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createAd.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userAds.push(action.payload);
      })
      .addCase(createAd.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updateAd.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedAd = action.payload;
        const idx = state.userAds.findIndex((ad) => ad._id === updatedAd._id);
        if (idx !== -1) {
          state.userAds[idx] = updatedAd;
        }
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteAd.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { adId } = action.payload;
        state.userAds = state.userAds.filter((ad) => ad._id !== adId);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSelectedAd } = adsSlice.actions;
export default adsSlice.reducer;
