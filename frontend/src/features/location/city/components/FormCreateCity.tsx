import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { CityMutation, ValidationError } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { fetchAreas } from '../../area/areaThunk';
import { selectAreaList } from '../../area/areaSlice';
import { fetchCities } from '../cityThunk';

interface Props {
  onSubmit: (city: CityMutation) => void;
  existingCity?: CityMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: CityMutation = {
  name: '',
  area: '',
};

const FormCreateCity: React.FC<Props> = ({ onSubmit, existingCity = initialState, error, Loading, isEdit }) => {
  const dispatch = useAppDispatch();
  const areas = useAppSelector(selectAreaList);
  const [state, setState] = useState<CityMutation>(existingCity);

  useEffect(() => {
    dispatch(fetchAreas());
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
    dispatch(fetchCities());
    setState({
      area: '',
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
        <LocationCityIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать город' : 'Создать город'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              value={state.area}
              color="success"
              name="area"
              label="Область"
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('area'))}
              helperText={getFieldError('area')}
              required
            >
              <MenuItem value="" disabled>
                Выберите область
              </MenuItem>
              {areas &&
                areas.map((area) => (
                  <MenuItem key={area._id} value={area._id}>
                    {area.name}
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
              label="Название города"
              color="success"
              type="text"
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

export default FormCreateCity;
