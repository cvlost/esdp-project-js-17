import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { CityMutation } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectCityError, selectCreateCityLoading } from '../citySlice';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { fetchAreas } from '../../area/areaThunk';
import { selectAreaList } from '../../area/areaSlice';
import { fetchCities } from '../cityThunk';

interface Props {
  onSubmit: (city: CityMutation) => void;
}

const FormCreateCity: React.FC<Props> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const areas = useAppSelector(selectAreaList);
  const createLoading = useAppSelector(selectCreateCityLoading);
  const error = useAppSelector(selectCityError);
  const [state, setState] = useState<CityMutation>({
    area: '',
    name: '',
  });
  console.log(state);

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
      <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
        <LocationCityIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать город
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              value={state.area}
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
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={createLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {!createLoading ? 'Создать город' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateCity;
