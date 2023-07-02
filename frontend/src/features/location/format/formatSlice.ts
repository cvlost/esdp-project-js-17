import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { FormatList, GlobalError, ValidationError } from '../../../types';
import { createFormat, fetchFormat, fetchOneFormat, removeFormat, updateFormat } from './formatThunk';

interface formatSlice {
  listFormat: FormatList[];
  getAllFormatLoading: boolean;
  createFormatLoading: boolean;
  removeFormatLoading: string | false;
  formatError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneFormat: null | FormatList;
  updateFormatLoading: boolean;
  oneFormatLoading: boolean;
}

const initialState: formatSlice = {
  listFormat: [],
  getAllFormatLoading: false,
  createFormatLoading: false,
  removeFormatLoading: false,
  formatError: null,
  errorRemove: null,
  modal: false,
  oneFormat: null,
  updateFormatLoading: false,
  oneFormatLoading: false,
};

const formatSlice = createSlice({
  name: 'format',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetFormat: (state) => {
      state.oneFormat = null;
    },
    setFormat: (state, action) => {
      state.oneFormat = action.payload;
    },
  },
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

    builder.addCase(fetchOneFormat.pending, (state) => {
      state.oneFormatLoading = true;
    });
    builder.addCase(fetchOneFormat.fulfilled, (state, { payload: format }) => {
      state.oneFormatLoading = false;
      state.oneFormat = format;
    });
    builder.addCase(fetchOneFormat.rejected, (state) => {
      state.oneFormatLoading = false;
    });

    builder.addCase(updateFormat.pending, (state) => {
      state.updateFormatLoading = true;
    });
    builder.addCase(updateFormat.fulfilled, (state) => {
      state.updateFormatLoading = false;
    });
    builder.addCase(updateFormat.rejected, (state, { payload: error }) => {
      state.updateFormatLoading = false;
      state.formatError = error || null;
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

    builder.addCase(removeFormat.pending, (state, { meta: { arg: id } }) => {
      state.removeFormatLoading = id;
    });
    builder.addCase(removeFormat.fulfilled, (state) => {
      state.removeFormatLoading = false;
    });
    builder.addCase(removeFormat.rejected, (state, { payload: error }) => {
      state.removeFormatLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});
export const { setFormat, unsetFormat } = formatSlice.actions;
export const formatReducer = formatSlice.reducer;
export const { controlModal } = formatSlice.actions;
export const selectFormatList = (state: RootState) => state.format.listFormat;
export const selectGetAllFormatLoading = (state: RootState) => state.format.getAllFormatLoading;
export const selectCreateFormatLoading = (state: RootState) => state.format.createFormatLoading;
export const selectRemoveFormatLoading = (state: RootState) => state.format.removeFormatLoading;
export const selectFormatError = (state: RootState) => state.format.formatError;
export const selectErrorRemove = (state: RootState) => state.format.errorRemove;
export const selectModal = (state: RootState) => state.format.modal;
export const selectOneFormat = (state: RootState) => state.format.oneFormat;
export const selectOneFormatLoading = (state: RootState) => state.format.oneFormatLoading;
export const selectUpdateFormatLoading = (state: RootState) => state.format.updateFormatLoading;
