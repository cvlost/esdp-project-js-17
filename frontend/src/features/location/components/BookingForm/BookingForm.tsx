import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DateRangePicker } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectClientsList, selectGetAllClientsLoading } from '../../client/clientSlice';
import { fetchClients } from '../../client/clientThunk';
import { DateRange } from 'rsuite/DateRangePicker';
import { createBooking, getLocationsList, getOneLocation } from '../../locationsThunks';
import {
  selectCreateBookingError,
  selectCreateBookingLoading,
  selectLocationsFilter,
  selectLocationsListData,
  selectOneLocation,
  selectOneLocationLoading,
} from '../../locationsSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import dayjs from 'dayjs';
import { openSnackbar } from '../../../users/usersSlice';

interface Props {
  locationId: string;
  isPage?: boolean;
  closeModal: (close: boolean) => void;
}

const BookingForm: React.FC<Props> = ({ locationId, isPage, closeModal }) => {
  const [valueDate, setValueDate] = useState<[Date, Date]>([new Date(), new Date()]);
  const [valueClient, setValueClient] = useState('');
  const clientList = useAppSelector(selectClientsList);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGetAllClientsLoading);
  const error = useAppSelector(selectCreateBookingError);
  const oneLocation = useAppSelector(selectOneLocation);
  const loadingOneLocation = useAppSelector(selectOneLocationLoading);
  const createLoading = useAppSelector(selectCreateBookingLoading);
  const filter = useAppSelector(selectLocationsFilter);
  const locationsListData = useAppSelector(selectLocationsListData);
  const location = useLocation();

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
      clientId: valueClient,
      locationId,
      booking_date: {
        end: new Date(valueDate[1]),
        start: new Date(valueDate[0]),
      },
    };

    await dispatch(createBooking(obj)).unwrap();
    if (location.pathname === `/${locationId}`) {
      await dispatch(getOneLocation(locationId)).unwrap();
    } else {
      await dispatch(
        getLocationsList({
          page: locationsListData.page,
          perPage: locationsListData.perPage,
          filtered: filter.filtered,
        }),
      );
    }
    dispatch(openSnackbar({ status: true, parameter: 'create_booking' }));
    setValueClient('');
    setValueDate([new Date(), new Date()]);
    closeModal(true);
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Добавление бронирования
      </Typography>
      <Grid direction="column" spacing={2} container component="form" onSubmit={onSubmit}>
        <Grid item>{error && <Alert severity="error">{error.message}</Alert>}</Grid>
        <Grid item>
          {!loadingOneLocation ? (
            oneLocation && oneLocation.booking.length !== 0 ? (
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
              ))
            ) : (
              <Alert severity="info" color="success">
                Броней нет
              </Alert>
            )
          ) : (
            <CircularProgress />
          )}
        </Grid>
        <Grid item>
          <TextField
            value={valueClient}
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
                    {item.companyName}
                  </MenuItem>
                ))
              ) : (
                <Alert severity="info">Список пуст</Alert>
              )
            ) : (
              <CircularProgress />
            )}
          </TextField>
          <Link to="/create_client" style={{ display: 'block', textAlign: 'center', margin: '10px 0', color: 'green' }}>
            Нет клиента в списке? Создать клиента
          </Link>
        </Grid>
        <Grid item>
          <DateRangePicker
            block
            placeholder="Выбрать даты"
            placement="topStart"
            value={valueDate}
            onChange={handleDateChange}
            style={{ zIndex: '1 important!' }}
          />
        </Grid>
        <Grid item alignSelf="center">
          <Button disabled={createLoading} type="submit" color="success" variant="contained">
            {!createLoading ? 'Бронировать' : <CircularProgress />}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;
