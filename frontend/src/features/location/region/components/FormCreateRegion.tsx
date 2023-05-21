import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import { RegionMutation } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectCreateRegionLoading, selectRegionError } from '../regionSlice';
import { selectCityList } from '../../city/citySlice';
import { fetchCities } from '../../city/cityThunk';

interface Props {
  onSubmit: (region: RegionMutation) => void;
}

const FormCreateRegion: React.FC<Props> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreateRegionLoading);
  const cities = useAppSelector(selectCityList);
  const error = useAppSelector(selectRegionError);
  const [state, setState] = useState({
    city: '',
    name: '',
  });

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
    setState({ city: '', name: '' });
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
      <Avatar sx={{ m: 1 }}>
        <SouthAmericaIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать район
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              value={state.city}
              name="city"
              label="Город"
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('city'))}
              helperText={getFieldError('city')}
              required
            >
              <MenuItem value="" disabled>
                Выберите область
              </MenuItem>
              {cities &&
                cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
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
              label="Название района"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button
          disabled={createLoading}
          color="success"
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {!createLoading ? 'Создать регион' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateRegion;
