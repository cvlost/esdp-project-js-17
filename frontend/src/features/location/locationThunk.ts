import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegionList, RegionMutation, ValidationError } from '../../types';
import axiosApi from '../../axios';
import { isAxiosError } from 'axios';

export const fetchRegions = createAsyncThunk<RegionList[]>('location/fetch_regions', async () => {
  const response = await axiosApi.get<RegionList[]>('/region');
  return response.data;
});

export const createRegion = createAsyncThunk<void, RegionMutation, { rejectValue: ValidationError }>(
  'location/create_region',
  async (regionMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/region', regionMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeRegion = createAsyncThunk<void, string>('location/remove_region', async (id) => {
  await axiosApi.delete('/region/' + id);
});
