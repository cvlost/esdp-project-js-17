import { createAsyncThunk } from '@reduxjs/toolkit';
import { FormatList } from '../../../types';
import axiosApi from '../../../axios';

export const fetchFormat = createAsyncThunk<FormatList[]>('format/fetch_formats', async () => {
  const response = await axiosApi.get<FormatList[]>('/formats');
  return response.data;
});
