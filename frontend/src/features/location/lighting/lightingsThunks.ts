import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { LightingList, LightingMutation, GlobalError, ValidationError } from '../../../types';
import { isAxiosError } from 'axios';

export const getLightingsList = createAsyncThunk<LightingList[]>('lighting/fetchAll', async () => {
  const response = await axiosApi.get('/lighting');
  return response.data;
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
