import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import { useAppSelector } from '../../../../app/hooks';
import { selectCreateAreaLoading } from '../areaSlice';

const FormCreateArea = () => {
  const [value, setValue] = useState('');
  const createLoading = useAppSelector(selectCreateAreaLoading);

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
        <SouthAmericaIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать область
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
        <Button disabled={createLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {!createLoading ? 'Создать направление' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateArea;
