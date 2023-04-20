import React from 'react';
import { CircularProgress, IconButton, styled, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RegionList } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectRemoveRegionLoading } from '../store_region/regionSlice';

interface Props {
  region: RegionList;
  removeCardRegion: React.MouseEventHandler;
}

const CardRegion: React.FC<Props> = ({ region, removeCardRegion }) => {
  const removeLoading = useAppSelector(selectRemoveRegionLoading);
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
          <IconButton disabled={removeLoading} onClick={removeCardRegion} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardRegion;
