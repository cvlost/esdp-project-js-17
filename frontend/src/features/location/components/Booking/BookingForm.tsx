import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
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
import { createBooking, getOneLocation } from '../../locationsThunks';
import { selectCreateBookingError, selectOneLocation } from '../../locationsSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import dayjs from 'dayjs';
import { openSnackbar } from '../../../users/usersSlice';

interface Props {
  locationId: string;
  isPage?: boolean;
}

const BookingForm: React.FC<Props> = ({ locationId, isPage }) => {
  const [valueDate, setValueDate] = useState<[Date, Date]>([new Date(), new Date()]);
  const [valueCLinet, setValueClient] = useState('');
  const clientList = useAppSelector(selectClientsList);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGetAllClientsLoading);
  const error = useAppSelector(selectCreateBookingError);
  const oneLocation = useAppSelector(selectOneLocation);

  useEffect(() => {
    dispatch(fetchClients());
    if (isPage === undefined) {
      dispatch(getOneLocation(locationId));
    }
  }, [dispatch, locationId, isPage]);

  const handleDateChange = (date: DateRange | null) => {
    setValueDate(date as [Date, Date]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const obj = {
      clientId: valueCLinet,
      locationId,
      booking_date: {
        end: new Date(valueDate[1]),
        start: new Date(valueDate[0]),
      },
    };

    await dispatch(createBooking(obj)).unwrap();
    await dispatch(getOneLocation(locationId)).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_booking' }));
    setValueClient('');
    setValueDate([new Date(), new Date()]);
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <Box component="form" sx={{ maxWidth: '500px', p: 1 }} onSubmit={onSubmit}>
      <Grid container alignItems="center" rowSpacing={2}>
        <Grid xs={12} item>
          {error && <Alert severity="error">{error.message}</Alert>}
        </Grid>
        <Grid display="flex" xs={12} item>
          <Paper elevation={3}>
            {oneLocation &&
              oneLocation.booking.map((item) => (
                <Tooltip
                  key={item._id}
                  title={
                    <>
                      <Typography component="p">
                        Старт: {dayjs(item.booking_date.start).format('DD.MM.YYYY')}
                      </Typography>
                      <Divider />
                      <Typography component="p">Конец: {dayjs(item.booking_date.end).format('DD.MM.YYYY')}</Typography>
                    </>
                  }
                >
                  <AccountCircleIcon />
                </Tooltip>
              ))}
          </Paper>
        </Grid>
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
              error={Boolean(getFieldError('clientId'))}
              helperText={getFieldError('clientId')}
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
