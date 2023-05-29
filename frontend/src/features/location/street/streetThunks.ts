import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalError, StreetList, StreetMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setStreet } from './streetSlice';

type StreetType =
  | {
      cityId?: string;
    }
  | undefined;

export const fetchStreet = createAsyncThunk<StreetList[], StreetType>('street/fetch_streets', async (arg) => {
  let url = '/streets';
  if (arg) {
    if (arg.cityId) {
      url = `/streets?citiId=${arg.cityId}`;
    }
  }

  const response = await axiosApi.get<StreetList[]>(url);
  return response.data;
});

export const fetchOneStreet = createAsyncThunk<StreetList, string>('location/fetchOneStreet', async (id) => {
  const response = await axiosApi.get<StreetList | null>('/streets/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: StreetMutation;
}
export const updateStreet = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('location/update_street', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const current = getState().street.oneStreet;
    const response = await axiosApi.put('/streets/' + params.id, params.name);
    if (current && current._id === params.id) {
      dispatch(setStreet(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createStreet = createAsyncThunk<void, StreetMutation, { rejectValue: ValidationError }>(
  'street/create_street',
  async (streetMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/streets', streetMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeStreet = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'street/remove_street',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/streets/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
