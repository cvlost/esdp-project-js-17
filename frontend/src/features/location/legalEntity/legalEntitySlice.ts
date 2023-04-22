import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { LegalEntityList, ValidationError } from '../../../types';

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
  extraReducers: {},
});

export const legalEntityReducer = legalEntitySlice.reducer;
export const selectLegalEntityList = (state: RootState) => state.legalEntity.listLegalEntity;
export const selectGetAllLegalEntityLoading = (state: RootState) => state.legalEntity.getAllLegalEntityLoading;
export const selectCreateLegalEntityLoading = (state: RootState) => state.legalEntity.createLegalEntityLoading;
export const selectRemoveLegalEntityLoading = (state: RootState) => state.legalEntity.removeLegalEntityLoading;
export const selectLegalEntityError = (state: RootState) => state.legalEntity.legalEntityError;
