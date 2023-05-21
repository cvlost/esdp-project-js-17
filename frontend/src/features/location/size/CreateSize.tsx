import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { MainColorGreen } from '../../../constants';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import CardSize from './components/cardSize';
import FormCreateSize from './components/FormCreateSize';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { controlModal, selectSizes, selectSizesLoading, selectErrorRemove, selectModal } from './sizeSlice';
import { createSize, deleteSize, getSizesList } from './sizeThunks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { SizeMutation } from '../../../types';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';

const CreateSize = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListSize = useAppSelector(selectSizes);
  const fetchLoading = useAppSelector(selectSizesLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(getSizesList());
  }, [dispatch]);

  const onSubmit = async (Size: SizeMutation) => {
    await dispatch(createSize(Size)).unwrap();
    await dispatch(getSizesList()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_size' }));
  };

  const removeCardSize = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную сущность?')) {
      await dispatch(deleteSize(id)).unwrap();
      await dispatch(getSizesList()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_size' }));
    } else {
      return;
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Container component="main" maxWidth="xs">
        <FormCreateSize onSubmit={onSubmit} />
      </Container>
      <Container>
        {open && (
          <Collapse in={open}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(controlModal(false));
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
              severity="error"
            >
              {errorRemove?.error}
            </Alert>
          </Collapse>
        )}
        <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Размер</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!fetchLoading ? (
                  fetchListSize.length !== 0 ? (
                    fetchListSize.map((size) => (
                      <CardSize key={size._id} size={size} removeCardSize={() => removeCardSize(size._id)} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Alert severity="info">В данный момент размеры отсутствуют</Alert>
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
          </TableContainer>
        </Paper>
      </Container>
      <SnackbarCard />
    </Box>
  );
};

export default CreateSize;
