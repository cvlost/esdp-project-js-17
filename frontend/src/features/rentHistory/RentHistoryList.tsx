import React, { useEffect, useState } from 'react';
import {
  Alert,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
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
import { apiURL, StyledTableCell, StyledTableRow } from '../../constants';
import { openSnackbar } from '../users/usersSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalBody from '../../components/ModalBody';

const RentHistoryList = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectFetchLoadingRentHistories);
  const { confirm } = useConfirm();
  const loadingRemove = useAppSelector(selectDeleteRentHistoryLoading);
  const rentHistories = useAppSelector(selectRentHistories);
  const { id } = useParams() as { id: string };
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchRentHistories(id));
  }, [dispatch, id]);

  const removeRentHistory = async (rentId: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную запись аренды?')) {
      await dispatch(deleteRentHistory(rentId)).unwrap();
      await dispatch(fetchRentHistories(id));
      dispatch(openSnackbar({ status: true, parameter: 'delete_rentHistory' }));
    } else {
      return;
    }
  };

  return (
    <>
      <Typography component="h1" variant="h4" sx={{ my: 3, textAlign: 'center' }}>
        История аренды
      </Typography>
      <TableContainer>
        {rentHistories && rentHistories.length !== 0 ? (
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Фото локации</StyledTableCell>
                <StyledTableCell align="center">Локация</StyledTableCell>
                <StyledTableCell align="center">Клиент</StyledTableCell>
                <StyledTableCell align="center">Старт даты:</StyledTableCell>
                <StyledTableCell align="center">Конец даты:</StyledTableCell>
                <StyledTableCell align="center">Цена за аренду</StyledTableCell>
                <StyledTableCell align="center">Счет за аренду</StyledTableCell>
                <StyledTableCell align="center">Управление</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                rentHistories.map((item) => (
                  <StyledTableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">
                      <img
                        onClick={openImageModal}
                        width="180px"
                        src={apiURL + '/' + item.location.dayImage}
                        alt={item.location._id}
                      />
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
                          disabled={loadingRemove ? loadingRemove === item._id : false}
                          onClick={() => removeRentHistory(item._id)}
                          aria-label="delete"
                        >
                          {loadingRemove && loadingRemove === item._id && <CircularProgress color="success" />}
                          <DeleteIcon />
                        </IconButton>
                        <Link to={`/${item.location._id}`} style={{ textDecoration: 'none' }}>
                          <IconButton aria-label="show">
                            <LaunchIcon />
                          </IconButton>
                        </Link>
                      </ButtonGroup>
                    </TableCell>
                    <ModalBody isOpen={isImageModalOpen} onClose={closeImageModal}>
                      <img
                        src={apiURL + '/' + item.location.dayImage}
                        alt={item.location._id}
                        style={{ width: '100%' }}
                      />
                    </ModalBody>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress color="success" />
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Alert severity="info">История аренды по данной локации отсутствует</Alert>
        )}
      </TableContainer>
    </>
  );
};

export default RentHistoryList;
