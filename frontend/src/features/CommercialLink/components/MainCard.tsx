import React from 'react';
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import bg from '../../../assets/bg.png';
import logo from '../../../assets/logo (1).png';

const MainCard = () => {
  const matches_900 = useMediaQuery('(min-width:900px)');
  const matches_600 = useMediaQuery('(min-width:600px)');
  return (
    <Box component="main">
      <Grid sx={{ mt: 2 }} alignItems="center" container>
        <Grid xs={12} md={5} item>
          <Box sx={{ mr: 2 }}>
            <h1
              style={{
                fontSize: matches_600 ? '30px' : '20px',
                margin: 0,
                lineHeight: matches_600 ? '45px' : '35px',
              }}
            >
              Шамадагай оператор наружной рекламы
            </h1>
            <p style={{ margin: '20px 0', fontSize: '20px', color: '#72727E' }}>
              На сегодняшний день наружная реклама в Кыргызстане представляет собой один из главных инструментов
              информационного воздействия на аудиторию.
            </p>
            <Button sx={{ padding: '15px 50px' }} variant="outlined" color="success" href="https://www.shamdagai.kg/">
              Подробнее
            </Button>
          </Box>
        </Grid>
        <Grid xs item>
          <Box
            sx={{
              background: `url("${bg}") no-repeat`,
              minHeight: matches_900 ? '673px' : '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={logo} alt="logo" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainCard;
