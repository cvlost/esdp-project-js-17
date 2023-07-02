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
import { MainColorGreen } from '../../../constants';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import CardLighting from './components/cardLighting';
import FormCreateLighting from './components/FormCreateLighting';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  controlModal,
  selectLightings,
  selectLightingsLoading,
  selectErrorRemove,
  selectModal,
  selectOneLight,
  selectUpdateLightLoading,
  selectLightingError,
  selectLightingCreateLoading,
} from './lightingsSlice';
import { createLighting, deleteLighting, fetchOneLight, getLightingsList, updateLight } from './lightingsThunks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { LightingMutation } from '../../../types';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import ModalBody from '../../../components/ModalBody';

const CreateLighting = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListLighting = useAppSelector(selectLightings);
  const fetchLoading = useAppSelector(selectLightingsLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Id, setId] = useState('');
  const existingLight = useAppSelector(selectOneLight);
  const updateLoading = useAppSelector(selectUpdateLightLoading);
  const createLoading = useAppSelector(selectLightingCreateLoading);
  const error = useAppSelector(selectLightingError);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(getLightingsList());
  }, [dispatch]);

  const onSubmit = async (lighting: LightingMutation) => {
    await dispatch(createLighting(lighting)).unwrap();
    await dispatch(getLightingsList()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_lighting' }));
  };

  const removeCardLighting = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данное освещение?')) {
      await dispatch(deleteLighting(id)).unwrap();
      await dispatch(getLightingsList()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_lighting' }));
    } else {
      return;
    }
  };

  const onFormSubmit = async (LightToChange: LightingMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateLight({ id: Id, name: LightToChange })).unwrap();
        await dispatch(getLightingsList()).unwrap();
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
    await dispatch(fetchOneLight(ID));
    setId(ID);
    setIsDialogOpen(true);
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateLighting onSubmit={onSubmit} error={error} Loading={createLoading} />
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
                  <StyledTableCell align="left">Направление</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!fetchLoading ? (
                  fetchListLighting.length !== 0 ? (
                    fetchListLighting.map((light) => (
                      <CardLighting
                        key={light._id}
                        lighting={light}
                        removeCardLighting={() => removeCardLighting(light._id)}
                        onEditing={() => openDialog(light._id)}
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
                      <CircularProgress color="success" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      {existingLight && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FormCreateLighting
            error={error}
            onSubmit={onFormSubmit}
            existingLight={existingLight}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
      <SnackbarCard />
    </Box>
  );
};

export default CreateLighting;
