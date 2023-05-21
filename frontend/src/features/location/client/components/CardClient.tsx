import React from 'react';
import { ClientsList } from '../../../../types';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveClientLoading } from '../clientSlice';

interface Props {
  client: ClientsList;
  removeClientCard: React.MouseEventHandler;
}

const CardClient: React.FC<Props> = ({ client, removeClientCard }) => {
  const removeLoading = useAppSelector(selectRemoveClientLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{client.name}</TableCell>
        <TableCell align="left">{client.phone}</TableCell>
        <TableCell align="left">{client.email}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeClientCard} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardClient;
