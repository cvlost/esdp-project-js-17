import { ClientsList, GlobalError, ValidationError } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createClient, fetchClients, fetchOneClient, removeClient } from './clientThunk';
import { RootState } from '../../../app/store';

interface clientState {
  listClients: ClientsList[];
  getAllClientsLoading: boolean;
  getOneClientLoading: boolean;
  oneClient: ClientsList | null;
  createClientLoading: boolean;
  removeClientLoading: boolean;
  clientError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: clientState = {
  listClients: [],
  getAllClientsLoading: false,
  getOneClientLoading: false,
  oneClient: null,
  createClientLoading: false,
  removeClientLoading: false,
  clientError: null,
  errorRemove: null,
  modal: false,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClients.pending, (state) => {
      state.getAllClientsLoading = true;
    });
    builder.addCase(fetchClients.fulfilled, (state, { payload: clients }) => {
      state.getAllClientsLoading = false;
      state.listClients = clients;
    });
    builder.addCase(fetchClients.rejected, (state) => {
      state.getAllClientsLoading = false;
    });

    builder.addCase(fetchOneClient.pending, (state) => {
      state.getOneClientLoading = true;
    });
    builder.addCase(fetchOneClient.fulfilled, (state, { payload: clients }) => {
      state.getOneClientLoading = false;
      state.oneClient = clients;
    });
    builder.addCase(fetchOneClient.rejected, (state) => {
      state.getOneClientLoading = false;
    });

    builder.addCase(createClient.pending, (state) => {
      state.createClientLoading = true;
    });
    builder.addCase(createClient.fulfilled, (state) => {
      state.createClientLoading = false;
    });
    builder.addCase(createClient.rejected, (state, { payload: error }) => {
      state.createClientLoading = false;
      state.clientError = error || null;
    });

    builder.addCase(removeClient.pending, (state) => {
      state.removeClientLoading = true;
    });
    builder.addCase(removeClient.fulfilled, (state) => {
      state.removeClientLoading = false;
    });
    builder.addCase(removeClient.rejected, (state, { payload: error }) => {
      state.removeClientLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const clientReducer = clientsSlice.reducer;
export const { controlModal } = clientsSlice.actions;
export const selectClientsList = (state: RootState) => state.clients.listClients;
export const selectGetAllClientsLoading = (state: RootState) => state.clients.getAllClientsLoading;
export const selectCreateClientLoading = (state: RootState) => state.clients.createClientLoading;
export const selectRemoveClientLoading = (state: RootState) => state.clients.removeClientLoading;
export const selectClientError = (state: RootState) => state.clients.clientError;
export const selectErrorRemove = (state: RootState) => state.clients.errorRemove;
export const selectModal = (state: RootState) => state.clients.modal;
