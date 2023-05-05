import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILocation, LocationsListResponse, LocationSubmit, ValidationError } from '../../types';
import axiosApi from '../../axios';
import { isAxiosError } from 'axios';

type RequestParams = { page: number; perPage: number } | undefined;

export const getLocationsList = createAsyncThunk<LocationsListResponse, RequestParams>(
  'locations/getAll',
  async (params) => {
    let queryString = '';
    if (params) {
      queryString = `?page=${params.page}&perPage=${params.perPage}`;
    }
    const response = await axiosApi.get<LocationsListResponse>(`/locations${queryString}`);
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
