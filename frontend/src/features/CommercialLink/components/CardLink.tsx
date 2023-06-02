import React from 'react';
import { StyledTableRow } from '../../../constants';
import { Button, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommercialLinkType } from '../../../types';

interface Props {
  link: CommercialLinkType;
  openModalLink: React.MouseEventHandler;
}

const CardLink: React.FC<Props> = ({ link, openModalLink }) => {
  return (
    <StyledTableRow key={link._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">{link.fullLink}</TableCell>
      <TableCell align="left">{link.title}</TableCell>
      <TableCell align="left">
        <Button onClick={openModalLink}>Информация</Button>
      </TableCell>
      <TableCell align="right">
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLink;
