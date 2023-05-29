import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { GlobalError, RegionList, RegionMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setRegion } from './regionSlice';

export const fetchRegions = createAsyncThunk<RegionList[], string | undefined>('location/fetch_regions', async (id) => {
  const response = await axiosApi.get<RegionList[]>(id ? '/regions?cityId=' + id : '/regions');
  return response.data;
});

export const fetchOneRegion = createAsyncThunk<RegionList, string>('location/fetchOneRegion', async (id) => {
  const response = await axiosApi.get<RegionList | null>('/regions/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: RegionMutation;
}

export const updateRegion = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('location/update_region', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const current = getState().region.oneRegion;
    const response = await axiosApi.put('/regions/' + params.id, params.name);
    if (current && current._id === params.id) {
      dispatch(setRegion(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
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
