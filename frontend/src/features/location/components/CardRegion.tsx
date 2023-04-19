import React from 'react';
import { IconButton, styled, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RegionList } from '../../../types';

interface Props {
  region: RegionList;
}

const CardRegion: React.FC<Props> = ({ region }) => {
  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  return (
    <>
      <StyledTableRow
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          '&:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <TableCell align="left">{region.name}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardRegion;
