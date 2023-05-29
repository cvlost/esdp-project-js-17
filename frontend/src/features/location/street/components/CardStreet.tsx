import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { StreetList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { StyledTableRow } from '../../../../constants';
import { selectRemoveStreetLoading } from '../streetSlice';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  street: StreetList;
  removeCardStreet: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardStreet: React.FC<Props> = ({ street, removeCardStreet, onEditing }) => {
  const removeLoading = useAppSelector(selectRemoveStreetLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{street.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardStreet} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
          <IconButton aria-label="success" onClick={onEditing}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardStreet;
