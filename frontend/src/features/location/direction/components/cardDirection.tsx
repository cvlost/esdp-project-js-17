import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DirectionType } from '../../../../types';

interface Props {
  direction: DirectionType;
}

const CardDirection: React.FC<Props> = ({ direction }) => {
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{direction.name}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardDirection;
