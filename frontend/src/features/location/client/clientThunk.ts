import { createAsyncThunk } from '@reduxjs/toolkit';
import { ClientMutation, ClientsList, GlobalError, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setClient } from './clientSlice';
import { handleAxiosError } from '../../handleAxiosError';

export const fetchClients = createAsyncThunk<ClientsList[]>('clients/fetch_clients', async () => {
  const response = await axiosApi.get<ClientsList[]>('/clients');
  return response.data;
});

export const fetchOneClient = createAsyncThunk<ClientsList, string>('clients/fetch_clients_one', async (id) => {
  const response = await axiosApi.get('/clients/' + id);
  return response.data;
});

export const createClient = createAsyncThunk<void, ClientMutation, { rejectValue: ValidationError }>(
  'clients/create_client',
  async (clientMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/clients', clientMutation);
    } catch (e) {
      handleAxiosError(e, rejectWithValue);
    }
  },
);

interface UpdateClientParams {
  id: string;
  client: ClientMutation;
}

export const updateClient = createAsyncThunk<
  void,
  UpdateClientParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('clients/editOne', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentClient = getState().clients.oneClient;
    const response = await axiosApi.put('clients/' + params.id, params.client);
    if (currentClient && currentClient._id === params.id) {
      dispatch(setClient(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const removeClient = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'client/remove_client',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/clients/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
