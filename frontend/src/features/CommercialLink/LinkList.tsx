import React, { useEffect, useState } from 'react';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import { MainColorGreen, StyledTableCell, StyledTableRow } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectListLink, selectLoadingListLink, setCurrentPage } from './commercialLinkSlice';
import { fetchLinkList, removeLink } from './CommercialLinkThunk';
import CardLink from './components/CardLink';
import ModalBody from '../../components/ModalBody';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import { openSnackbar } from '../users/usersSlice';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';

const LinkList = () => {
  const [id, setId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const linkList = useAppSelector(selectListLink);
  const loading = useAppSelector(selectLoadingListLink);
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchLinkList({ page: linkList.page, perPage: linkList.perPage }));
  }, [dispatch, linkList.page, linkList.perPage]);

  const openModalLink = (id: string) => {
    setOpenModal(true);
    setId(id);
  };

  const removeLinkOne = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную локацию?')) {
      await dispatch(removeLink(id)).unwrap();
      await dispatch(fetchLinkList({ page: linkList.page, perPage: linkList.perPage })).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_link' }));
    } else {
      return;
    }
  };

  const description = linkList.listLink.find((item) => item._id === id);

  return (
    <Box sx={{ mt: 2 }}>
      <Chip
        sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 2 }}
        label="Список ссылок:"
        variant="outlined"
        color="success"
      />
      <Paper elevation={3} sx={{ width: '100%', height: '80vh', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Ссылка</StyledTableCell>
                <StyledTableCell align="left">Название компании</StyledTableCell>
                <StyledTableCell align="left">Информация о компании</StyledTableCell>
                <StyledTableCell align="right">Управление</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                linkList.listLink.length !== 0 ? (
                  linkList.listLink.map((link) => (
                    <CardLink
                      key={link._id}
                      link={link}
                      openModalLink={() => openModalLink(link._id)}
                      removeLinkOne={() => removeLinkOne(link._id)}
                    />
                  ))
                ) : (
                  <StyledTableRow>
                    <TableCell>
                      <Alert severity="info">Список пуст</Alert>
                    </TableCell>
                  </StyledTableRow>
                )
              ) : (
                <StyledTableRow>
                  <TableCell>
                    <CircularProgress />
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Pagination
        size="small"
        sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
        disabled={loading}
        count={linkList.pages}
        page={linkList.page}
        onChange={(event, page) => dispatch(setCurrentPage(page))}
      />

      <ModalBody isOpen={openModal} onClose={() => setOpenModal(false)}>
        {description ? description.description : 'Информации нет'}
      </ModalBody>
      <SnackbarCard />
    </Box>
  );
};

export default LinkList;
