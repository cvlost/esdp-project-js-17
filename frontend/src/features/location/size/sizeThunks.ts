import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { SizeMutation, GlobalError, SizeList, ValidationError } from '../../../types';
import { isAxiosError } from 'axios';

export const getSizesList = createAsyncThunk<SizeList[]>('sizes/fetchAll', async () => {
  const response = await axiosApi.get('/sizes');
  return response.data;
});

export const deleteSize = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'sizes/delete',
  async (sizeID, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/sizes/' + sizeID);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const createSize = createAsyncThunk<void, SizeMutation, { rejectValue: ValidationError }>(
  'sizes/create',
  async (sizeData, { rejectWithValue }) => {
    try {
      const comment = await axiosApi.post('/sizes', sizeData);
      return comment.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);
