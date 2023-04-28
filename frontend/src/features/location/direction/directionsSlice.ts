import { createSlice } from '@reduxjs/toolkit';
import { createDirection, deleteDirection, getDirectionsList } from './directionsThunks';
import { DirectionList, ValidationError } from '../../../types';
import { RootState } from '../../../app/store';

interface DirectionState {
  listDirection: DirectionList[];
  getAllDirectionsLoading: boolean;
  createDirectionLoading: boolean;
  directionError: null | ValidationError;
  deleteDirectionLoading: boolean;
}

const initialState: DirectionState = {
  listDirection: [],
  getAllDirectionsLoading: false,
  createDirectionLoading: false,
  directionError: null,
  deleteDirectionLoading: false,
};

const directionsSlice = createSlice({
  name: 'directions',
  initialState,
  reducers: {},
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
    builder.addCase(deleteDirection.rejected, (state) => {
      state.deleteDirectionLoading = false;
    });
  },
});

export const directionsReducer = directionsSlice.reducer;

export const selectDirections = (state: RootState) => state.directions.listDirection;
export const selectDirectionsLoading = (state: RootState) => state.directions.getAllDirectionsLoading;
export const selectDirectionCreateLoading = (state: RootState) => state.directions.createDirectionLoading;
export const selectDirectionError = (state: RootState) => state.directions.directionError;
export const selectDirectionDeleteLoading = (state: RootState) => state.directions.deleteDirectionLoading;
