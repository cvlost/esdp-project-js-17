import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { AreaList, GlobalError, ValidationError } from '../../../types';
import { createArea, fetchAreas, fetchOneArea, removeArea, updateArea } from './areaThunk';

interface areaState {
  listArea: AreaList[];
  getAllAreaLoading: boolean;
  oneArea: null | AreaList;
  oneAreaLoading: boolean;
  createAreaLoading: boolean;
  removeAreaLoading: string | false;
  updateAreaLoading: boolean;
  areaError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: areaState = {
  listArea: [],
  oneArea: null,
  oneAreaLoading: false,
  updateAreaLoading: false,
  getAllAreaLoading: false,
  createAreaLoading: false,
  removeAreaLoading: false,
  areaError: null,
  errorRemove: null,
  modal: false,
};

const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetArea: (state) => {
      state.oneArea = null;
    },
    setArea: (state, action) => {
      state.oneArea = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAreas.pending, (state) => {
      state.getAllAreaLoading = true;
    });
    builder.addCase(fetchAreas.fulfilled, (state, { payload: areas }) => {
      state.getAllAreaLoading = false;
      state.listArea = areas;
    });
    builder.addCase(fetchAreas.rejected, (state) => {
      state.getAllAreaLoading = false;
    });

    builder.addCase(fetchOneArea.pending, (state) => {
      state.oneAreaLoading = true;
    });
    builder.addCase(fetchOneArea.fulfilled, (state, { payload: area }) => {
      state.oneAreaLoading = false;
      state.oneArea = area;
    });
    builder.addCase(fetchOneArea.rejected, (state) => {
      state.oneAreaLoading = false;
    });

    builder.addCase(updateArea.pending, (state) => {
      state.updateAreaLoading = true;
    });
    builder.addCase(updateArea.fulfilled, (state) => {
      state.updateAreaLoading = false;
    });
    builder.addCase(updateArea.rejected, (state, { payload: error }) => {
      state.updateAreaLoading = false;
      state.areaError = error || null;
    });

    builder.addCase(createArea.pending, (state) => {
      state.createAreaLoading = true;
    });
    builder.addCase(createArea.fulfilled, (state) => {
      state.createAreaLoading = false;
    });
    builder.addCase(createArea.rejected, (state, { payload: error }) => {
      state.createAreaLoading = false;
      state.areaError = error || null;
    });

    builder.addCase(removeArea.pending, (state, { meta: { arg: id } }) => {
      state.removeAreaLoading = id;
    });
    builder.addCase(removeArea.fulfilled, (state) => {
      state.removeAreaLoading = false;
    });
    builder.addCase(removeArea.rejected, (state, { payload: error }) => {
      state.removeAreaLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const { setArea, unsetArea } = areaSlice.actions;
export const areaReducer = areaSlice.reducer;
export const { controlModal } = areaSlice.actions;
export const selectAreaList = (state: RootState) => state.area.listArea;
export const selectOneArea = (state: RootState) => state.area.oneArea;
export const selectOneAreaLoading = (state: RootState) => state.area.oneAreaLoading;
export const selectUpdateAreaLoading = (state: RootState) => state.area.updateAreaLoading;
export const selectGetAllAreaLoading = (state: RootState) => state.area.getAllAreaLoading;
export const selectCreateAreaLoading = (state: RootState) => state.area.createAreaLoading;
export const selectRemoveAreaLoading = (state: RootState) => state.area.removeAreaLoading;
export const selectAreaError = (state: RootState) => state.area.areaError;
export const selectErrorRemove = (state: RootState) => state.area.errorRemove;
export const selectModal = (state: RootState) => state.area.modal;
