import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalClientList } from '../../types';
import { fetchAnalyticClientList } from './AnalyticsClientThunk';
import { RootState } from '../../app/store';
interface AnalyticsClientType {
  AnalyticsClientList: AnalClientList;
  AnalyticsClientFetch: boolean;
}

const initialState: AnalyticsClientType = {
  AnalyticsClientList: {
    clintAnalNew: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  AnalyticsClientFetch: false,
};

export const analyticsClientSlice = createSlice({
  name: 'analyticClient',
  initialState,
  reducers: {
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.AnalyticsClientList.page = page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAnalyticClientList.fulfilled, (state, { payload: list }) => {
      state.AnalyticsClientList = list;
    });
  },
});

export const analyticsClientReducer = analyticsClientSlice.reducer;
export const { setCurrentPage } = analyticsClientSlice.actions;
export const selectAnalyticsClientList = (state: RootState) => state.analyticClient.AnalyticsClientList;
