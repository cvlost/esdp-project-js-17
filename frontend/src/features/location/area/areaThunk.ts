import { createAsyncThunk } from '@reduxjs/toolkit';
import { AreaList, AreaMutation, GlobalError, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setArea } from './areaSlice';

export const fetchAreas = createAsyncThunk<AreaList[]>('area/fetch_areas', async () => {
  const response = await axiosApi.get<AreaList[]>('/areas');
  return response.data;
});

export const fetchOneArea = createAsyncThunk<AreaList, string>('area/fetch_one', async (id) => {
  const response = await axiosApi.get<AreaList | null>('/areas/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateAreaParams {
  id: string;
  area: AreaMutation;
}

export const updateArea = createAsyncThunk<
  void,
  UpdateAreaParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('area/updateArea', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentArea = getState().area.oneArea;
    const response = await axiosApi.put('/areas/' + params.id, params.area);
    if (currentArea && currentArea._id === params.id) {
      dispatch(setArea(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
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

export const removeArea = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'area/remove_area',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/areas/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
