import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { StreetList, ValidationError } from '../../../types';

interface streetSlice {
  listStreet: StreetList[];
  getAllStreetLoading: boolean;
  createStreetLoading: boolean;
  removeStreetLoading: boolean;
  streetError: ValidationError | null;
}

const initialState: streetSlice = {
  listStreet: [],
  getAllStreetLoading: false,
  createStreetLoading: false,
  removeStreetLoading: false,
  streetError: null,
};

const streetSlice = createSlice({
  name: 'street',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const streetReducer = streetSlice.reducer;
export const selectStreetList = (state: RootState) => state.street.listStreet;
export const selectGetAllStreetsLoading = (state: RootState) => state.street.getAllStreetLoading;
export const selectCreateStreetLoading = (state: RootState) => state.street.createStreetLoading;
export const selectRemoveStreetLoading = (state: RootState) => state.street.removeStreetLoading;
export const selectStreetError = (state: RootState) => state.street.streetError;
