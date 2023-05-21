import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSize, deleteSize, getSizesList } from './sizeThunks';
import { GlobalError, SizeList, ValidationError } from '../../../types';
import { RootState } from '../../../app/store';

interface SizeState {
  listSize: SizeList[];
  getAllSizesLoading: boolean;
  createSizeLoading: boolean;
  sizeError: null | ValidationError;
  deleteSizeLoading: boolean;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: SizeState = {
  listSize: [],
  getAllSizesLoading: false,
  createSizeLoading: false,
  sizeError: null,
  deleteSizeLoading: false,
  errorRemove: null,
  modal: false,
};

const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSizesList.pending, (state) => {
      state.getAllSizesLoading = true;
    });
    builder.addCase(getSizesList.fulfilled, (state, { payload: size }) => {
      state.getAllSizesLoading = false;
      state.listSize = size;
    });
    builder.addCase(getSizesList.rejected, (state) => {
      state.getAllSizesLoading = false;
    });

    builder.addCase(createSize.pending, (state) => {
      state.createSizeLoading = true;
    });
    builder.addCase(createSize.fulfilled, (state) => {
      state.createSizeLoading = false;
    });
    builder.addCase(createSize.rejected, (state, { payload: error }) => {
      state.createSizeLoading = false;
      state.sizeError = error || null;
    });

    builder.addCase(deleteSize.pending, (state) => {
      state.deleteSizeLoading = true;
    });
    builder.addCase(deleteSize.fulfilled, (state) => {
      state.deleteSizeLoading = false;
    });
    builder.addCase(deleteSize.rejected, (state, { payload: error }) => {
      state.deleteSizeLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const sizesReducer = sizeSlice.reducer;
export const { controlModal } = sizeSlice.actions;
export const selectSizes = (state: RootState) => state.size.listSize;
export const selectSizesLoading = (state: RootState) => state.size.getAllSizesLoading;
export const selectSizeCreateLoading = (state: RootState) => state.size.createSizeLoading;
export const selectSizeError = (state: RootState) => state.size.sizeError;
export const selectSizeDeleteLoading = (state: RootState) => state.size.deleteSizeLoading;
export const selectErrorRemove = (state: RootState) => state.size.errorRemove;
export const selectModal = (state: RootState) => state.size.modal;
