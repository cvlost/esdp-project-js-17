import React from 'react';
import { ClientsList } from '../../../../types';
import { StyledTableRow } from '../../../../constants';
import { Box, CircularProgress, IconButton, TableCell, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveClientLoading } from '../clientSlice';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  client: ClientsList;
  removeClientCard: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardClient: React.FC<Props> = ({ client, removeClientCard, onEditing }) => {
  const removeLoading = useAppSelector(selectRemoveClientLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Имя: </b>
              {client.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Номер: </b>
              {client.phone}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Email: </b>
              {client.email}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeClientCard} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
          <IconButton onClick={onEditing} aria-label="success">
            <EditIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardClient;
