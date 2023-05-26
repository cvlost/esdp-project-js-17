import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from '@mui/material';
import { MainColorGreen } from '../../../../constants';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateRangePicker } from 'rsuite';
import '../../components/Booking/Booking.css';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectClientsList, selectGetAllClientsLoading } from '../../client/clientSlice';
import { fetchClients } from '../../client/clientThunk';
import { DateRange } from 'rsuite/DateRangePicker';

const BookingForm = () => {
  const [valueDate, setValueDate] = useState<[Date, Date]>([new Date(), new Date()]);
  const [valueCLinet, setValueClient] = useState('');
  const clientList = useAppSelector(selectClientsList);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGetAllClientsLoading);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDateChange = (date: DateRange | null) => {
    setValueDate(date as [Date, Date]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const obj = {
      clientId: valueCLinet,
      booking_date: {
        start: valueDate[0].toISOString(),
        end: valueDate[1].toISOString(),
      },
    };

    console.log(obj);
  };

  return (
    <Box component="form" sx={{ maxWidth: '500px', p: 1 }} onSubmit={onSubmit}>
      <Grid container alignItems="center" spacing={3}>
        <Grid xs={12} item>
          <Paper elevation={3} sx={{ p: 1 }}>
            <Link to="create_client">
              <IconButton aria-label="delete">
                <AddCircleIcon sx={{ fontSize: '50px' }} />
              </IconButton>
            </Link>
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
            <TextField
              value={valueCLinet}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValueClient(e.target.value)}
              fullWidth
              select
              name="client"
              label="Клиенты"
              required
            >
              <MenuItem value="" disabled>
                Выберите клиента
              </MenuItem>
              {!loading ? (
                clientList.length !== 0 ? (
                  clientList.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))
                ) : (
                  <Alert severity="info">Список пуст</Alert>
                )
              ) : (
                <CircularProgress />
              )}
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
            <DateRangePicker
              placeholder="Выбрать даты"
              style={{ width: 300 }}
              value={valueDate}
              onChange={handleDateChange}
            />
          </Paper>
        </Grid>
        <Grid xs={12} item>
          <Button type="submit" variant="contained">
            Бронировать
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;
