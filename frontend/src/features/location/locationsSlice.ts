import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LocationsListResponse } from '../../types';
import { getLocationsList } from './locationsThunks';

interface LocationsState {
  locationsListData: LocationsListResponse;
  locationsListLoading: boolean;
}

const initialState: LocationsState = {
  locationsListData: {
    locations: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  locationsListLoading: false,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.locationsListData.page = page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLocationsList.pending, (state) => {
      state.locationsListLoading = true;
    });
    builder.addCase(getLocationsList.fulfilled, (state, { payload }) => {
      state.locationsListData = payload;
      state.locationsListLoading = false;
    });
    builder.addCase(getLocationsList.rejected, (state) => {
      state.locationsListLoading = false;
    });
  },
});

export const locationsReducer = locationsSlice.reducer;
export const { setCurrentPage } = locationsSlice.actions;

export const selectLocationsListData = (state: RootState) => state.locations.locationsListData;
export const selectLocationsListLoading = (state: RootState) => state.locations.locationsListLoading;
