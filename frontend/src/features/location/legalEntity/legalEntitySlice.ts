import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { LegalEntityList, ValidationError } from '../../../types';
import { createLegalEntity, fetchLegalEntity, removeLegalEntity } from './legalEntityThunk';

interface legalEntitySlice {
  listLegalEntity: LegalEntityList[];
  getAllLegalEntityLoading: boolean;
  createLegalEntityLoading: boolean;
  removeLegalEntityLoading: boolean;
  legalEntityError: ValidationError | null;
}

const initialState: legalEntitySlice = {
  listLegalEntity: [],
  getAllLegalEntityLoading: false,
  createLegalEntityLoading: false,
  removeLegalEntityLoading: false,
  legalEntityError: null,
};

const legalEntitySlice = createSlice({
  name: 'legalEntity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLegalEntity.pending, (state) => {
      state.getAllLegalEntityLoading = true;
    });
    builder.addCase(fetchLegalEntity.fulfilled, (state, { payload: list }) => {
      state.listLegalEntity = list;
      state.getAllLegalEntityLoading = false;
    });
    builder.addCase(fetchLegalEntity.rejected, (state) => {
      state.getAllLegalEntityLoading = false;
    });

    builder.addCase(createLegalEntity.pending, (state) => {
      state.legalEntityError = null;
      state.createLegalEntityLoading = true;
    });
    builder.addCase(createLegalEntity.fulfilled, (state) => {
      state.createLegalEntityLoading = false;
    });
    builder.addCase(createLegalEntity.rejected, (state, { payload: error }) => {
      state.legalEntityError = error || null;
      state.createLegalEntityLoading = false;
    });

    builder.addCase(removeLegalEntity.pending, (state) => {
      state.removeLegalEntityLoading = true;
    });
    builder.addCase(removeLegalEntity.fulfilled, (state) => {
      state.removeLegalEntityLoading = false;
    });
    builder.addCase(removeLegalEntity.rejected, (state) => {
      state.removeLegalEntityLoading = false;
    });
  },
});

export const legalEntityReducer = legalEntitySlice.reducer;
export const selectLegalEntityList = (state: RootState) => state.legalEntity.listLegalEntity;
export const selectGetAllLegalEntityLoading = (state: RootState) => state.legalEntity.getAllLegalEntityLoading;
export const selectCreateLegalEntityLoading = (state: RootState) => state.legalEntity.createLegalEntityLoading;
export const selectRemoveLegalEntityLoading = (state: RootState) => state.legalEntity.removeLegalEntityLoading;
export const selectLegalEntityError = (state: RootState) => state.legalEntity.legalEntityError;
