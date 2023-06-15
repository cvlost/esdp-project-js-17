import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectOneLocation, selectOneLocationLoading } from '../locationsSlice';
import { getOneLocation } from '../locationsThunks';
import { useNavigate, useParams } from 'react-router-dom';
import imagePlaceholder from '../../../assets/billboard-placeholder.jpg';
import LocationPageTabs from './LocationPageTabs';
import { apiURL } from '../../../constants';
import BookingForm from './BookingForm/BookingForm';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import BookingList from './BookingList';
import ModalBody from '../../../components/ModalBody';

const LocationPage = () => {
  const [isPage, setIsPage] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [openBookingList, setOpenBookingList] = useState(false);
  const dispatch = useAppDispatch();
  const id = useParams().id as string;
  const loc = useAppSelector(selectOneLocation);
  const locLoading = useAppSelector(selectOneLocationLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getOneLocation(id));
    }
  }, [dispatch, id]);

  const openModal = (name: string) => {
    setIsPage(true);
    if (name === 'modal') setOpenBooking(true);
    else if (name === 'list') setOpenBookingList(true);
  };

  return (
    <Box sx={{ py: 2 }}>
      {locLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              sx={{ fontSize: '20px', p: 3, mb: 2 }}
              label={`Локация ${loc?.city} ${loc?.streets[0] + '/' + loc?.streets[1]}, ${loc?.direction}`}
              variant="outlined"
              color="info"
            />
            <Button onClick={() => navigate(-1)} sx={{ ml: 1 }} variant="outlined">
              Вернуться в аналитику
            </Button>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Box sx={{ top: '1em', width: '50%' }}>
                <Typography component="h5" variant="h5" sx={{ mb: 1, textAlign: 'center' }}>
                  Днем
                </Typography>
                <img
                  alt={`Локация ${loc?.city} ${loc?.streets[0] + '/' + loc?.streets[1]}, ${loc?.direction}`}
                  src={loc?.dayImage ? `${apiURL}/${loc.dayImage}` : imagePlaceholder}
                  style={{
                    maxWidth: '100%',
                    boxShadow: '0 0 15px gainsboro',
                  }}
                />
              </Box>
              <Box sx={{ top: '1em', width: '50%' }}>
                <Typography component="h5" variant="h5" sx={{ mb: 1, textAlign: 'center' }}>
                  Схема
                </Typography>
                <img
                  alt={`Локация ${loc?.city} ${loc?.streets[0] + '/' + loc?.streets[1]}, ${loc?.direction}`}
                  src={loc?.dayImage ? `${apiURL}/${loc.schemaImage}` : imagePlaceholder}
                  style={{
                    maxWidth: '100%',
                    boxShadow: '0 0 15px gainsboro',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <LocationPageTabs
                  openModalBookingList={() => openModal('list')}
                  openModalBooking={() => openModal('modal')}
                />
              </Box>
            </Grid>
          </Grid>
          <ModalBody isOpen={openBooking} onClose={() => setOpenBooking(false)}>
            <BookingForm closeModal={() => setOpenBooking(false)} isPage={isPage} locationId={id} />
          </ModalBody>
          <ModalBody isOpen={openBookingList} onClose={() => setOpenBookingList(false)} maxWidth="md">
            <BookingList isPage={isPage} locationId={id} />
          </ModalBody>
          <SnackbarCard />
        </>
      )}
    </Box>
  );
};

export default LocationPage;
