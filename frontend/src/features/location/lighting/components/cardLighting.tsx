import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../../app/hooks';
import { selectLightingDeleteLoading } from '../lightingsSlice';
import { LightingList } from '../../../../types';

interface Props {
  lighting: LightingList;
  removeCardLighting: React.MouseEventHandler;
}

const CardLighting: React.FC<Props> = ({ lighting, removeCardLighting }) => {
  const removeLoading = useAppSelector(selectLightingDeleteLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{lighting.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardLighting} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardLighting;
