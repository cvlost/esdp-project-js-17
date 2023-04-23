import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { StreetList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { StyledTableRow } from '../../../../constants';
import { selectRemoveStreetLoading } from '../streetSlice';

interface Props {
  street: StreetList;
  removeCardStreet: React.MouseEventHandler;
}

const CardStreet: React.FC<Props> = ({ street, removeCardStreet }) => {
  const removeLoading = useAppSelector(selectRemoveStreetLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{street.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardStreet} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardStreet;
