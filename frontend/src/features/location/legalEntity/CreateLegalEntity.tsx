import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import {
  selectGetAllLegalEntityLoading,
  selectLegalEntityList,
  selectOneLegalEntity,
  unsetOneLegalEntity,
} from './legalEntitySlice';
import { fetchLegalEntity } from './legalEntityThunk';
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
import CardLegalEntity from './components/CardLegalEntity';
import FormLegalEntity from './components/FormLegalEntity';
import { Navigate } from 'react-router-dom';
import ModalBody from '../../../components/ModalBody';

const CreateLegalEntity = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const entities = useAppSelector(selectLegalEntityList);
  const entitiesLoading = useAppSelector(selectGetAllLegalEntityLoading);
  const oneEntity = useAppSelector(selectOneLegalEntity);

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
