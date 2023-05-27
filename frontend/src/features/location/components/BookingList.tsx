import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectOneLocation, selectOneLocationLoading, selectRemoveBookingLoading } from '../locationsSlice';
import { getOneLocation, removeBooking } from '../locationsThunks';
import dayjs from 'dayjs';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';

interface Props {
  locationId: string;
}

const BookingList: React.FC<Props> = ({ locationId }) => {
  const dispatch = useAppDispatch();
  const oneLocation = useAppSelector(selectOneLocation);
  const loading = useAppSelector(selectOneLocationLoading);
  const { confirm } = useConfirm();
  const loadingRemove = useAppSelector(selectRemoveBookingLoading);

  useEffect(() => {
    dispatch(getOneLocation(locationId));
  }, [dispatch, locationId]);

  const removeCardBooking = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную локацию?')) {
      await dispatch(removeBooking({ idLoc: locationId, idBook: id })).unwrap();
      await dispatch(getOneLocation(locationId));
    } else {
      return;
    }
  };

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Статус</TableCell>
          <TableCell align="center">Клиент</TableCell>
          <TableCell align="center">Старт даты: </TableCell>
          <TableCell align="center">Конец даты: </TableCell>
          <TableCell align="center">Управление</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!loading ? (
          oneLocation && oneLocation.booking.length !== 0 ? (
            oneLocation.booking.map((booking) => (
              <TableRow key={booking._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Box
                    sx={{
                      background: booking.booking_date.end < booking.booking_date.start ? 'red' : 'green',
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                    }}
                  ></Box>
                </TableCell>
                <TableCell align="center">Клиент</TableCell>
                <TableCell align="center">{dayjs(booking.booking_date.start).format('DD.MM.YYYY')}</TableCell>
                <TableCell align="center">{dayjs(booking.booking_date.end).format('DD.MM.YYYY')}</TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <IconButton
                      disabled={loadingRemove}
                      onClick={() => removeCardBooking(booking._id)}
                      aria-label="delete"
                    >
                      {!loadingRemove ? <RemoveCircleIcon /> : <CircularProgress />}
                    </IconButton>
                    <Link to={`/${booking.locationId}`}>
                      <IconButton aria-label="delete">
                        <LaunchIcon />
                      </IconButton>
                    </Link>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Alert severity="info">Список броней пуст</Alert>
              </TableCell>
            </TableRow>
          )
        ) : (
          <TableRow>
            <TableCell>
              <CircularProgress />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default BookingList;
