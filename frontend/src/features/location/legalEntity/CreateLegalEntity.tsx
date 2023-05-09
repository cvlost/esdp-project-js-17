import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import {
  controlModal,
  selectErrorRemove,
  selectGetAllLegalEntityLoading,
  selectLegalEntityList,
  selectModal,
  selectOneLegalEntity,
  unsetOneLegalEntity,
} from './legalEntitySlice';
import { fetchLegalEntity } from './legalEntityThunk';
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
import { MainColorGreen, StyledTableCell } from '../../../constants';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import CardLegalEntity from './components/CardLegalEntity';
import FormLegalEntity from './components/FormLegalEntity';
import { Navigate } from 'react-router-dom';
import ModalBody from '../../../components/ModalBody';
import CloseIcon from '@mui/icons-material/Close';

const CreateLegalEntity = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const entities = useAppSelector(selectLegalEntityList);
  const entitiesLoading = useAppSelector(selectGetAllLegalEntityLoading);
  const oneEntity = useAppSelector(selectOneLegalEntity);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchLegalEntity());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    return () => {
      if (oneEntity) {
        dispatch(unsetOneLegalEntity());
      }
    };
  }, [dispatch, oneEntity]);

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormLegalEntity />
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
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Юридическое лицо</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!entitiesLoading ? (
                  entities.length !== 0 ? (
                    entities.map((entity) => <CardLegalEntity key={entity._id} {...entity} />)
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Alert severity="info">В данный момент юридических лиц нет</Alert>
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
      <ModalBody isOpen={!!oneEntity} onClose={() => dispatch(unsetOneLegalEntity())}>
        <FormLegalEntity isEdit />
      </ModalBody>
    </Box>
  );
};

export default CreateLegalEntity;
