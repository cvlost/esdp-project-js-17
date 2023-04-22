import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { FormatList, ValidationError } from '../../../types';
import { createFormat, fetchFormat, removeFormat } from './formatThunk';

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
  extraReducers: (builder) => {
    builder.addCase(fetchFormat.pending, (state) => {
      state.getAllFormatLoading = true;
    });
    builder.addCase(fetchFormat.fulfilled, (state, { payload: list }) => {
      state.listFormat = list;
      state.getAllFormatLoading = false;
    });
    builder.addCase(fetchFormat.rejected, (state) => {
      state.getAllFormatLoading = false;
    });

    builder.addCase(createFormat.pending, (state) => {
      state.formatError = null;
      state.createFormatLoading = true;
    });
    builder.addCase(createFormat.fulfilled, (state) => {
      state.createFormatLoading = false;
    });
    builder.addCase(createFormat.rejected, (state, { payload: error }) => {
      state.formatError = error || null;
      state.createFormatLoading = false;
    });

    builder.addCase(removeFormat.pending, (state) => {
      state.removeFormatLoading = true;
    });
    builder.addCase(removeFormat.fulfilled, (state) => {
      state.removeFormatLoading = false;
    });
    builder.addCase(removeFormat.rejected, (state) => {
      state.removeFormatLoading = false;
    });
  },
});

export const formatReducer = formatSlice.reducer;
export const selectFormatList = (state: RootState) => state.format.listFormat;
export const selectGetAllFormatLoading = (state: RootState) => state.format.getAllFormatLoading;
export const selectCreateFormatLoading = (state: RootState) => state.format.createFormatLoading;
export const selectRemoveFormatLoading = (state: RootState) => state.format.removeFormatLoading;
export const selectFormatError = (state: RootState) => state.format.formatError;
