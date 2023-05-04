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
import { StyledTableCell } from '../../../constants';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import FormCreateArea from './components/FormCreateArea';
import CardArea from './components/CardArea';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { controlModal, selectAreaList, selectErrorRemove, selectGetAllAreaLoading, selectModal } from './areaSlice';
import { createArea, fetchAreas, removeArea } from './areaThunk';
import { AreaMutation } from '../../../types';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';

const CreateArea = () => {
  const user = useAppSelector(selectUser);
  const areas = useAppSelector(selectAreaList);
  const loadingGetAllAreas = useAppSelector(selectGetAllAreaLoading);
  const dispatch = useAppDispatch();
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);

  const onSubmit = async (area: AreaMutation) => {
    await dispatch(createArea(area)).unwrap();
    await dispatch(fetchAreas()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_area' }));
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
        <FormCreateArea onSubmit={onSubmit} />
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
                      <CardArea removeAreaCard={() => removeAreaCard(area._id)} key={area._id} area={area} />
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

export default CreateArea;
