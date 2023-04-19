import React from 'react';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';

const CreateRegion = () => {
  return (
    <Typography variant="h5" component="h5">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SouthAmericaIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Создать регион
          </Typography>
          <Box component="form" sx={{ mt: 3, width: '100%' }}>
            <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth label="Название региона" type="email" name="email" autoComplete="off" />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Создать регион
            </Button>
          </Box>
        </Box>
      </Container>
    </Typography>
  );
};

export default CreateRegion;
