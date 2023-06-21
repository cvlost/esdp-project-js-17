import React, { useEffect } from 'react';
import {
  Alert,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Link, useParams } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import dayjs from 'dayjs';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import {
  selectDeleteRentHistoryLoading,
  selectFetchLoadingRentHistories,
  selectRentHistories,
} from './rentHistorySlice';
import { deleteRentHistory, fetchRentHistories } from './rentHistoryThunk';
import { apiURL } from '../../constants';
import { openSnackbar } from '../users/usersSlice';

const RentHistoryList = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectFetchLoadingRentHistories);
  const { confirm } = useConfirm();
  const loadingRemove = useAppSelector(selectDeleteRentHistoryLoading);
  const rentHistories = useAppSelector(selectRentHistories);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    dispatch(fetchRentHistories(id));
  }, [dispatch, id]);

  const removeRentHistory = async (rentId: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную запись аренды?')) {
      await dispatch(deleteRentHistory(rentId)).unwrap();
      dispatch(fetchRentHistories(id));
      dispatch(openSnackbar({ status: true, parameter: 'delete_rentHistory' }));
    } else {
      return;
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ my: 2, textAlign: 'center' }}>
        История аренды
      </Typography>
      {rentHistories && rentHistories.length !== 0 ? (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Фото локации</TableCell>
              <TableCell align="center">Локация</TableCell>
              <TableCell align="center">Клиент</TableCell>
              <TableCell align="center">Старт даты:</TableCell>
              <TableCell align="center">Конец даты:</TableCell>
              <TableCell align="center">Цена за аренду</TableCell>
              <TableCell align="center">Счет за аренду</TableCell>
              <TableCell align="center">Управление</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rentHistories.map((item) => (
                <TableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    <img width="150px" src={apiURL + '/' + item.location.dayImage} alt={item.location._id} />
                  </TableCell>
                  <TableCell align="center">
                    {`${item.location.city} ${item.location.streets[0] + '/' + item.location.streets[1]}, ${
                      item.location.direction
                    }`}
                  </TableCell>
                  <TableCell align="center">{item.client.companyName}</TableCell>
                  <TableCell align="center">{dayjs(item.rent_date.start).format('DD.MM.YYYY')}</TableCell>
                  <TableCell align="center">{dayjs(item.rent_date.end).format('DD.MM.YYYY')}</TableCell>
                  <TableCell align="center">{item.rent_price} сом</TableCell>
                  <TableCell align="center">{item.rent_cost} сом</TableCell>
                  <TableCell align="center">
                    <ButtonGroup variant="contained" aria-label="outlined success button group">
                      <IconButton
                        disabled={loadingRemove}
                        onClick={() => removeRentHistory(item._id)}
                        aria-label="delete"
                      >
                        {!loadingRemove ? <RemoveCircleIcon /> : <CircularProgress size="small" color="success" />}
                      </IconButton>
                      <Link to={`/${item.location._id}`} style={{ textDecoration: 'none' }}>
                        <IconButton aria-label="show">
                          <LaunchIcon />
                        </IconButton>
                      </Link>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <Alert severity="info">История аренды по данной локации отсутствует</Alert>
      )}
    </>
  );
};

export default RentHistoryList;
