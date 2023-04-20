import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RegionList } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectRemoveRegionLoading } from '../store_region/regionSlice';
import { StyledTableRow } from '../../../constants';

interface Props {
  region: RegionList;
  removeCardRegion: React.MouseEventHandler;
}

const CardRegion: React.FC<Props> = ({ region, removeCardRegion }) => {
  const removeLoading = useAppSelector(selectRemoveRegionLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
