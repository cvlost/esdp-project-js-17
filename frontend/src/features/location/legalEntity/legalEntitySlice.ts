import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { LegalEntityList, ValidationError } from '../../../types';
import {
  createLegalEntity,
  fetchLegalEntity,
  fetchOneLegalEntity,
  removeLegalEntity,
  updateLegalEntity,
} from './legalEntityThunk';

interface legalEntitySlice {
  listLegalEntity: LegalEntityList[];
  oneLegalEntity: LegalEntityList | null;
  getAllLegalEntityLoading: boolean;
  createLegalEntityLoading: boolean;
  removeLegalEntityLoading: boolean;
  updateLegalEntityLoading: boolean;
  oneLegalEntityLoading: boolean;
  legalEntityError: ValidationError | null;
  legalEntityUpdateError: ValidationError | null;
}

const initialState: legalEntitySlice = {
  listLegalEntity: [],
  oneLegalEntity: null,
  getAllLegalEntityLoading: false,
  createLegalEntityLoading: false,
  removeLegalEntityLoading: false,
  updateLegalEntityLoading: false,
  oneLegalEntityLoading: false,
  legalEntityError: null,
  legalEntityUpdateError: null,
};

const legalEntitySlice = createSlice({
  name: 'legalEntity',
  initialState,
  reducers: {
    unsetOneLegalEntity: (state) => {
      state.oneLegalEntity = null;
    },
  },
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

    builder.addCase(fetchOneLegalEntity.pending, (state) => {
      state.oneLegalEntityLoading = true;
    });
    builder.addCase(fetchOneLegalEntity.fulfilled, (state, { payload: entity }) => {
      state.oneLegalEntity = entity;
      state.oneLegalEntityLoading = false;
    });
    builder.addCase(fetchOneLegalEntity.rejected, (state) => {
      state.oneLegalEntityLoading = false;
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

    builder.addCase(updateLegalEntity.pending, (state) => {
      state.legalEntityUpdateError = null;
      state.updateLegalEntityLoading = true;
    });
    builder.addCase(updateLegalEntity.fulfilled, (state) => {
      state.updateLegalEntityLoading = false;
    });
    builder.addCase(updateLegalEntity.rejected, (state, { payload: error }) => {
      state.legalEntityUpdateError = error || null;
      state.updateLegalEntityLoading = false;
    });
  },
});

export const legalEntityReducer = legalEntitySlice.reducer;
export const { unsetOneLegalEntity } = legalEntitySlice.actions;

export const selectLegalEntityList = (state: RootState) => state.legalEntity.listLegalEntity;
export const selectGetAllLegalEntityLoading = (state: RootState) => state.legalEntity.getAllLegalEntityLoading;
export const selectCreateLegalEntityLoading = (state: RootState) => state.legalEntity.createLegalEntityLoading;
export const selectRemoveLegalEntityLoading = (state: RootState) => state.legalEntity.removeLegalEntityLoading;
export const selectLegalEntityError = (state: RootState) => state.legalEntity.legalEntityError;
export const selectOneLegalEntity = (state: RootState) => state.legalEntity.oneLegalEntity;
export const selectOneLegalEntityLoading = (state: RootState) => state.legalEntity.oneLegalEntityLoading;
export const selectUpdateLegalEntityLoading = (state: RootState) => state.legalEntity.updateLegalEntityLoading;
export const selectLegalEntityUpdateError = (state: RootState) => state.legalEntity.legalEntityUpdateError;
