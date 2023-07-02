import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchAnalyticLocList } from './LocationAnalyticsThunk';
import { AnalyticsLocationList } from '../../types';

interface AnalyticsLocationType {
  analyticsLocationList: AnalyticsLocationList;
  analyticsLocationFetch: boolean;
}

const initialState: AnalyticsLocationType = {
  analyticsLocationList: {
    locationsAnalytics: [],
  },
  analyticsLocationFetch: false,
};

export const analyticsLocationsSlice = createSlice({
  name: 'analyticLocation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnalyticLocList.pending, (state) => {
      state.analyticsLocationFetch = true;
    });
    builder.addCase(fetchAnalyticLocList.fulfilled, (state, { payload: list }) => {
      state.analyticsLocationList = list;
      state.analyticsLocationFetch = false;
    });
    builder.addCase(fetchAnalyticLocList.rejected, (state) => {
      state.analyticsLocationFetch = false;
    });
  },
});

export const analyticsLocationReducer = analyticsLocationsSlice.reducer;

export const selectAnalyticsLocationsList = (state: RootState) => state.analyticLocation.analyticsLocationList;
export const selectAnalyticsLocationsFetch = (state: RootState) => state.analyticLocation.analyticsLocationFetch;
