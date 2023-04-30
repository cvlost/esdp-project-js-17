import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILocation, LocationMutation, LocationsListResponse, ValidationError } from '../../types';
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

export const createLocation = createAsyncThunk<void, LocationMutation, { rejectValue: ValidationError }>(
  'locations/create',
  async (locatMutation, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('addressNote', locatMutation.addressNote);
      formData.append('description', locatMutation.description);
      formData.append('country', locatMutation.country);
      formData.append('area', locatMutation.area);
      formData.append('region', locatMutation.region);
      formData.append('city', locatMutation.city);
      formData.append('street', locatMutation.street);
      formData.append('direction', locatMutation.direction);
      formData.append('legalEntity', locatMutation.legalEntity);
      formData.append('size', locatMutation.size);
      formData.append('format', locatMutation.format);
      formData.append('lighting', JSON.stringify(locatMutation.lighting));
      formData.append('placement', JSON.stringify(locatMutation.placement));
      if (locatMutation.rent) {
        const startDate = locatMutation.rent[0]?.toISOString();
        const endDate = locatMutation.rent[1]?.toISOString();
        const rentObject = { startDate, endDate };
        formData.append('rent', JSON.stringify(rentObject));
      }
      formData.append('price', locatMutation.price);
      if (locatMutation.dayImage) {
        formData.append('dayImage', locatMutation.dayImage);
      }
      if (locatMutation.schemaImage) {
        formData.append('schemaImage', locatMutation.schemaImage);
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
