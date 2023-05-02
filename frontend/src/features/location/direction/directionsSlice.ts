import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createDirection, deleteDirection, getDirectionsList } from './directionsThunks';
import { DirectionList, GlobalError, ValidationError } from '../../../types';
import { RootState } from '../../../app/store';

interface DirectionState {
  listDirection: DirectionList[];
  getAllDirectionsLoading: boolean;
  createDirectionLoading: boolean;
  directionError: null | ValidationError;
  deleteDirectionLoading: boolean;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: DirectionState = {
  listDirection: [],
  getAllDirectionsLoading: false,
  createDirectionLoading: false,
  directionError: null,
  deleteDirectionLoading: false,
  errorRemove: null,
  modal: false,
};

const directionsSlice = createSlice({
  name: 'directions',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDirectionsList.pending, (state) => {
      state.getAllDirectionsLoading = true;
    });
    builder.addCase(getDirectionsList.fulfilled, (state, { payload: direction }) => {
      state.getAllDirectionsLoading = false;
      state.listDirection = direction;
    });
    builder.addCase(getDirectionsList.rejected, (state) => {
      state.getAllDirectionsLoading = false;
    });

    builder.addCase(createDirection.pending, (state) => {
      state.createDirectionLoading = true;
    });
    builder.addCase(createDirection.fulfilled, (state) => {
      state.createDirectionLoading = false;
    });
    builder.addCase(createDirection.rejected, (state, { payload: error }) => {
      state.createDirectionLoading = false;
      state.directionError = error || null;
    });

    builder.addCase(deleteDirection.pending, (state) => {
      state.deleteDirectionLoading = true;
    });
    builder.addCase(deleteDirection.fulfilled, (state) => {
      state.deleteDirectionLoading = false;
    });
    builder.addCase(deleteDirection.rejected, (state, { payload: error }) => {
      state.deleteDirectionLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const directionsReducer = directionsSlice.reducer;
export const { controlModal } = directionsSlice.actions;
export const selectDirections = (state: RootState) => state.directions.listDirection;
export const selectDirectionsLoading = (state: RootState) => state.directions.getAllDirectionsLoading;
export const selectDirectionCreateLoading = (state: RootState) => state.directions.createDirectionLoading;
export const selectDirectionError = (state: RootState) => state.directions.directionError;
export const selectDirectionDeleteLoading = (state: RootState) => state.directions.deleteDirectionLoading;
export const selectErrorRemove = (state: RootState) => state.directions.errorRemove;
export const selectModal = (state: RootState) => state.directions.modal;
