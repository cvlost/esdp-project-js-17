import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { GlobalError, RegionList, ValidationError } from '../../../types';
import { createRegion, fetchOneRegion, fetchRegions, removeRegion, updateRegion } from './regionThunk';

interface regionState {
  listRegion: RegionList[];
  getAllRegionLoading: boolean;
  createRegionLoading: boolean;
  removeRegionLoading: boolean;
  regionError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneRegion: null | RegionList;
  updateRegionLoading: boolean;
  oneRegionLoading: boolean;
}

const initialState: regionState = {
  listRegion: [],
  getAllRegionLoading: false,
  createRegionLoading: false,
  removeRegionLoading: false,
  regionError: null,
  errorRemove: null,
  modal: false,
  oneRegion: null,
  updateRegionLoading: false,
  oneRegionLoading: false,
};

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetRegion: (state) => {
      state.oneRegion = null;
    },
    setRegion: (state, action) => {
      state.oneRegion = action.payload;
    },
  },
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

    builder.addCase(fetchOneRegion.pending, (state) => {
      state.oneRegionLoading = true;
    });
    builder.addCase(fetchOneRegion.fulfilled, (state, { payload: region }) => {
      state.oneRegionLoading = false;
      state.oneRegion = region;
    });
    builder.addCase(fetchOneRegion.rejected, (state) => {
      state.oneRegionLoading = false;
    });

    builder.addCase(updateRegion.pending, (state) => {
      state.updateRegionLoading = true;
    });
    builder.addCase(updateRegion.fulfilled, (state) => {
      state.updateRegionLoading = false;
    });
    builder.addCase(updateRegion.rejected, (state, { payload: error }) => {
      state.updateRegionLoading = false;
      state.regionError = error || null;
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
    builder.addCase(removeRegion.rejected, (state, { payload: error }) => {
      state.removeRegionLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});
export const { setRegion, unsetRegion } = regionSlice.actions;
export const regionReducer = regionSlice.reducer;
export const { controlModal } = regionSlice.actions;
export const selectRegionList = (state: RootState) => state.region.listRegion;
export const selectGetAllRegionLoading = (state: RootState) => state.region.getAllRegionLoading;
export const selectCreateRegionLoading = (state: RootState) => state.region.createRegionLoading;
export const selectRemoveRegionLoading = (state: RootState) => state.region.removeRegionLoading;
export const selectRegionError = (state: RootState) => state.region.regionError;
export const selectErrorRemove = (state: RootState) => state.region.errorRemove;
export const selectModal = (state: RootState) => state.region.modal;
export const selectOneRegion = (state: RootState) => state.region.oneRegion;
export const selectOneRegionLoading = (state: RootState) => state.region.oneRegionLoading;
export const selectUpdateRegionLoading = (state: RootState) => state.region.updateRegionLoading;
