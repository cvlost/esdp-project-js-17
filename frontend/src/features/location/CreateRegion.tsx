import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
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
import FormCreateRegion from './components/FormCreateRegion';
import { RegionMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createRegion, fetchRegions, removeRegion } from './store_region/regionThunk';
import { openSnackbar } from '../users/usersSlice';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';
import { selectGetAllRegionLoading, selectRegionList } from './store_region/regionSlice';
import CardRegion from './components/CardRegion';

const CreateRegion = () => {
  const dispatch = useAppDispatch();
  const fetchListRegions = useAppSelector(selectRegionList);
  const fetchLoading = useAppSelector(selectGetAllRegionLoading);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const onSubmit = async (region: RegionMutation) => {
    await dispatch(createRegion(region)).unwrap();
    await dispatch(fetchRegions()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_region' }));
  };

  const removeCardRegion = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(removeRegion(id)).unwrap();
      await dispatch(fetchRegions()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_region' }));
    } else {
      return;
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#8f22ff',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  return (
    <>
      <Box>
        <Container component="main" maxWidth="xs">
          <FormCreateRegion onSubmit={onSubmit} />
        </Container>
        <Container>
          <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Регион</StyledTableCell>
                    <StyledTableCell align="right">Управление</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!fetchLoading ? (
                    fetchListRegions.length !== 0 ? (
                      fetchListRegions.map((region) => (
                        <CardRegion
                          removeCardRegion={() => removeCardRegion(region._id)}
                          key={region._id}
                          region={region}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>
                          <Alert severity="info">В данный момент районов нет</Alert>
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
      </Box>
      <SnackbarCard />
    </>
  );
};

export default CreateRegion;
