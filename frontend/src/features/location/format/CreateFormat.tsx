import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { StyledTableCell } from '../../../constants';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { selectFormatList, selectGetAllFormatLoading } from './formatSlice';
import CardFormat from './components/CardFormat';
import { createFormat, fetchFormat, removeFormat } from './formatThunk';
import { FormatMutation } from '../../../types';
import FormCreateFormat from './components/FormCreateFormat';
import { Navigate } from 'react-router-dom';

const CreateFormat = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const formats = useAppSelector(selectFormatList);
  const formatsLoading = useAppSelector(selectGetAllFormatLoading);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchFormat());
    }
  }, [dispatch, user?.role]);

  const deleteFormat = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(removeFormat(id)).unwrap();
      await dispatch(fetchFormat());
      dispatch(openSnackbar({ status: true, parameter: 'remove_format' }));
    }
  };

  const onSubmit = async (format: FormatMutation) => {
    await dispatch(createFormat(format)).unwrap();
    await dispatch(fetchFormat());
    dispatch(openSnackbar({ status: true, parameter: 'create_format' }));
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateFormat onSubmit={onSubmit} />
      </Container>
      <Container>
        <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Формат</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!formatsLoading ? (
                  formats.length !== 0 ? (
                    formats.map((format) => (
                      <CardFormat key={format._id} format={format} removeFormat={() => deleteFormat(format._id)} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Alert severity="info">В данный момент форматов нет</Alert>
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

export default CreateFormat;