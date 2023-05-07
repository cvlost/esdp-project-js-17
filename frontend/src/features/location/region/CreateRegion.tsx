import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { RegionMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createRegion, fetchRegions, removeRegion } from './regionThunk';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import {
  controlModal,
  selectErrorRemove,
  selectGetAllRegionLoading,
  selectModal,
  selectRegionList,
} from './regionSlice';
import { StyledTableCell } from '../../../constants';
import CardRegion from './components/CardRegion';
import FormCreateRegion from './components/FormCreateRegion';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';

const CreateRegion = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListRegions = useAppSelector(selectRegionList);
  const fetchLoading = useAppSelector(selectGetAllRegionLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const onSubmit = async (region: RegionMutation) => {
    await dispatch(createRegion(region)).unwrap();
    await dispatch(fetchRegions()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_region' }));
  };

  const removeCardRegion = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данный район ?')) {
      await dispatch(removeRegion(id)).unwrap();
      await dispatch(fetchRegions()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_region' }));
    } else {
      return;
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Box>
        <Container component="main" maxWidth="xs">
          <FormCreateRegion onSubmit={onSubmit} />
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
                    <StyledTableCell align="left">Район</StyledTableCell>
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
