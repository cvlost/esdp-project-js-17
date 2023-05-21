import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
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
import { ClientMutation } from '../../../types';
import { createClient, fetchClients, removeClient } from './clientThunk';
import { selectClientsList, selectErrorRemove, selectGetAllClientsLoading, selectModal } from './clientSlice';
import { controlModal } from '../area/areaSlice';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import FormCreateClient from './components/FormCreateClient';
import CardClient from './components/CardClient';
import { openSnackbar } from '../../users/usersSlice';

const CreateClient = () => {
  const clients = useAppSelector(selectClientsList);
  const loadingGetAllClients = useAppSelector(selectGetAllClientsLoading);
  const dispatch = useAppDispatch();
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const onSubmit = async (client: ClientMutation) => {
    await dispatch(createClient(client)).unwrap();
    await dispatch(fetchClients()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_client' }));
  };

  const removeClientCard = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данного клиента?')) {
      await dispatch(removeClient(id)).unwrap();
      await dispatch(fetchClients()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_client' }));
    } else {
      return;
    }
  };

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateClient onSubmit={onSubmit} />
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
                  <StyledTableCell align="left">Клиент</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loadingGetAllClients ? (
                  clients.length !== 0 ? (
                    clients.map((client) => (
                      <CardClient
                        removeClientCard={() => removeClientCard(client._id)}
                        key={client._id}
                        client={client}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Alert severity="info">В данный момент клиентов нет</Alert>
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

export default CreateClient;
