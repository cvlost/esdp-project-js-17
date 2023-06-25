import React, { useEffect } from 'react';
import { Box, CardMedia, CircularProgress, Container, Paper } from '@mui/material';
import CommercialLinkOneCard from './components/CommercialLinkOneCard';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectFetchLocationLinkLoading, selectLocationLinkOne } from './commercialLinkSlice';
import { useParams } from 'react-router-dom';
import { fetchLocationLinkOne } from './CommercialLinkThunk';
import { apiURL } from '../../constants';
import ReactMarkdown from 'react-markdown';
import AppBarCard from './components/AppBarCard';
import { isEditUserLink } from '../location/locationsSlice';

const CommercialLinkOne = () => {
  const { idLoc } = useParams();
  const { idLink } = useParams();
  const dispatch = useAppDispatch();
  const locationLinkOne = useAppSelector(selectLocationLinkOne);
  const locationLinkOneLoading = useAppSelector(selectFetchLocationLinkLoading);

  useEffect(() => {
    if (idLink && idLoc) {
      dispatch(fetchLocationLinkOne({ idLink, idLoc }));
      dispatch(isEditUserLink());
    }
  }, [dispatch, idLink, idLoc]);

  return (
    <>
      <AppBarCard />
      {!locationLinkOneLoading ? (
        <Container>
          <Paper elevation={5} sx={{ background: 'rgba(181,181,187,0.17)', p: 1, borderRadius: '20px', mt: 3 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: '20px',
              }}
            >
              <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                <SwiperSlide>
                  <CardMedia
                    component="img"
                    height="500"
                    image={apiURL + '/' + locationLinkOne.location?.schemaImage}
                    alt="Paella dish"
                    sx={{ borderRadius: '20px' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <CardMedia
                    component="img"
                    height="500"
                    image={apiURL + '/' + locationLinkOne.location?.dayImage}
                    alt="Paella dish"
                    sx={{ borderRadius: '20px' }}
                  />
                </SwiperSlide>
              </Swiper>
            </Paper>
          </Paper>
          <Box sx={{ mt: 3 }}>
            <CommercialLinkOneCard />
          </Box>

          <Paper elevation={3}>
            <ReactMarkdown>{locationLinkOne.description}</ReactMarkdown>
          </Paper>
        </Container>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default CommercialLinkOne;
