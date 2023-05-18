import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommercialLinkTypeMutation, ConstructorLinkType, Link } from '../../types';
import { RootState } from '../../app/store';

interface commercialLinkType {
  url: Link | null;
  commLink: CommercialLinkTypeMutation;
  createLinkLoading: boolean;
  fetchLocationLinkLoading: boolean;
  constructorLink: ConstructorLinkType[];
}

const initialState: commercialLinkType = {
  url: null,
  commLink: {
    location: [],
    settings: [],
    description: '',
    title: '',
  },
  createLinkLoading: false,
  fetchLocationLinkLoading: false,
  constructorLink: [
    { id: '1', name: 'address', show: true },
    { id: '2', name: 'area', show: true },
    { id: '3', name: 'city', show: true },
    { id: '4', name: 'region', show: true },
    { id: '5', name: 'street', show: true },
    { id: '6', name: 'direction', show: true },
    { id: '7', name: 'legalEntity', show: true },
    { id: '8', name: 'size', show: true },
    { id: '9', name: 'format', show: true },
    { id: '10', name: 'lighting', show: true },
    { id: '11', name: 'placement', show: true },
    { id: '12', name: 'price', show: true },
    { id: '13', name: 'rent', show: true },
    { id: '14', name: 'reserve', show: true },
  ],
};

const commercialLinkSlice = createSlice({
  name: 'commercialLink',
  initialState,
  reducers: {
    isToggleShow: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.constructorLink.findIndex((item) => item.id === id);
      state.constructorLink[index].show = !state.constructorLink[index].show;
    },
  },
});

export const commercialLinkReducer = commercialLinkSlice.reducer;
export const { isToggleShow } = commercialLinkSlice.actions;
export const selectUrl = (state: RootState) => state.commercialLink.url;
export const selectLocationLink = (state: RootState) => state.commercialLink.commLink;
export const selectCreateLinkLoading = (state: RootState) => state.commercialLink.createLinkLoading;
export const selectFetchLocationLinkLoading = (state: RootState) => state.commercialLink.fetchLocationLinkLoading;
export const selectConstructor = (state: RootState) => state.commercialLink.constructorLink;
