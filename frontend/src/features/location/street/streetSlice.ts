import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { GlobalError, StreetList, ValidationError } from '../../../types';
import { createStreet, fetchStreet, removeStreet } from './streetThunks';

interface streetSlice {
  listStreet: StreetList[];
  getAllStreetLoading: boolean;
  createStreetLoading: boolean;
  removeStreetLoading: boolean;
  streetError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: streetSlice = {
  listStreet: [],
  getAllStreetLoading: false,
  createStreetLoading: false,
  removeStreetLoading: false,
  streetError: null,
  errorRemove: null,
  modal: false,
};

const streetSlice = createSlice({
  name: 'street',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStreet.pending, (state) => {
      state.getAllStreetLoading = true;
    });
    builder.addCase(fetchStreet.fulfilled, (state, { payload: streetList }) => {
      state.getAllStreetLoading = false;
      state.listStreet = streetList;
    });
    builder.addCase(fetchStreet.rejected, (state) => {
      state.getAllStreetLoading = false;
    });

    builder.addCase(createStreet.pending, (state) => {
      state.createStreetLoading = true;
    });
    builder.addCase(createStreet.fulfilled, (state) => {
      state.createStreetLoading = false;
    });
    builder.addCase(createStreet.rejected, (state, { payload: error }) => {
      state.createStreetLoading = false;
      state.streetError = error || null;
    });

    builder.addCase(removeStreet.pending, (state) => {
      state.removeStreetLoading = true;
    });
    builder.addCase(removeStreet.fulfilled, (state) => {
      state.removeStreetLoading = false;
    });
    builder.addCase(removeStreet.rejected, (state, { payload: error }) => {
      state.removeStreetLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const streetReducer = streetSlice.reducer;
export const { controlModal } = streetSlice.actions;
export const selectStreetList = (state: RootState) => state.street.listStreet;
export const selectGetAllStreetsLoading = (state: RootState) => state.street.getAllStreetLoading;
export const selectCreateStreetLoading = (state: RootState) => state.street.createStreetLoading;
export const selectRemoveStreetLoading = (state: RootState) => state.street.removeStreetLoading;
export const selectStreetError = (state: RootState) => state.street.streetError;
export const selectErrorRemove = (state: RootState) => state.street.errorRemove;
export const selectModal = (state: RootState) => state.street.modal;
