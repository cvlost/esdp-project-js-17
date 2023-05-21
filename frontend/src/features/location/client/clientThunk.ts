import { createAsyncThunk } from '@reduxjs/toolkit';
import { AreaList, ClientMutation, ClientsList, GlobalError, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

export const fetchClients = createAsyncThunk<ClientsList[]>('clients/fetch_clients', async () => {
  const response = await axiosApi.get<ClientsList[]>('/clients');
  return response.data;
});

export const fetchOneClient = createAsyncThunk<ClientsList, string>('clients/fetch_clients_one', async (id) => {
  const response = await axiosApi.get('/client/' + id);
  return response.data;
});

export const createClient = createAsyncThunk<void, ClientMutation, { rejectValue: ValidationError }>(
  'clients/create_client',
  async (clientMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/clients', clientMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeClient = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'client/remove_client',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/client/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
