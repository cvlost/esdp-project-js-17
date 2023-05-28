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
import CardDirection from './components/cardDirection';
import FormCreateDirection from './components/FormCreateDirection';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  controlModal,
  selectDirectionCreateLoading,
  selectDirectionError,
  selectDirections,
  selectDirectionsLoading,
  selectErrorRemove,
  selectModal,
  selectOneDirection,
  selectUpdateDirLoading,
} from './directionsSlice';
import { createDirection, deleteDirection, fetchOneDir, getDirectionsList, updateDir } from './directionsThunks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { DirectionMutation } from '../../../types';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import ModalBody from '../../../components/ModalBody';

const CreateDirection = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListDirection = useAppSelector(selectDirections);
  const fetchLoading = useAppSelector(selectDirectionsLoading);
  const existingDir = useAppSelector(selectOneDirection);
  const updateLoading = useAppSelector(selectUpdateDirLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const createLoading = useAppSelector(selectDirectionCreateLoading);
  const error = useAppSelector(selectDirectionError);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dirId, setDirId] = useState('');
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(getDirectionsList());
  }, [dispatch]);

  const onSubmit = async (direction: DirectionMutation) => {
    await dispatch(createDirection(direction)).unwrap();
    await dispatch(getDirectionsList()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_direction' }));
  };

  const onFormSubmit = async (DirToChange: DirectionMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateDir({ id: dirId, area: DirToChange })).unwrap();
        await dispatch(getDirectionsList()).unwrap();
        dispatch(openSnackbar({ status: true, parameter: 'edit' }));
        setIsDialogOpen(false);
      } catch (error) {
        throw new Error(`Произошла ошибка: ${error}`);
      }
    } else {
      return;
    }
  };

  const openDialog = async (DirID: string) => {
    await dispatch(fetchOneDir(DirID));
    setDirId(DirID);
    setIsDialogOpen(true);
  };

  const removeCardDirection = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данное направление?')) {
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
        <FormCreateDirection onSubmit={onSubmit} error={error} Loading={createLoading} />
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
                        onEditing={() => openDialog(direct._id)}
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
      {existingDir && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FormCreateDirection
            error={error}
            onSubmit={onFormSubmit}
            existingDir={existingDir}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
      <SnackbarCard />
    </Box>
  );
};

export default CreateDirection;
