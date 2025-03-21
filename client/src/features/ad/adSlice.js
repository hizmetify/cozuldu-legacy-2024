import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllAdsRequest,
  getUserAdsRequest,
  getSingleAdRequest,
  createAdRequest,
  updateAdRequest,
  deleteAdRequest,
  getAdsByCategoryRequest,
  makeAdStatusChange,
} from '../../api/adsApi';

const initialState = {
  allAds: [],
  userAds: [],
  categoryAds: {
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
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

export const fetchAdsByCategory = createAsyncThunk(
  'ads/fetchAdsByCategory',
  async ({ categoryId, filters = {} }, thunkAPI) => {
    try {
      const response = await getAdsByCategoryRequest(categoryId, filters);
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

export const changeAdStatus = createAsyncThunk(
  'ads/makeAdStatusChange',
  async ({ adId, adData }, thunkAPI) => {
    try {
      const response = await makeAdStatusChange({ adId, adData });
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
    clearCategoryAds(state) {
      state.categoryAds = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        loading: false,
        error: null,
      };
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
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        if (Array.isArray(state.userAds?.data)) {
          state.userAds = {
            ...state.userAds,
            data: state.userAds.data.filter(
              (ad) => ad._id !== action.payload.adId
            ),
          };
        }
      })
      .addCase(changeAdStatus.fulfilled, (state, action) => {
        const updatedAd = action.payload.data;

        if (Array.isArray(state.userAds?.data)) {
          state.userAds = {
            ...state.userAds,
            data: state.userAds.data.map((ad) =>
              ad._id === updatedAd._id ? updatedAd : ad
            ),
          };
        }
      })

      .addCase(fetchAdsByCategory.pending, (state) => {
        state.categoryAds.loading = true;
        state.categoryAds.error = null;
      })
      .addCase(fetchAdsByCategory.fulfilled, (state, action) => {
        state.categoryAds.loading = false;
        state.categoryAds.data = action.payload.data;
        state.categoryAds.total = action.payload.total;
        state.categoryAds.page = action.payload.page;
        state.categoryAds.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdsByCategory.rejected, (state, action) => {
        state.categoryAds.loading = false;
        state.categoryAds.error =
          action.payload?.message ||
          'Kategori ilanları yüklenirken hata oluştu.';
      });
  },
});

export const { clearSelectedAd, clearCategoryAds } = adsSlice.actions;
export default adsSlice.reducer;
