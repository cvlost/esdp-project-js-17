import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  FilterCriteriaResponse,
  FilterState,
  ILocation,
  LocationsListResponse,
  LocationSubmit,
  ValidationError,
} from '../../types';
import axiosApi from '../../axios';
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store';

const combineFilterQuery = (filter: FilterState) => {
  const combinedQuery: object[] = [];

  const streetFilter = { street: { $in: filter.streets.map((street) => street._id) } };
  const areaFilter = { area: { $in: filter.areas.map((area) => area._id) } };
  const cityFilter = { city: { $in: filter.cities.map((city) => city._id) } };
  const formatFilter = { format: { $in: filter.formats.map((format) => format._id) } };
  const directionFilter = { direction: { $in: filter.directions.map((direction) => direction._id) } };
  const regionFilter = { region: { $in: filter.regions.map((region) => region._id) } };
  const sizeFilter = { size: { $in: filter.sizes } };
  const legalEntitiesFilter = { legalEntity: { $in: filter.legalEntities.map((le) => le._id) } };
  const lightingsFilter = { lighting: { $in: filter.lightings } };

  if (streetFilter.street.$in.length) combinedQuery.push(streetFilter);
  if (areaFilter.area.$in.length) combinedQuery.push(areaFilter);
  if (cityFilter.city.$in.length) combinedQuery.push(cityFilter);
  if (formatFilter.format.$in.length) combinedQuery.push(formatFilter);
  if (directionFilter.direction.$in.length) combinedQuery.push(directionFilter);
  if (regionFilter.region.$in.length) combinedQuery.push(regionFilter);
  if (sizeFilter.size.$in.length) combinedQuery.push(sizeFilter);
  if (legalEntitiesFilter.legalEntity.$in.length) combinedQuery.push(legalEntitiesFilter);
  if (lightingsFilter.lighting.$in.length) combinedQuery.push(lightingsFilter);

  return combinedQuery.length ? { $and: combinedQuery } : undefined;
};

type RequestParams = { page: number; perPage: number; filter?: boolean } | undefined;

export const getLocationsList = createAsyncThunk<LocationsListResponse, RequestParams, { state: RootState }>(
  'locations/getAll',
  async (params, { getState }) => {
    const queryString = params ? `?page=${params.page}&perPage=${params.perPage}` : '';
    const filterQuery = params?.filter ? combineFilterQuery(getState().locations.settings.filter) : undefined;
    const response = await axiosApi.post<LocationsListResponse>(`/locations${queryString}`, { filterQuery });
    return response.data;
  },
);

export const createLocation = createAsyncThunk<void, LocationSubmit, { rejectValue: ValidationError }>(
  'locations/create',
  async (locationSubmit, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('addressNote', locationSubmit.addressNote);
      formData.append('description', locationSubmit.description);
      formData.append('country', locationSubmit.country);
      formData.append('area', locationSubmit.area);
      formData.append('region', locationSubmit.region);
      formData.append('city', locationSubmit.city);
      formData.append('street', locationSubmit.street);
      formData.append('direction', locationSubmit.direction);
      formData.append('legalEntity', locationSubmit.legalEntity);
      formData.append('size', locationSubmit.size);
      formData.append('format', locationSubmit.format);
      formData.append('lighting', locationSubmit.lighting);
      formData.append('placement', JSON.stringify(locationSubmit.placement));
      formData.append('price', locationSubmit.price);
      if (locationSubmit.dayImage) {
        formData.append('dayImage', locationSubmit.dayImage);
      }
      if (locationSubmit.schemaImage) {
        formData.append('schemaImage', locationSubmit.schemaImage);
      }

      await axiosApi.post('/locations', formData);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const getOneLocation = createAsyncThunk<ILocation, string>('locations/getOne', async (id) => {
  const response = await axiosApi.get(`/locations/${id}`);
  return response.data;
});

export const removeLocation = createAsyncThunk<void, string>('locations/remove_location', async (id) => {
  await axiosApi.delete('/locations/' + id);
});

export const getFilterCriteriaData = createAsyncThunk<FilterCriteriaResponse, void, { state: RootState }>(
  'locations/getFilterCriteriaData',
  async (_, { getState }) => {
    const filterQuery = combineFilterQuery(getState().locations.settings.filter);
    const response = await axiosApi.post<FilterCriteriaResponse>(`/locations/filter`, { filterQuery });
    return response.data;
  },
);
