import React from 'react';
import { Box, CardMedia, Chip, Container, Grid, Paper } from '@mui/material';
import CommercialLinkOneCard from './components/CommercialLinkOneCard';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

const CommercialLinkOne = () => {
  return (
    <Container>
      <Chip sx={{ fontSize: '20px', p: 3, my: 2 }} label="Локация" variant="outlined" color="info" />
      <Grid container spacing={1}>
        <Grid item xs md={6}>
          <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            <SwiperSlide>
              <CardMedia
                component="img"
                height="300"
                image="https://img3.akspic.ru/previews/5/5/4/1/7/171455/171455-zhivopis-illustracia-art-voda-oblako-500x.jpg"
                alt="Paella dish"
              />
            </SwiperSlide>
            <SwiperSlide>
              <CardMedia
                component="img"
                height="300"
                image="https://i.pinimg.com/originals/8a/de/fe/8adefe5af862b4f9cec286c6ee4722cb.jpg"
                alt="Paella dish"
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
      <Paper>Информация</Paper>
    </Container>
  );
};

export default CommercialLinkOne;
