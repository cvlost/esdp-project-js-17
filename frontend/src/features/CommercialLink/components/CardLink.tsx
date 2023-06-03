import React from 'react';
import { StyledTableRow } from '../../../constants';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TableCell,
  Tooltip,
  Link,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommercialLinkType } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectRemoveLinkLoading } from '../commercialLinkSlice';
import { NavLink } from 'react-router-dom';

interface Props {
  link: CommercialLinkType;
  openModalLink: React.MouseEventHandler;
  removeLinkOne: React.MouseEventHandler;
}

const CardLink: React.FC<Props> = ({ link, openModalLink, removeLinkOne }) => {
  const loadingRemove = useAppSelector(selectRemoveLinkLoading);
  return (
    <StyledTableRow key={link._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">
        <Link target="_blank" href={link.fullLink} underline="none">
          {link.fullLink}
        </Link>
      </TableCell>
      <TableCell align="left">{link.title}</TableCell>
      <TableCell align="left">
        <Button onClick={openModalLink}>Информация</Button>
      </TableCell>
      <TableCell align="left">
        <Tooltip
          title={
            <List>
              {link.location.map((item, index) => (
                <ListItem key={item}>
                  <ListItemText
                    primary="Билборд"
                    secondary={
                      <NavLink style={{ color: '#fff' }} to={`/${item}`}>
                        Локация №{index + 1}
                      </NavLink>
                    }
                  />
                </ListItem>
              ))}
            </List>
          }
        >
          <Box sx={{ cursor: 'pointer', color: 'primary.dark' }} color="initial">
            локации
          </Box>
        </Tooltip>
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
