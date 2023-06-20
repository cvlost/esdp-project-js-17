import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalClientList } from '../../types';
import { fetchAnalyticClientList } from './AnalyticsClientThunk';
import { RootState } from '../../app/store';
interface AnalyticsClientType {
  analyticsClientList: AnalClientList;
  analyticsClientFetch: boolean;
}

const initialState: AnalyticsClientType = {
  analyticsClientList: {
    clintAnalNew: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  analyticsClientFetch: false,
};

export const analyticsClientSlice = createSlice({
  name: 'analyticClient',
  initialState,
  reducers: {
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.analyticsClientList.page = page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAnalyticClientList.pending, (state) => {
      state.analyticsClientFetch = true;
    });
    builder.addCase(fetchAnalyticClientList.fulfilled, (state, { payload: list }) => {
      state.analyticsClientFetch = false;
      state.analyticsClientList = list;
    });
    builder.addCase(fetchAnalyticClientList.rejected, (state) => {
      state.analyticsClientFetch = false;
    });
  },
});

export const analyticsClientReducer = analyticsClientSlice.reducer;
export const { setCurrentPage } = analyticsClientSlice.actions;
export const selectAnalyticsClientList = (state: RootState) => state.analyticClient.analyticsClientList;
export const selectAnalyticsClientFetch = (state: RootState) => state.analyticClient.analyticsClientFetch;
