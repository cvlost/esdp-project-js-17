import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { StreetMutation } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectCreateStreetLoading, selectStreetError } from '../streetSlice';
import SignpostIcon from '@mui/icons-material/Signpost';
import { selectCityList } from '../../city/citySlice';
import { fetchStreet } from '../streetThunks';
import { fetchCities } from '../../city/cityThunk';
import { fetchRegions } from '../../region/regionThunk';
import { selectRegionList } from '../../region/regionSlice';

interface Props {
  onSubmit: (street: StreetMutation) => void;
}

const FormCreateStreet: React.FC<Props> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(selectCityList);
  const createLoading = useAppSelector(selectCreateStreetLoading);
  const error = useAppSelector(selectStreetError);
  const regions = useAppSelector(selectRegionList);
  const [state, setState] = useState<StreetMutation>({
    city: '',
    name: '',
    region: null,
  });

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchRegions());
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
    dispatch(fetchStreet());
    setState({
      city: '',
      name: '',
      region: null,
    });
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };
  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
        <SignpostIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать улицу
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              value={state.city}
              name="city"
              label="Город/село"
              onChange={inputChangeHandler}
              autoComplete="off"
              error={Boolean(getFieldError('city'))}
              helperText={getFieldError('city')}
              required
            >
              <MenuItem value="" disabled>
                Выберите город/село
              </MenuItem>
              {cities &&
                cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid
            sx={{ display: cities.find((item) => item._id === state.city)?.name === 'Бишкек' ? 'block' : 'none' }}
            item
            xs={12}
          >
            <TextField
              fullWidth
              select
              value={state.region}
              name="region"
              label="Район"
              onChange={inputChangeHandler}
              autoComplete="off"
              error={Boolean(getFieldError('region'))}
              helperText={getFieldError('region')}
              required={cities.find((item) => item._id === state.city)?.name === 'Бишкек'}
            >
              <MenuItem value="" disabled>
                Выберите район
              </MenuItem>
              {regions &&
                regions.map((region) => (
                  <MenuItem key={region._id} value={region._id}>
                    {region.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.name}
              onChange={inputChangeHandler}
              required
              fullWidth
              label="Название улицы"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={createLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {!createLoading ? 'Создать улицу' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateStreet;
