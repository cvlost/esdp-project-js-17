import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import { selectGetAllLegalEntityLoading, selectLegalEntityList } from './legalEntitySlice';
import { fetchLegalEntity, removeLegalEntity } from './legalEntityThunk';
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

const CreateLegalEntity = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const entities = useAppSelector(selectLegalEntityList);
  const entitiesLoading = useAppSelector(selectGetAllLegalEntityLoading);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchLegalEntity());
    }
  }, [dispatch, user?.role]);

  const deleteEntity = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(removeLegalEntity(id)).unwrap();
      await dispatch(fetchLegalEntity());
      dispatch(openSnackbar({ status: true, parameter: 'remove_legal_entity' }));
    }
  };

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        form here
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
                    entities.map((entity) => (
                      <CardLegalEntity key={entity._id} entity={entity} removeEntity={() => deleteEntity(entity._id)} />
                    ))
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
    </Box>
  );
};

export default CreateLegalEntity;
