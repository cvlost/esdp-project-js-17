import React from 'react';
import { ARR, StyledTableRow } from '../../../constants';
import { TableCell, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { AnalClientType } from '../../../types';

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
              client.anal.find((item) => item.month === month) ? (
                <Link style={{ color: '#fff' }} to={`/${client.anal.find((item) => item.month === month)?.locationId}`}>
                  Локация
                </Link>
              ) : (
                <p>Аренды нет</p>
              )
            }
          >
            <p>{client.anal.find((item) => item.month === month)?.total || '0'}</p>
          </Tooltip>
        </TableCell>
      ))}
      <TableCell align="center">{client.overallBudget}</TableCell>
      <TableCell align="center">{client.rentDay}</TableCell>
      <TableCell align="center">{client.numberOfBanners}</TableCell>
    </StyledTableRow>
  );
};

export default AnalyticsClientCard;
