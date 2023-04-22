import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { RegionList, ValidationError } from '../../../types';

interface areaState {
  listArea: RegionList[];
  getAllAreaLoading: boolean;
  createAreaLoading: boolean;
  removeAreaLoading: boolean;
  areaError: ValidationError | null;
}

const initialState: areaState = {
  listArea: [],
  getAllAreaLoading: false,
  createAreaLoading: false,
  removeAreaLoading: false,
  areaError: null,
};

const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const areaReducer = areaSlice.reducer;
export const selectAreaList = (state: RootState) => state.area.listArea;
export const selectGetAllAreaLoading = (state: RootState) => state.area.getAllAreaLoading;
export const selectCreateAreaLoading = (state: RootState) => state.area.createAreaLoading;
export const selectRemoveAreaLoading = (state: RootState) => state.area.removeAreaLoading;
export const selectAreaError = (state: RootState) => state.area.areaError;
