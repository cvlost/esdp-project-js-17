import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { RegionList, ValidationError } from '../../../types';
import { createRegion, fetchRegions, removeRegion } from './regionThunk';

interface regionState {
  listRegion: RegionList[];
  getAllRegionLoading: boolean;
  createRegionLoading: boolean;
  removeRegionLoading: boolean;
  regionError: ValidationError | null;
}

const initialState: regionState = {
  listRegion: [],
  getAllRegionLoading: false,
  createRegionLoading: false,
  removeRegionLoading: false,
  regionError: null,
};

const regionSlice = createSlice({
  name: 'region',
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

export const regionReducer = regionSlice.reducer;
export const selectRegionList = (state: RootState) => state.region.listRegion;
export const selectGetAllRegionLoading = (state: RootState) => state.region.getAllRegionLoading;
export const selectCreateRegionLoading = (state: RootState) => state.region.createRegionLoading;
export const selectRemoveRegionLoading = (state: RootState) => state.region.removeRegionLoading;
export const selectRegionError = (state: RootState) => state.region.regionError;
