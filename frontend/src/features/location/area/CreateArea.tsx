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
import FormCreateArea from './components/FormCreateArea';
import CardArea from './components/CardArea';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  controlModal,
  selectAreaError,
  selectAreaList,
  selectCreateAreaLoading,
  selectErrorRemove,
  selectGetAllAreaLoading,
  selectModal,
  selectOneArea,
  selectUpdateAreaLoading,
} from './areaSlice';
import { createArea, fetchAreas, fetchOneArea, removeArea, updateArea } from './areaThunk';
import { AreaMutation } from '../../../types';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import ModalBody from '../../../components/ModalBody';

const CreateArea = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const areas = useAppSelector(selectAreaList);
  const loadingGetAllAreas = useAppSelector(selectGetAllAreaLoading);
  const error = useAppSelector(selectAreaError);
  const createLoading = useAppSelector(selectCreateAreaLoading);
  const existingArea = useAppSelector(selectOneArea);
  const updateLoading = useAppSelector(selectUpdateAreaLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [AreaId, setAreaId] = useState('');
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);

  const onSubmit = async (area: AreaMutation) => {
    await dispatch(createArea(area)).unwrap();
    await dispatch(fetchAreas()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_area' }));
  };

  const onFormSubmit = async (AreaToChange: AreaMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateArea({ id: AreaId, area: AreaToChange })).unwrap();
        await dispatch(fetchAreas()).unwrap();
        dispatch(openSnackbar({ status: true, parameter: 'Main_Edit' }));
        setIsDialogOpen(false);
      } catch (error) {
        throw new Error(`Произошла ошибка: ${error}`);
      }
    } else {
      return;
    }
  };

  const openDialog = async (AreaID: string) => {
    await dispatch(fetchOneArea(AreaID));
    setAreaId(AreaID);
    setIsDialogOpen(true);
  };

  const removeAreaCard = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить даунную область?')) {
      await dispatch(removeArea(id)).unwrap();
      await dispatch(fetchAreas()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_area' }));
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
        <FormCreateArea onSubmit={onSubmit} Loading={createLoading} error={error} />
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
                  <StyledTableCell align="left">Область</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loadingGetAllAreas ? (
                  areas.length !== 0 ? (
                    areas.map((area) => (
                      <CardArea
                        removeAreaCard={() => removeAreaCard(area._id)}
                        key={area._id}
                        area={area}
                        onEditing={() => openDialog(area._id)}
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
      {existingArea && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FormCreateArea
            error={error}
            onSubmit={onFormSubmit}
            existingArea={existingArea}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
      <SnackbarCard />
    </Box>
  );
};

export default CreateArea;
