import React from 'react';
import { StyledTableRow } from '../../../constants';
import { Button, CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommercialLinkType } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectRemoveLinkLoading } from '../commercialLinkSlice';

interface Props {
  link: CommercialLinkType;
  openModalLink: React.MouseEventHandler;
  removeLinkOne: React.MouseEventHandler;
}

const CardLink: React.FC<Props> = ({ link, openModalLink, removeLinkOne }) => {
  const loadingRemove = useAppSelector(selectRemoveLinkLoading);
  return (
    <StyledTableRow key={link._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">{link.fullLink}</TableCell>
      <TableCell align="left">{link.title}</TableCell>
      <TableCell align="left">
        <Button onClick={openModalLink}>Информация</Button>
      </TableCell>
      <TableCell align="right">
        <IconButton disabled={loadingRemove} onClick={removeLinkOne} aria-label="delete">
          {!loadingRemove ? <DeleteIcon /> : <CircularProgress />}
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLink;
