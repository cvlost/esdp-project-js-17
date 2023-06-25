import React, { useEffect } from 'react';
import { Box, Typography, Container, Divider, Grid, CircularProgress, Alert } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import CommercialLinkCard from './components/CommercialLinkCard';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectFetchLocationLinkLoading, selectListLocationLink } from './commercialLinkSlice';
import { fetchLocationLink } from './CommercialLinkThunk';
import { useParams } from 'react-router-dom';
import { isEditUserLink } from '../location/locationsSlice';
const CommercialLink = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const listLocationLink = useAppSelector(selectListLocationLink);
  const loading = useAppSelector(selectFetchLocationLinkLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchLocationLink(id));
      dispatch(isEditUserLink());
    }
  }, [dispatch, id]);

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ my: 2, mr: 1 }} component="h1" variant="h4">
          Коммерческое предложение для {listLocationLink.title}
          <Divider light sx={{ mt: 1, background: '#ff6300', mb: 2 }} />
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {!loading ? (
          listLocationLink.location.length > 0 ? (
            listLocationLink.location.map((location) => (
              <CommercialLinkCard key={location._id} location={location} id={id} />
            ))
          ) : (
            <Alert severity="error">Сcылка удалена!</Alert>
          )
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Container>
  );
};

export default CommercialLink;
