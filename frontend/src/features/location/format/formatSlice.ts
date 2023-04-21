import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { FormatList, ValidationError } from '../../../types';

interface formatSlice {
  listFormat: FormatList[];
  getAllFormatLoading: boolean;
  createFormatLoading: boolean;
  removeFormatLoading: boolean;
  formatError: ValidationError | null;
}

const initialState: formatSlice = {
  listFormat: [],
  getAllFormatLoading: false,
  createFormatLoading: false,
  removeFormatLoading: false,
  formatError: null,
};

const formatSlice = createSlice({
  name: 'format',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const formatReducer = formatSlice.reducer;
export const selectFormatList = (state: RootState) => state.format.listFormat;
export const selectGetAllFormatLoading = (state: RootState) => state.format.getAllFormatLoading;
export const selectCreateFormatLoading = (state: RootState) => state.format.createFormatLoading;
export const selectRemoveFormatLoading = (state: RootState) => state.format.removeFormatLoading;
export const selectFormatError = (state: RootState) => state.format.formatError;
