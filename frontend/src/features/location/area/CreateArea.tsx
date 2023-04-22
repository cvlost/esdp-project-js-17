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
import FormCreateArea from './components/FormCreateArea';
import CardArea from './components/CardArea';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAreaList, selectGetAllAreaLoading } from './areaSlice';
import { createArea, fetchAreas } from './areaThunk';
import { AreaMutation } from '../../../types';
import { openSnackbar } from '../../users/usersSlice';

const CreateArea = () => {
  const areas = useAppSelector(selectAreaList);
  const loadingGetAllAreas = useAppSelector(selectGetAllAreaLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);

  const onSubmit = async (area: AreaMutation) => {
    await dispatch(createArea(area)).unwrap();
    await dispatch(fetchAreas()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_area' }));
  };

  console.log(areas);

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateArea onSubmit={onSubmit} />
      </Container>
      <Container>
        <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Область</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loadingGetAllAreas ? (
                  areas.length !== 0 ? (
                    areas.map((area) => <CardArea key={area._id} area={area} />)
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

export default CreateArea;
