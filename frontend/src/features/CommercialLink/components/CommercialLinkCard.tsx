import React from 'react';
import { Button, CardMedia, Grid, Paper } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { ILocationLink } from '../../../types';
import { apiURL } from '../../../constants';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../CommercialLink/style.css';
import { Link } from 'react-router-dom';

interface Props {
  location: ILocationLink;
  id: string | undefined;
}

const CommercialLinkCard: React.FC<Props> = ({ location, id }) => {
  return (
    <Grid display="flex" flexDirection="column" item xs sm={4} md={4}>
      <Paper elevation={5} sx={{ background: 'rgba(181,181,187,0.17)', p: 1, borderRadius: '20px' }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: '20px',
          }}
        >
          <Swiper navigation={true} modules={[Navigation]} className="mySwiper custom-swiper">
            <SwiperSlide>
              <CardMedia
                component="img"
                height="350"
                image={apiURL + '/' + location.schemaImage}
                alt={location.addressNote}
                sx={{ borderRadius: '20px' }}
              />
            </SwiperSlide>
            <SwiperSlide>
              <CardMedia
                component="img"
                height="350"
                image={apiURL + '/' + location.dayImage}
                alt={location.addressNote}
                sx={{ borderRadius: '20px' }}
              />
            </SwiperSlide>
          </Swiper>
        </Paper>
      </Paper>
      <Button
        component={Link}
        to={`/location/${id}/locationOne/${location._id}`}
        size="large"
        sx={{ m: '0 auto', mt: 2, background: '#446DF6' }}
        variant="contained"
      >
        Подробнее
      </Button>
    </Grid>
  );
};

export default CommercialLinkCard;
