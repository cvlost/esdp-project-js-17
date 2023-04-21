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
import { getDirectionsList } from './directionsThunks';

const CreateDirection = () => {
  const dispatch = useAppDispatch();
  const fetchListDirection = useAppSelector(selectDirections);
  const fetchLoading = useAppSelector(selectDirectionsLoading);

  useEffect(() => {
    dispatch(getDirectionsList());
  }, [dispatch]);

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateDirection />
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
                    fetchListDirection.map((direct) => <CardDirection key={direct._id} direction={direct} />)
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
