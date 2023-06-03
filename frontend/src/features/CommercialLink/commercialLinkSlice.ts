import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CommercialLinkTypeMutation,
  ConstructorLinkType,
  contentLinkOneType,
  contentLinkType,
  Link,
  listLinkType,
} from '../../types';
import { RootState } from '../../app/store';
import {
  createCommLink,
  fetchLinkList,
  fetchLocationLink,
  fetchLocationLinkOne,
  removeLink,
} from './CommercialLinkThunk';

interface commercialLinkType {
  url: Link | null;
  commLink: CommercialLinkTypeMutation;
  createLinkLoading: boolean;
  fetchLocationLinkLoading: boolean;
  constructorLink: ConstructorLinkType[];
  listLocationLink: contentLinkType;
  locationLinkOne: contentLinkOneType;
  fetchLocationLinkOneLoading: boolean;
  listLink: listLinkType;
  fetchListLinkLoading: boolean;
  removeLinkLoading: boolean;
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
    { id: '1', name: 'addressNote', show: true },
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
  listLocationLink: {
    location: [],
    description: '',
    title: '',
  },
  locationLinkOne: {
    location: null,
    description: '',
    title: '',
  },
  fetchLocationLinkOneLoading: false,
  listLink: {
    listLink: [],
    page: 1,
    pages: 1,
    listLinkLength: 0,
    perPage: 10,
  },
  fetchListLinkLoading: false,
  removeLinkLoading: false,
};

const commercialLinkSlice = createSlice({
  name: 'commercialLink',
  initialState,
  reducers: {
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.listLink.page = page;
    },
    isToggleShow: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.constructorLink.findIndex((item) => item.id === id);
      state.constructorLink[index].show = !state.constructorLink[index].show;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCommLink.pending, (state) => {
      state.createLinkLoading = true;
    });
    builder.addCase(createCommLink.fulfilled, (state, { payload: link }) => {
      state.createLinkLoading = false;
      state.url = link;
    });
    builder.addCase(createCommLink.rejected, (state) => {
      state.createLinkLoading = false;
    });

    builder.addCase(fetchLocationLink.pending, (state) => {
      state.fetchLocationLinkLoading = true;
    });
    builder.addCase(fetchLocationLink.fulfilled, (state, { payload: locationListLink }) => {
      state.fetchLocationLinkLoading = false;
      state.listLocationLink = locationListLink;
    });
    builder.addCase(fetchLocationLink.rejected, (state) => {
      state.fetchLocationLinkLoading = false;
    });

    builder.addCase(fetchLocationLinkOne.pending, (state) => {
      state.fetchLocationLinkOneLoading = true;
    });
    builder.addCase(fetchLocationLinkOne.fulfilled, (state, { payload: locationLinkOne }) => {
      state.fetchLocationLinkOneLoading = false;
      state.locationLinkOne = locationLinkOne;
    });
    builder.addCase(fetchLocationLinkOne.rejected, (state) => {
      state.fetchLocationLinkOneLoading = false;
    });

    builder.addCase(fetchLinkList.pending, (state) => {
      state.fetchListLinkLoading = true;
    });
    builder.addCase(fetchLinkList.fulfilled, (state, { payload: linkList }) => {
      state.fetchListLinkLoading = false;
      state.listLink = linkList;
    });
    builder.addCase(fetchLinkList.rejected, (state) => {
      state.fetchListLinkLoading = false;
    });

    builder.addCase(removeLink.pending, (state) => {
      state.removeLinkLoading = true;
    });
    builder.addCase(removeLink.fulfilled, (state) => {
      state.removeLinkLoading = false;
    });
    builder.addCase(removeLink.rejected, (state) => {
      state.removeLinkLoading = false;
    });
  },
});

export const commercialLinkReducer = commercialLinkSlice.reducer;
export const { isToggleShow, setCurrentPage } = commercialLinkSlice.actions;
export const selectUrl = (state: RootState) => state.commercialLink.url;
export const selectLocationLink = (state: RootState) => state.commercialLink.commLink;
export const selectCreateLinkLoading = (state: RootState) => state.commercialLink.createLinkLoading;
export const selectFetchLocationLinkLoading = (state: RootState) => state.commercialLink.fetchLocationLinkLoading;
export const selectConstructor = (state: RootState) => state.commercialLink.constructorLink;
export const selectListLocationLink = (state: RootState) => state.commercialLink.listLocationLink;
export const selectLocationLinkOne = (state: RootState) => state.commercialLink.locationLinkOne;
export const selectLocationLinkOneLoading = (state: RootState) => state.commercialLink.fetchLocationLinkOneLoading;
export const selectListLink = (state: RootState) => state.commercialLink.listLink;
export const selectLoadingListLink = (state: RootState) => state.commercialLink.fetchListLinkLoading;
export const selectRemoveLinkLoading = (state: RootState) => state.commercialLink.removeLinkLoading;
