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
import CardDirection from './components/cardDirection';
import FormCreateDirection from './components/FormCreateDirection';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectDirections, selectDirectionsLoading } from './directionsSlice';
import { createDirection, deleteDirection, getDirectionsList } from './directionsThunks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { DirectionTypeMutation } from '../../../types';
import { Navigate } from 'react-router-dom';

const CreateDirection = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListDirection = useAppSelector(selectDirections);
  const fetchLoading = useAppSelector(selectDirectionsLoading);

  useEffect(() => {
    dispatch(getDirectionsList());
  }, [dispatch]);

  const onSubmit = async (direction: DirectionTypeMutation) => {
    await dispatch(createDirection(direction)).unwrap();
    await dispatch(getDirectionsList()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_direction' }));
  };

  const removeCardDirection = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(deleteDirection(id)).unwrap();
      await dispatch(getDirectionsList()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_direction' }));
    } else {
      return;
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateDirection onSubmit={onSubmit} />
      </Container>
      <Container>
        <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Направление</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!fetchLoading ? (
                  fetchListDirection.length !== 0 ? (
                    fetchListDirection.map((direct) => (
                      <CardDirection
                        key={direct._id}
                        direction={direct}
                        removeCardDirection={() => removeCardDirection(direct._id)}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Alert severity="info">В данный момент направлений нет</Alert>
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

export default CreateDirection;