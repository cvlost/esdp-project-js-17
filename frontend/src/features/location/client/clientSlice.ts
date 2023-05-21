import { ClientsList, GlobalError, ValidationError } from '../../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createArea, fetchAreas, removeArea } from '../area/areaThunk';

interface clientState {
  listClient: ClientsList[];
  getAllClientsLoading: boolean;
  createClientLoading: boolean;
  removeClientLoading: boolean;
  clientError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: clientState = {
  listClient: [],
  getAllClientsLoading: false,
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
    // builder.addCase(fetchAreas.pending, (state) => {
    //   state.getAllAreaLoading = true;
    // });
    // builder.addCase(fetchAreas.fulfilled, (state, { payload: areas }) => {
    //   state.getAllAreaLoading = false;
    //   state.listArea = areas;
    // });
    // builder.addCase(fetchAreas.rejected, (state) => {
    //   state.getAllAreaLoading = false;
    // });
    //
    // builder.addCase(createArea.pending, (state) => {
    //   state.createAreaLoading = true;
    // });
    // builder.addCase(createArea.fulfilled, (state) => {
    //   state.createAreaLoading = false;
    // });
    // builder.addCase(createArea.rejected, (state, { payload: error }) => {
    //   state.createAreaLoading = false;
    //   state.areaError = error || null;
    // });
    //
    // builder.addCase(removeArea.pending, (state) => {
    //   state.removeAreaLoading = true;
    // });
    // builder.addCase(removeArea.fulfilled, (state) => {
    //   state.removeAreaLoading = false;
    // });
    // builder.addCase(removeArea.rejected, (state, { payload: error }) => {
    //   state.removeAreaLoading = false;
    //   state.errorRemove = error || null;
    //   state.modal = true;
    // });
  },
});

export const clientReducer = clientsSlice.reducer;
