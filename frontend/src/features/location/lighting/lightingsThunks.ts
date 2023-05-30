import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { LightingList, LightingMutation, GlobalError, ValidationError } from '../../../types';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setLight } from './lightingsSlice';

export const getLightingsList = createAsyncThunk<LightingList[]>('lighting/fetchAll', async () => {
  const response = await axiosApi.get('/lighting');
  return response.data;
});

export const fetchOneLight = createAsyncThunk<LightingList, string>('lighting/fetchOne', async (id) => {
  const response = await axiosApi.get<LightingList | null>('/lighting/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: LightingMutation;
}

export const updateLight = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('lighting/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentL = getState().lighting.oneLight;
    const response = await axiosApi.put('/lighting/' + params.id, params.name);
    if (currentL && currentL._id === params.id) {
      dispatch(setLight(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const deleteLighting = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'lighting/delete',
  async (lightingID, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/lighting/' + lightingID);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const createLighting = createAsyncThunk<void, LightingMutation, { rejectValue: ValidationError }>(
  'lighting/create',
  async (lightingData, { rejectWithValue }) => {
    try {
      const comment = await axiosApi.post('/lighting', lightingData);
      return comment.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);
