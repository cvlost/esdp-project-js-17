import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCreateLocationError, selectCreateLocationLoading } from './locationsSlice';
import { LocationSubmit } from '../../types';
import { createLocation } from './locationsThunks';
import { Avatar, Box, Container, Typography } from '@mui/material';
import LocationForm from './components/LocationForm';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { openSnackbar } from '../users/usersSlice';

const CreateLocation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectCreateLocationLoading);
  const error = useAppSelector(selectCreateLocationError);

  const submitFormHandler = async (location: LocationSubmit) => {
    await dispatch(createLocation(location)).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_location' }));
    navigate('/location');
  };

  return (
    <Container maxWidth="sm" sx={{ mb: 4 }}>
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
          <AddLocationIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Создание локации
        </Typography>
      </Box>
      <LocationForm error={error} onSubmit={submitFormHandler} isLoading={creating} />
    </Container>
  );
};

export default CreateLocation;
