import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DirectionList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectDirectionDeleteLoading } from '../directionsSlice';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  direction: DirectionList;
  removeCardDirection: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardDirection: React.FC<Props> = ({ direction, removeCardDirection, onEditing }) => {
  const removeLoading = useAppSelector(selectDirectionDeleteLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{direction.name}</TableCell>
        <TableCell align="right">
          <IconButton
            disabled={removeLoading ? removeLoading === direction._id : false}
            onClick={removeCardDirection}
            aria-label="delete"
          >
            {removeLoading && removeLoading === direction._id && <CircularProgress />}
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="success" onClick={onEditing}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardDirection;
