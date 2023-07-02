import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../../app/hooks';
import { selectLightingDeleteLoading } from '../lightingsSlice';
import { LightingList } from '../../../../types';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  lighting: LightingList;
  removeCardLighting: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardLighting: React.FC<Props> = ({ lighting, removeCardLighting, onEditing }) => {
  const removeLoading = useAppSelector(selectLightingDeleteLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{lighting.name}</TableCell>
        <TableCell align="right">
          <IconButton
            disabled={removeLoading ? removeLoading === lighting._id : false}
            onClick={removeCardLighting}
            aria-label="delete"
          >
            {removeLoading && removeLoading === lighting._id && <CircularProgress color="success" />}
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

export default CardLighting;
