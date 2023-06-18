import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { DirectionList, DirectionMutation, GlobalError, ValidationError } from '../../../types';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setDirection } from './directionsSlice';
import { handleAxiosError } from '../../handleAxiosError';

export const getDirectionsList = createAsyncThunk<DirectionList[]>('direction/fetchAll', async () => {
  const response = await axiosApi.get('/direction');
  return response.data;
});

export const fetchOneDir = createAsyncThunk<DirectionList, string>('direction/fetchOne', async (id) => {
  const response = await axiosApi.get<DirectionList | null>('/direction/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateDirectionParams {
  id: string;
  area: DirectionMutation;
}

export const updateDir = createAsyncThunk<
  void,
  UpdateDirectionParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('direction/updateDir', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentDir = getState().directions.oneDir;
    const response = await axiosApi.put('/direction/' + params.id, params.area);
    if (currentDir && currentDir._id === params.id) {
      dispatch(setDirection(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
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
      handleAxiosError(e, rejectWithValue);
    }
  },
);
