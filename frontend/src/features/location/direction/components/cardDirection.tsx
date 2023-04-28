import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DirectionList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectDirectionDeleteLoading } from '../directionsSlice';

interface Props {
  direction: DirectionList;
  removeCardDirection: React.MouseEventHandler;
}

const CardDirection: React.FC<Props> = ({ direction, removeCardDirection }) => {
  const removeLoading = useAppSelector(selectDirectionDeleteLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{direction.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardDirection} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardDirection;
