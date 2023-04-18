import { createSlice } from '@reduxjs/toolkit';
import { RegionList } from '../../types';
import { RootState } from '../../app/store';

interface locationState {
  listRegion: RegionList[];
  getAllRegionLoading: boolean;
  createRegionLoading: boolean;
  removeRegionLoading: boolean;
}

const initialState: locationState = {
  listRegion: [],
  getAllRegionLoading: false,
  createRegionLoading: false,
  removeRegionLoading: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const locationReducer = locationSlice.reducer;
export const selectRegionList = (state: RootState) => state.location.listRegion;
export const selectGetAllRegionLoading = (state: RootState) => state.location.getAllRegionLoading;
export const selectCreateRegionLoading = (state: RootState) => state.location.createRegionLoading;
export const selectRemoveRegionLoading = (state: RootState) => state.location.removeRegionLoading;
