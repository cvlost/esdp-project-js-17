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
import { Link, useLocation } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectLocationsFilter,
  selectLocationsListData,
  selectOneLocation,
  selectOneLocationLoading,
  selectRemoveBookingLoading,
} from '../locationsSlice';
import { getLocationsList, getOneLocation, removeBooking } from '../locationsThunks';
import dayjs from 'dayjs';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  locationId: string;
  isPage?: boolean;
}

const BookingList: React.FC<Props> = ({ locationId, isPage }) => {
  const dispatch = useAppDispatch();
  const oneLocation = useAppSelector(selectOneLocation);
  const loading = useAppSelector(selectOneLocationLoading);
  const { confirm } = useConfirm();
  const loadingRemove = useAppSelector(selectRemoveBookingLoading);
  const filter = useAppSelector(selectLocationsFilter);
  const locationsListData = useAppSelector(selectLocationsListData);
  const location = useLocation();

  useEffect(() => {
    if (isPage === undefined) {
      dispatch(getOneLocation(locationId));
    }
  }, [dispatch, locationId, isPage]);

  const removeCardBooking = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную локацию?')) {
      await dispatch(removeBooking({ idLoc: locationId, idBook: id })).unwrap();
      if (location.pathname === `/${locationId}`) {
        await dispatch(getOneLocation(locationId));
      } else {
        await dispatch(getOneLocation(locationId));
        await dispatch(
          getLocationsList({
            page: locationsListData.page,
            perPage: locationsListData.perPage,
            filtered: filter.filtered,
          }),
        );
      }
    } else {
      return;
    }
  };

  return (
    <Table aria-label="simple table">
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
                <TableCell align="center">{booking.clientId}</TableCell>
                <TableCell align="center">{dayjs(booking.booking_date.start).format('DD.MM.YYYY')}</TableCell>
                <TableCell align="center">{dayjs(booking.booking_date.end).format('DD.MM.YYYY')}</TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <IconButton
                      disabled={loadingRemove ? loadingRemove === booking._id : false}
                      onClick={() => removeCardBooking(booking._id)}
                      aria-label="delete"
                    >
                      {loadingRemove && loadingRemove === booking._id && <CircularProgress color="success" />}
                      <DeleteIcon />
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
              <CircularProgress color="success" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default BookingList;
