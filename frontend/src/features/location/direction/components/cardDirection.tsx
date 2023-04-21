import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CardDirection = () => {
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">Test</TableCell>
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
