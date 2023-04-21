import { createSlice } from '@reduxjs/toolkit';
import { createDirection, getDirectionsList } from './directionsThunks';
import { DirectionType } from '../../../types';
import { RootState } from '../../../app/store';

interface DirectionState {
  listDirection: DirectionType[];
  getAllDirectionsLoading: boolean;
  createDirectionLoading: boolean;
}

const initialState: DirectionState = {
  listDirection: [],
  getAllDirectionsLoading: false,
  createDirectionLoading: false,
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
    builder.addCase(createDirection.rejected, (state) => {
      state.createDirectionLoading = false;
    });
  },
});

export const directionsReducer = directionsSlice.reducer;

export const selectDirections = (state: RootState) => state.directions.listDirection;
export const selectDirectionsLoading = (state: RootState) => state.directions.getAllDirectionsLoading;
export const selectDirectionCreateLoading = (state: RootState) => state.directions.createDirectionLoading;
