import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RegionList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveRegionLoading } from '../regionSlice';
import { StyledTableRow } from '../../../../constants';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  region: RegionList;
  removeCardRegion: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardRegion: React.FC<Props> = ({ region, removeCardRegion, onEditing }) => {
  const removeLoading = useAppSelector(selectRemoveRegionLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{region.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardRegion} aria-label="delete">
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

export default CardRegion;
