import { RentHistoryList } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { deleteRentHistory, fetchRentHistories } from './rentHistoryThunk';
import { RootState } from '../../app/store';

interface RentHistoryState {
  items: RentHistoryList[];
  fetchAllLoading: boolean;
  deleteLoading: boolean;
}

const initialState: RentHistoryState = {
  items: [],
  fetchAllLoading: false,
  deleteLoading: false,
};

const rentHistorySlice = createSlice({
  name: 'rentHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRentHistories.pending, (state) => {
      state.fetchAllLoading = true;
    });
    builder.addCase(fetchRentHistories.fulfilled, (state, { payload: listItems }) => {
      state.items = listItems;
      state.fetchAllLoading = false;
    });
    builder.addCase(fetchRentHistories.rejected, (state) => {
      state.fetchAllLoading = false;
    });
    builder.addCase(deleteRentHistory.pending, (state) => {
      state.deleteLoading = true;
    });
    builder.addCase(deleteRentHistory.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(deleteRentHistory.rejected, (state) => {
      state.deleteLoading = false;
    });
  },
});

export const rentHistoryReducer = rentHistorySlice.reducer;

export const selectRentHistories = (state: RootState) => state.rentHistories.items;
export const selectFetchLoadingRentHistories = (state: RootState) => state.rentHistories.fetchAllLoading;
export const selectDeleteRentHistoryLoading = (state: RootState) => state.rentHistories.deleteLoading;
