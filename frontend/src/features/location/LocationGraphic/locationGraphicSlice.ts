import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { LocationGraphicDateType } from '../../../types';
import { fetchLocationGraphic } from './locationGraphicThunk';

interface LocationGraphicState {
  locationGraphicList: LocationGraphicDateType;
  locationGraphicFetch: boolean;
}

const initialState: LocationGraphicState = {
  locationGraphicList: {
    locations: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  locationGraphicFetch: false,
};

export const locationGraphicSlice = createSlice({
  name: 'locationGraphic',
  initialState,
  reducers: {
    setPerPage: (state, { payload: perPage }: PayloadAction<number>) => {
      state.locationGraphicList.perPage = perPage;
    },
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.locationGraphicList.page = page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocationGraphic.pending, (state) => {
      state.locationGraphicFetch = true;
    });
    builder.addCase(fetchLocationGraphic.fulfilled, (state, { payload: list }) => {
      state.locationGraphicFetch = false;
      state.locationGraphicList = list;
    });
    builder.addCase(fetchLocationGraphic.rejected, (state) => {
      state.locationGraphicFetch = false;
    });
  },
});

export const locationGraphicReducer = locationGraphicSlice.reducer;
export const { setPerPage, setCurrentPage } = locationGraphicSlice.actions;
export const selectLocationGraphicList = (state: RootState) => state.locationGraphic.locationGraphicList;
export const selectLocationGraphicFetch = (state: RootState) => state.locationGraphic.locationGraphicFetch;
