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
import { openSnackbar } from '../../users/usersSlice';
import { selectFormatList, selectGetAllFormatLoading } from './formatSlice';
import CardFormat from './components/CardFormat';
import { fetchFormat, removeFormat } from './formatThunk';

const CreateFormat = () => {
  const dispatch = useAppDispatch();
  const formats = useAppSelector(selectFormatList);
  const formatsLoading = useAppSelector(selectGetAllFormatLoading);

  useEffect(() => {
    dispatch(fetchFormat());
  }, [dispatch]);

  const deleteFormat = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(removeFormat(id)).unwrap();
      await dispatch(fetchFormat());
      dispatch(openSnackbar({ status: true, parameter: 'remove_format' }));
    }
  };

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <div>creation form here</div>
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
