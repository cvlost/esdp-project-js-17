import React from 'react';
import { Box, Button, Chip, Grid, IconButton, MenuItem, Paper, TextField } from '@mui/material';
import { MainColorGreen } from '../../../../constants';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateRangePicker } from 'rsuite';
import '../../components/Booking/Booking.css';

const BookingForm = () => {
  return (
    <Box component="form" sx={{ maxWidth: '500px', p: 1 }}>
      <Grid container alignItems="center" spacing={3}>
        <Grid xs={12} item>
          <Paper elevation={3} sx={{ p: 1 }}>
            <IconButton aria-label="delete">
              <AddCircleIcon sx={{ fontSize: '50px' }} />
            </IconButton>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen }}
              label="Создать пользователя"
              variant="outlined"
              color="success"
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 1 }}
              label="Выбрать клиентов"
              variant="outlined"
              color="success"
            />
            <TextField fullWidth select name="client" label="Клиенты" required>
              <MenuItem value="" disabled>
                Выберите клиента
              </MenuItem>
              <MenuItem>Клиент 1</MenuItem>
              <MenuItem>Клиент 2</MenuItem>
            </TextField>
          </Paper>
        </Grid>
        <Grid xs={12} item>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 1 }}
              label="Выбрать даты"
              variant="outlined"
              color="success"
            />
            <DateRangePicker showOneCalendar placeholder="Выбрать даты" style={{ width: 300 }} />
          </Paper>
        </Grid>
        <Grid xs={12} item>
          <Button variant="contained">Бронировать</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;
