import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { StreetMutation, ValidationError } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import SignpostIcon from '@mui/icons-material/Signpost';
import { selectCityList } from '../../city/citySlice';
import { fetchCities } from '../../city/cityThunk';

interface Props {
  onSubmit: (street: StreetMutation) => void;
  existingStreet?: StreetMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: StreetMutation = {
  name: '',
  city: '',
};

const FormCreateStreet: React.FC<Props> = ({ onSubmit, existingStreet = initialState, isEdit, Loading, error }) => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(selectCityList);
  const [state, setState] = useState<StreetMutation>(existingStreet);

  useEffect(() => {
    dispatch(fetchCities());
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
    setState({
      city: '',
      name: '',
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
      <Avatar sx={{ m: 1 }}>
        <SignpostIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать улицу' : 'Создать улицу'}
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
          <Grid item xs={12}>
            <TextField
              value={state.name}
              onChange={inputChangeHandler}
              required
              fullWidth
              label="Название улицы"
              type="text"
              color="success"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateStreet;
