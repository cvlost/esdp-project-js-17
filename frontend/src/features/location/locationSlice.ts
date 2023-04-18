import { createSlice } from '@reduxjs/toolkit';
import { RegionList, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { createRegion, fetchRegions, removeRegion } from './locationThunk';

interface locationState {
  listRegion: RegionList[];
  getAllRegionLoading: boolean;
  createRegionLoading: boolean;
  removeRegionLoading: boolean;
  regionError: ValidationError | null;
}

const initialState: locationState = {
  listRegion: [],
  getAllRegionLoading: false,
  createRegionLoading: false,
  removeRegionLoading: false,
  regionError: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRegions.pending, (state) => {
      state.getAllRegionLoading = true;
    });
    builder.addCase(fetchRegions.fulfilled, (state, { payload: regionList }) => {
      state.getAllRegionLoading = false;
      state.listRegion = regionList;
    });
    builder.addCase(fetchRegions.rejected, (state) => {
      state.getAllRegionLoading = false;
    });

    builder.addCase(createRegion.pending, (state) => {
      state.createRegionLoading = true;
    });
    builder.addCase(createRegion.fulfilled, (state) => {
      state.createRegionLoading = false;
    });
    builder.addCase(createRegion.rejected, (state, { payload: error }) => {
      state.createRegionLoading = false;
      state.regionError = error || null;
    });

    builder.addCase(removeRegion.pending, (state) => {
      state.removeRegionLoading = true;
    });
    builder.addCase(removeRegion.fulfilled, (state) => {
      state.removeRegionLoading = false;
    });
    builder.addCase(removeRegion.rejected, (state) => {
      state.removeRegionLoading = false;
    });
  },
});

export const locationReducer = locationSlice.reducer;
export const selectRegionList = (state: RootState) => state.location.listRegion;
export const selectGetAllRegionLoading = (state: RootState) => state.location.getAllRegionLoading;
export const selectCreateRegionLoading = (state: RootState) => state.location.createRegionLoading;
export const selectRemoveRegionLoading = (state: RootState) => state.location.removeRegionLoading;
export const selectRegionError = (state: RootState) => state.location.regionError;
