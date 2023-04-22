import { createAsyncThunk } from '@reduxjs/toolkit';
import { AreaList, AreaMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

export const fetchAreas = createAsyncThunk<AreaList[]>('area/fetch_areas', async () => {
  const response = await axiosApi.get<AreaList[]>('/areas');
  return response.data;
});

export const createArea = createAsyncThunk<void, AreaMutation, { rejectValue: ValidationError }>(
  'area/create_area',
  async (areaMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/areas', areaMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeArea = createAsyncThunk<void, string>('area/remove_area', async (id) => {
  await axiosApi.delete('/areas/' + id);
});
