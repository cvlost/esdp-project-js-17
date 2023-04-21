import React, { useState } from 'react';
import { Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const FormCreateDirection = () => {
  const [value, setValue] = useState('');

  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
        <GpsFixedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать направление
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              required
              fullWidth
              label="Направление"
              type="text"
              name="name"
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Создать регион
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateDirection;
