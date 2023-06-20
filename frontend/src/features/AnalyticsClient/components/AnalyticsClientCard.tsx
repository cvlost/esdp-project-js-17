import React from 'react';
import { ARR, StyledTableRow } from '../../../constants';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TableCell,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AnalClientType } from '../../../types';
import FolderIcon from '@mui/icons-material/Folder';
import dayjs from 'dayjs';

interface Props {
  client: AnalClientType;
}

const AnalyticsClientCard: React.FC<Props> = ({ client }) => {
  return (
    <StyledTableRow key={client.client._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {client.client.companyName}
      </TableCell>
      {ARR.map((month) => (
        <TableCell key={month} align="center">
          <Tooltip
            title={
              <List>
                {client.anal
                  .filter((item) => item.month === month)
                  .map((item, index) => (
                    <ListItem key={item.date.start}>
                      <ListItemAvatar sx={{ mb: 'auto' }}>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Локация №${index + 1}`}
                        secondary={
                          <>
                            <Link style={{ color: '#fff' }} to={`/${item.locationId}`}>
                              Перейти к локации...
                            </Link>
                            <Typography
                              sx={{ color: '#fff', display: 'block', my: 1 }}
                              component="span"
                              color="inherit"
                            >
                              {`Занятость от ${dayjs(item.date.start).format('DD.MM.YYYY')} до ${dayjs(
                                item.date.end,
                              ).format('DD.MM.YYYY')}`}
                            </Typography>
                            <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
                              Цена: {item.total}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            }
          >
            {client.anal.find((item) => item.month === month) ? (
              client.anal.filter((anal) => anal.month === month).length >= 2 ? (
                <Paper sx={{ p: 1, background: '#2e7d32', color: '#fff' }} elevation={3}>
                  Локации...
                </Paper>
              ) : (
                <Paper sx={{ p: 1, background: '#2e7d32', color: '#fff' }} elevation={3}>
                  {client.anal.find((item) => item.month === month)?.total}
                </Paper>
              )
            ) : (
              <Paper sx={{ p: 1 }} elevation={3}>
                0
              </Paper>
            )}
          </Tooltip>
        </TableCell>
      ))}
      <TableCell align="center">
        <Paper sx={{ background: '#ddd', p: 1 }}>{client.overallBudget}</Paper>
      </TableCell>
      <TableCell align="center">
        <Paper sx={{ background: '#ddd', p: 1 }}>{client.rentDay}</Paper>
      </TableCell>
      <TableCell align="center">
        <Paper sx={{ background: '#ddd', p: 1 }}>{client.numberOfBanners}</Paper>
      </TableCell>
    </StyledTableRow>
  );
};

export default AnalyticsClientCard;
