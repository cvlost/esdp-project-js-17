import { createAsyncThunk } from '@reduxjs/toolkit';
import { FormatList, FormatMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

export const fetchFormat = createAsyncThunk<FormatList[]>('format/fetch_formats', async () => {
  const response = await axiosApi.get<FormatList[]>('/formats');
  return response.data;
});

export const createFormat = createAsyncThunk<void, FormatMutation, { rejectValue: ValidationError }>(
  'format/create_format',
  async (formatMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/formats', formatMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);
