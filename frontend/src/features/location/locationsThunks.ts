import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  BookingMutation,
  FilterCriteriaResponse,
  FilterState,
  GetItemsListType,
  ILocation,
  LocationMutation,
  LocationsListResponse,
  RentMutation,
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
  const rentFilter =
    filter.rent === 'rentedOnly' ? { rent: { $ne: null } } : filter.rent === 'freeOnly' ? { rent: null } : null;
  const placement =
    filter.placement === 'placementTrueOnly'
      ? { placement: true }
      : filter.placement === 'placementFalseOnly'
      ? { placement: false }
      : null;

  if (streetFilter.street.$in.length) combinedQuery.push(streetFilter);
  if (areaFilter.area.$in.length) combinedQuery.push(areaFilter);
  if (cityFilter.city.$in.length) combinedQuery.push(cityFilter);
  if (formatFilter.format.$in.length) combinedQuery.push(formatFilter);
  if (directionFilter.direction.$in.length) combinedQuery.push(directionFilter);
  if (regionFilter.region.$in.length) combinedQuery.push(regionFilter);
  if (sizeFilter.size.$in.length) combinedQuery.push(sizeFilter);
  if (legalEntitiesFilter.legalEntity.$in.length) combinedQuery.push(legalEntitiesFilter);
  if (lightingsFilter.lighting.$in.length) combinedQuery.push(lightingsFilter);
  if (rentFilter) combinedQuery.push(rentFilter);
  if (placement) combinedQuery.push(placement);

  return combinedQuery.length ? { $and: combinedQuery } : undefined;
};

type RequestParams = { page: number; perPage: number; filtered?: boolean } | undefined;

export const getLocationsList = createAsyncThunk<LocationsListResponse, RequestParams, { state: RootState }>(
  'locations/getAll',
  async (params, { getState }) => {
    const queryString = params ? `?page=${params.page}&perPage=${params.perPage}` : '';
    const filterQuery = params?.filtered ? combineFilterQuery(getState().locations.settings.filter) : undefined;
    const response = await axiosApi.post<LocationsListResponse>(`/locations${queryString}`, { filterQuery });
    return response.data;
  },
);

export const getItems = createAsyncThunk<GetItemsListType>('locations/getItems', async () => {
  const response = await axiosApi.get<GetItemsListType>('/locations/getItems');
  return response.data;
});

export const createLocation = createAsyncThunk<void, LocationMutation, { rejectValue: ValidationError }>(
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
      formData.append('streets[]', locationSubmit.streets[0]);
      formData.append('streets[]', locationSubmit.streets[1]);
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

      await axiosApi.post('/locations/create', formData);
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

export const getToEditOneLocation = createAsyncThunk<LocationMutation, string>('locations/getOneToEdit', async (id) => {
  const response = await axiosApi.get(`/locations/edit/${id}`);
  return response.data;
});

interface UpdateLocationParams {
  id: string;
  locEdit: LocationMutation;
}

export const updateLocation = createAsyncThunk<void, UpdateLocationParams, { rejectValue: ValidationError }>(
  'locations/edit',
  async ({ id, locEdit }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('addressNote', locEdit.addressNote);
      formData.append('description', locEdit.description);
      formData.append('country', locEdit.country);
      formData.append('area', locEdit.area);
      formData.append('region', locEdit.region);
      formData.append('city', locEdit.city);
      formData.append('streets[]', locEdit.streets[0]);
      formData.append('streets[]', locEdit.streets[1]);
      formData.append('direction', locEdit.direction);
      formData.append('legalEntity', locEdit.legalEntity);
      formData.append('size', locEdit.size);
      formData.append('format', locEdit.format);
      formData.append('lighting', locEdit.lighting);
      formData.append('placement', JSON.stringify(locEdit.placement));
      formData.append('price', locEdit.price);
      if (locEdit.dayImage) {
        formData.append('dayImage', locEdit.dayImage);
      }
      if (locEdit.schemaImage) {
        formData.append('schemaImage', locEdit.schemaImage);
      }
      await axiosApi.put(`/locations/edit/${id}`, formData);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

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

interface CheckedLocationType {
  id: string | undefined;
  allChecked: boolean;
}

export const checkedLocation = createAsyncThunk<void, CheckedLocationType>('locations/check_location', async (arg) => {
  let url = '/';

  if (arg.id) {
    url = `/locations/checked?checked=${arg.id}`;
  } else if (arg.allChecked) {
    url = `/locations/checked?allChecked=true`;
  }

  await axiosApi.patch(url, { checked: true });
});

interface UpdateRentParams {
  id: string;
  rent: RentMutation;
}

export const updateRent = createAsyncThunk<
  void,
  UpdateRentParams,
  {
    rejectValue: ValidationError;
  }
>('locations/updateRent', async (params, { rejectWithValue }) => {
  try {
    const rentDate =
      params.rent.date !== null
        ? {
            start: params.rent.date[0],
            end: params.rent.date[1],
          }
        : null;
    await axiosApi.patch('locations/updateRent/' + params.id, {
      date: rentDate,
      client: params.rent.client !== '' ? params.rent.client : null,
      price: params.rent.price,
    });
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createBooking = createAsyncThunk<void, BookingMutation, { rejectValue: ValidationError }>(
  'locations/createBooking',
  async (bookingMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/bookings', bookingMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

interface removeBookingType {
  idLoc: string;
  idBook: string;
}

export const removeBooking = createAsyncThunk<void, removeBookingType>('locations/removeBooking', async (arg) => {
  await axiosApi.delete(`/bookings/${arg.idLoc}/${arg.idBook}`);
});
