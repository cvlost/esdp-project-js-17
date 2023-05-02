import { createAsyncThunk } from '@reduxjs/toolkit';
import { FormatList, FormatMutation, GlobalError, ValidationError } from '../../../types';
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

export const removeFormat = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'format/remove_format',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/formats/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
