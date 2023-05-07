import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCreateLocationError, selectCreateLocationLoading } from './locationsSlice';
import { LocationMutation } from '../../types';
import { createLocation } from './locationsThunks';
import { Container } from '@mui/material';
import LocationForm from './components/LocationForm';
import { openSnackbar } from '../users/usersSlice';

const CreateLocation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectCreateLocationLoading);
  const error = useAppSelector(selectCreateLocationError);

  const submitFormHandler = async (location: LocationMutation) => {
    await dispatch(createLocation(location)).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_location' }));
    navigate('/location');
  };

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <LocationForm error={error} onSubmit={submitFormHandler} isLoading={creating} />
    </Container>
  );
};

export default CreateLocation;
