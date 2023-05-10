import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { GlobalError, RegionList, RegionMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';

export const fetchRegions = createAsyncThunk<RegionList[], string | undefined>('location/fetch_regions', async (id) => {
  const response = await axiosApi.get<RegionList[]>(id ? '/regions?cityId=' + id : '/regions');
  return response.data;
});

export const createRegion = createAsyncThunk<void, RegionMutation, { rejectValue: ValidationError }>(
  'location/create_region',
  async (regionMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/regions', regionMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeRegion = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'location/remove_region',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/regions/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
