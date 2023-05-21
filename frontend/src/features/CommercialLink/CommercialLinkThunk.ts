import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import { CommercialLinkTypeMutation, contentLinkOneType, contentLinkType, Link } from '../../types';

export const createCommLink = createAsyncThunk<Link | null, CommercialLinkTypeMutation>(
  'commercialLink/createCommLink',
  async (arg) => {
    const response = await axiosApi.post<Link>('/link', arg);
    const jsn = response.data;

    if (!jsn) {
      throw new Error('not found');
    }

    return jsn;
  },
);

export const fetchLocationLink = createAsyncThunk<contentLinkType, string>(
  'commercialLink/fetchLocationLink',
  async (id) => {
    const response = await axiosApi.get<contentLinkType>('/link/location/' + id);
    return response.data;
  },
);

interface fetchLocationLinkOneType {
  idLoc: string;
  idLink: string;
}

export const fetchLocationLinkOne = createAsyncThunk<contentLinkOneType, fetchLocationLinkOneType>(
  'commercialLink/fetchLocationLinkOne',
  async (arg) => {
    const response = await axiosApi.get<contentLinkOneType>(`/link/location/${arg.idLink}/locationOne/${arg.idLoc}`);
    return response.data;
  },
);
