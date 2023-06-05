import { createAsyncThunk } from '@reduxjs/toolkit';
import { RentHistoryList } from '../../types';
import axiosApi from '../../axios';

export const fetchRentHistories = createAsyncThunk<RentHistoryList[], string>(
  'rentHistory/fetchAll',
  async (id: string) => {
    const response = await axiosApi.get('/rentHistories/' + id);
    return response.data;
  },
);

export const deleteRentHistory = createAsyncThunk<void, string>('area/remove_area', async (id) => {
  await axiosApi.delete('/rentHistories/' + id);
});
