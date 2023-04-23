import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { StyledTableRow } from '../../../../constants';
import { LegalEntityList } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectOneLegalEntityLoading, selectRemoveLegalEntityLoading } from '../legalEntitySlice';
import { openSnackbar, selectEditOneUserLoading } from '../../../users/usersSlice';
import { fetchLegalEntity, fetchOneLegalEntity, removeLegalEntity } from '../legalEntityThunk';

const CardLegalEntity: React.FC<LegalEntityList> = ({ name, _id }) => {
  const dispatch = useAppDispatch();
  const removeLoading = useAppSelector(selectRemoveLegalEntityLoading);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const oneEntityLoading = useAppSelector(selectOneLegalEntityLoading);
  const anyLoading = removeLoading || editLoading;

  const removeEntity = async () => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(removeLegalEntity(_id)).unwrap();
      await dispatch(fetchLegalEntity());
      dispatch(openSnackbar({ status: true, parameter: 'remove_legal_entity' }));
    }
  };

  const editEntity = async () => {
    await dispatch(fetchOneLegalEntity(_id));
  };

  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">{name}</TableCell>
      <TableCell align="right">
        <IconButton disabled={anyLoading} onClick={removeEntity}>
          {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
        </IconButton>
        <IconButton disabled={anyLoading} onClick={editEntity}>
          {!editLoading && !oneEntityLoading ? <EditIcon /> : <CircularProgress />}
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLegalEntity;
