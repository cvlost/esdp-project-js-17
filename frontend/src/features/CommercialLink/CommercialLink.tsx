import React, { useEffect } from 'react';
import { Box, Container, Grid, CircularProgress, Alert, useMediaQuery } from '@mui/material';
import CommercialLinkCard from './components/CommercialLinkCard';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectFetchLocationLinkLoading, selectListLocationLink } from './commercialLinkSlice';
import { fetchLocationLink } from './CommercialLinkThunk';
import { useParams } from 'react-router-dom';
import { isEditUserLink } from '../location/locationsSlice';
import MainCard from './components/MainCard';
import AppBarCard from './components/AppBarCard';

const CommercialLink = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const listLocationLink = useAppSelector(selectListLocationLink);
  const loading = useAppSelector(selectFetchLocationLinkLoading);
  const matches_600 = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    if (id) {
      dispatch(fetchLocationLink(id));
      dispatch(isEditUserLink());
    }
  }, [dispatch, id]);

  return (
    <>
      <AppBarCard />
      <Container>
        <MainCard />
        <Box component="section">
          <Box
            sx={{
              textAlign: 'center',
              width: '50%',
              ml: 'auto',
              mr: 'auto',
              my: 4,
            }}
          >
            <h2
              style={{
                fontSize: matches_600 ? '30px' : '20px',
                margin: '50px 0 70px 0',
                lineHeight: matches_600 ? '45px' : '35px',
              }}
            >
              Коммерческое предложение для <span style={{ color: 'orange' }}>{listLocationLink.title}</span>
            </h2>
          </Box>
          <Grid container rowSpacing={10} columnSpacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
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
        </Box>
      </Container>
      <Box sx={{ mt: '150px' }} component="footer">
        <AppBarCard />
      </Box>
    </>
  );
};

export default CommercialLink;
