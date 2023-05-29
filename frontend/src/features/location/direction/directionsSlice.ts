import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createDirection, deleteDirection, fetchOneDir, getDirectionsList, updateDir } from './directionsThunks';
import { DirectionList, GlobalError, ValidationError } from '../../../types';
import { RootState } from '../../../app/store';

interface DirectionState {
  listDirection: DirectionList[];
  getAllDirectionsLoading: boolean;
  oneDir: null | DirectionList;
  updateDirLoading: boolean;
  oneDirLoading: boolean;
  createDirectionLoading: boolean;
  directionError: null | ValidationError;
  deleteDirectionLoading: boolean;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: DirectionState = {
  listDirection: [],
  oneDir: null,
  updateDirLoading: false,
  oneDirLoading: false,
  getAllDirectionsLoading: false,
  createDirectionLoading: false,
  directionError: null,
  deleteDirectionLoading: false,
  errorRemove: null,
  modal: false,
};

const directionsSlice = createSlice({
  name: 'directions',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetDirection: (state) => {
      state.oneDir = null;
    },
    setDirection: (state, action) => {
      state.oneDir = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDirectionsList.pending, (state) => {
      state.getAllDirectionsLoading = true;
    });
    builder.addCase(getDirectionsList.fulfilled, (state, { payload: direction }) => {
      state.getAllDirectionsLoading = false;
      state.listDirection = direction;
    });
    builder.addCase(getDirectionsList.rejected, (state) => {
      state.getAllDirectionsLoading = false;
    });

    builder.addCase(fetchOneDir.pending, (state) => {
      state.oneDirLoading = true;
    });
    builder.addCase(fetchOneDir.fulfilled, (state, { payload: dir }) => {
      state.oneDirLoading = false;
      state.oneDir = dir;
    });
    builder.addCase(fetchOneDir.rejected, (state) => {
      state.oneDirLoading = false;
    });

    builder.addCase(updateDir.pending, (state) => {
      state.updateDirLoading = true;
    });
    builder.addCase(updateDir.fulfilled, (state) => {
      state.updateDirLoading = false;
    });
    builder.addCase(updateDir.rejected, (state, { payload: error }) => {
      state.updateDirLoading = false;
      state.directionError = error || null;
    });

    builder.addCase(createDirection.pending, (state) => {
      state.createDirectionLoading = true;
    });
    builder.addCase(createDirection.fulfilled, (state) => {
      state.createDirectionLoading = false;
    });
    builder.addCase(createDirection.rejected, (state, { payload: error }) => {
      state.createDirectionLoading = false;
      state.directionError = error || null;
    });

    builder.addCase(deleteDirection.pending, (state) => {
      state.deleteDirectionLoading = true;
    });
    builder.addCase(deleteDirection.fulfilled, (state) => {
      state.deleteDirectionLoading = false;
    });
    builder.addCase(deleteDirection.rejected, (state, { payload: error }) => {
      state.deleteDirectionLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});
export const { setDirection, unsetDirection } = directionsSlice.actions;
export const directionsReducer = directionsSlice.reducer;
export const { controlModal } = directionsSlice.actions;
export const selectDirections = (state: RootState) => state.directions.listDirection;
export const selectOneDirection = (state: RootState) => state.directions.oneDir;
export const selectOneDirLoading = (state: RootState) => state.directions.oneDirLoading;
export const selectUpdateDirLoading = (state: RootState) => state.directions.updateDirLoading;
export const selectDirectionsLoading = (state: RootState) => state.directions.getAllDirectionsLoading;
export const selectDirectionCreateLoading = (state: RootState) => state.directions.createDirectionLoading;
export const selectDirectionError = (state: RootState) => state.directions.directionError;
export const selectDirectionDeleteLoading = (state: RootState) => state.directions.deleteDirectionLoading;
export const selectErrorRemove = (state: RootState) => state.directions.errorRemove;
export const selectModal = (state: RootState) => state.directions.modal;
