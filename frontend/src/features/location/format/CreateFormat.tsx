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
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import {
  controlModal,
  selectCreateFormatLoading,
  selectErrorRemove,
  selectFormatError,
  selectFormatList,
  selectGetAllFormatLoading,
  selectModal,
  selectOneFormat,
  selectUpdateFormatLoading,
} from './formatSlice';
import CardFormat from './components/CardFormat';
import { createFormat, fetchFormat, fetchOneFormat, removeFormat, updateFormat } from './formatThunk';
import { FormatMutation } from '../../../types';
import FormCreateFormat from './components/FormCreateFormat';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import ModalBody from '../../../components/ModalBody';

const CreateFormat = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const formats = useAppSelector(selectFormatList);
  const formatsLoading = useAppSelector(selectGetAllFormatLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Id, setId] = useState('');
  const existingFormat = useAppSelector(selectOneFormat);
  const updateLoading = useAppSelector(selectUpdateFormatLoading);
  const createLoading = useAppSelector(selectCreateFormatLoading);
  const error = useAppSelector(selectFormatError);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchFormat());
    }
  }, [dispatch, user?.role]);

  const deleteFormat = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данный формат?')) {
      await dispatch(removeFormat(id)).unwrap();
      await dispatch(fetchFormat());
      dispatch(openSnackbar({ status: true, parameter: 'remove_format' }));
    }
  };

  const onFormSubmit = async (FormatToChange: FormatMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateFormat({ id: Id, area: FormatToChange })).unwrap();
        await dispatch(fetchFormat()).unwrap();
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
    await dispatch(fetchOneFormat(ID));
    setId(ID);
    setIsDialogOpen(true);
  };

  const onSubmit = async (format: FormatMutation) => {
    await dispatch(createFormat(format)).unwrap();
    await dispatch(fetchFormat());
    dispatch(openSnackbar({ status: true, parameter: 'create_format' }));
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <FormCreateFormat onSubmit={onSubmit} Loading={createLoading} error={error} />
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
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Формат</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!formatsLoading ? (
                  formats.length !== 0 ? (
                    formats.map((format) => (
                      <CardFormat
                        key={format._id}
                        format={format}
                        removeFormat={() => deleteFormat(format._id)}
                        onEditing={() => openDialog(format._id)}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Alert severity="info">В данный момент форматов нет</Alert>
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
      {existingFormat && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FormCreateFormat
            error={error}
            onSubmit={onFormSubmit}
            existingFormat={existingFormat}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
      <SnackbarCard />
    </Box>
  );
};

export default CreateFormat;
