import { ClientsList, GlobalError, ValidationError } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createClient, fetchClients, fetchOneClient, removeClient, updateClient } from './clientThunk';
import { RootState } from '../../../app/store';

interface clientState {
  listClients: ClientsList[];
  getAllClientsLoading: boolean;
  getOneClientLoading: boolean;
  oneClient: ClientsList | null;
  createClientLoading: boolean;
  removeClientLoading: string | false;
  updateClientLoading: boolean;
  clientError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: clientState = {
  listClients: [],
  updateClientLoading: false,
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
    unsetClient: (state) => {
      state.oneClient = null;
    },
    setClient: (state, action) => {
      state.oneClient = action.payload;
    },
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

    builder.addCase(updateClient.pending, (state) => {
      state.updateClientLoading = true;
    });
    builder.addCase(updateClient.fulfilled, (state) => {
      state.updateClientLoading = false;
    });
    builder.addCase(updateClient.rejected, (state, { payload: error }) => {
      state.updateClientLoading = false;
      state.clientError = error || null;
    });

    builder.addCase(removeClient.pending, (state, { meta: { arg: id } }) => {
      state.removeClientLoading = id;
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
export const { setClient, unsetClient } = clientsSlice.actions;
export const clientReducer = clientsSlice.reducer;
export const { controlModal } = clientsSlice.actions;
export const selectClientsList = (state: RootState) => state.clients.listClients;
export const selectGetAllClientsLoading = (state: RootState) => state.clients.getAllClientsLoading;
export const selectCreateClientLoading = (state: RootState) => state.clients.createClientLoading;
export const selectRemoveClientLoading = (state: RootState) => state.clients.removeClientLoading;
export const selectClientUpdateLoading = (state: RootState) => state.clients.updateClientLoading;
export const selectOneClient = (state: RootState) => state.clients.oneClient;
export const selectOneClientLoading = (state: RootState) => state.clients.getOneClientLoading;
export const selectClientError = (state: RootState) => state.clients.clientError;
export const selectErrorRemove = (state: RootState) => state.clients.errorRemove;
export const selectModal = (state: RootState) => state.clients.modal;
