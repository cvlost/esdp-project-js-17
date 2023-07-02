import React, { useEffect, useState } from 'react';
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
import { RegionMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createRegion, fetchOneRegion, fetchRegions, removeRegion, updateRegion } from './regionThunk';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';

import { MainColorGreen } from '../../../constants';
import CardRegion from './components/CardRegion';
import FormCreateRegion from './components/FormCreateRegion';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import ModalBody from '../../../components/ModalBody';
import {
  controlModal,
  selectCreateRegionLoading,
  selectErrorRemove,
  selectGetAllRegionLoading,
  selectModal,
  selectOneRegion,
  selectRegionError,
  selectRegionList,
  selectUpdateRegionLoading,
} from './regionSlice';

const CreateRegion = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListRegions = useAppSelector(selectRegionList);
  const fetchLoading = useAppSelector(selectGetAllRegionLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Id, setId] = useState('');
  const existingRegion = useAppSelector(selectOneRegion);
  const updateLoading = useAppSelector(selectUpdateRegionLoading);
  const createLoading = useAppSelector(selectCreateRegionLoading);
  const error = useAppSelector(selectRegionError);
  const { confirm } = useConfirm();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

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

  const onFormSubmit = async (ToChange: RegionMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateRegion({ id: Id, name: ToChange })).unwrap();
        await dispatch(fetchRegions()).unwrap();
        dispatch(openSnackbar({ status: true, parameter: 'Main_Edit' }));
        setIsDialogOpen(false);
      } catch (error) {
        throw new Error(`Произошла ошибка: ${error}`);
      }
    } else {
      return;
    }
  };

  const openDialog = async (ID: string) => {
    await dispatch(fetchOneRegion(ID));
    setId(ID);
    setIsDialogOpen(true);
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Box>
        <Container component="main" maxWidth="xs">
          <FormCreateRegion onSubmit={onSubmit} Loading={createLoading} error={error} />
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
              <Table sx={{ minWidth: 200 }} aria-label="simple table">
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
                          onEditing={() => openDialog(region._id)}
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
                        <CircularProgress color="success" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      {existingRegion && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FormCreateRegion
            error={error}
            onSubmit={onFormSubmit}
            existingRegion={existingRegion}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
      <SnackbarCard />
    </>
  );
};

export default CreateRegion;
