import React, { useEffect } from 'react';
import { Box, CardMedia, Chip, CircularProgress, Container, Grid, IconButton, Paper } from '@mui/material';
import CommercialLinkOneCard from './components/CommercialLinkOneCard';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectFetchLocationLinkLoading, selectLocationLinkOne } from './commercialLinkSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLocationLinkOne } from './CommercialLinkThunk';
import { apiURL } from '../../constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ReactMarkdown from 'react-markdown';

const CommercialLinkOne = () => {
  const navigate = useNavigate();
  const { idLoc } = useParams();
  const { idLink } = useParams();
  const dispatch = useAppDispatch();
  const locationLinkOne = useAppSelector(selectLocationLinkOne);
  const locationLinkOneLoading = useAppSelector(selectFetchLocationLinkLoading);

  useEffect(() => {
    if (idLink && idLoc) {
      dispatch(fetchLocationLinkOne({ idLink, idLoc }));
    }
  }, [dispatch, idLink, idLoc]);

  return (
    <>
      {!locationLinkOneLoading ? (
        <Container>
          <IconButton onClick={() => navigate(-1)} aria-label="delete">
            <ArrowCircleLeftIcon sx={{ fontSize: '50px' }} />
          </IconButton>
          <Grid container spacing={1}>
            <Grid item xs md={6}>
              <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                <SwiperSlide>
                  <CardMedia
                    component="img"
                    height="300"
                    image={apiURL + '/' + locationLinkOne.location?.schemaImage}
                    alt="schemaIm"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <CardMedia
                    component="img"
                    height="300"
                    image={apiURL + '/' + locationLinkOne.location?.dayImage}
                    alt="dayImage"
                  />
                </SwiperSlide>
              </Swiper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <CommercialLinkOneCard />
              </Box>
            </Grid>
          </Grid>
          <Paper sx={{ mt: 3, p: 1 }} elevation={3}>
            <Chip sx={{ fontSize: '20px', p: 3, my: 2 }} label="Информация" variant="outlined" color="info" />
            <ReactMarkdown>{locationLinkOne.description}</ReactMarkdown>
          </Paper>
        </Container>
      ) : (
        <CircularProgress color="success" />
      )}
    </>
  );
};

export default CommercialLinkOne;
