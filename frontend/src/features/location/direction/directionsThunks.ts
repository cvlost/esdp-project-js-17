import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { DirectionList, DirectionMutation, GlobalError, ValidationError } from '../../../types';
import { isAxiosError } from 'axios';

export const getDirectionsList = createAsyncThunk<DirectionList[]>('direction/fetchAll', async () => {
  const response = await axiosApi.get('/direction');
  return response.data;
});

export const deleteDirection = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'direction/delete',
  async (directionID, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/direction/' + directionID);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const createDirection = createAsyncThunk<void, DirectionMutation, { rejectValue: ValidationError }>(
  'direction/create',
  async (directionData, { rejectWithValue }) => {
    try {
      const comment = await axiosApi.post('/direction', directionData);
      return comment.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);
