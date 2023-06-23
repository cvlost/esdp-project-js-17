import React from 'react';
import { ClientsList } from '../../../../types';
import { StyledTableRow } from '../../../../constants';
import { Box, CircularProgress, IconButton, TableCell, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveClientLoading } from '../clientSlice';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Props {
  client: ClientsList;
  removeClientCard: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}
const CardClient: React.FC<Props> = ({ client, removeClientCard, onEditing }) => {
  const removeLoading = useAppSelector(selectRemoveClientLoading);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Название организации: </b>
              {client.companyName}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Телефон компании: </b>
              {client.companyPhone}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Email компании: </b>
              {client.companyEmail}
            </Typography>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
          {open ? (
            <Box>
              <Typography component="h1" variant="h5" sx={{ mb: 1, borderBottom: '1px solid black' }}>
                Организация
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Вид деятельности организации: </b>
                {client.companyKindOfActivity}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Адрес компании: </b>
                {client.companyAddress}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Сайт компании: </b>
                <a href={client.companySite}>{client.companySite}</a>
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>День рождения компании: </b>
                {client.companyBirthday}
              </Typography>
              <Typography component="h1" variant="h5" sx={{ mb: 1, borderBottom: '1px solid black' }}>
                Руководство компании:
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>ФИО:</b>
                {client.CompanyManagementName}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>должность:</b>
                {client.CompanyManagementJobTitle}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>дата рождения: </b>
                {client.CompanyManagementBirthday}
              </Typography>
              <Typography component="h1" variant="h5" sx={{ mb: 1, borderBottom: '1px solid black' }}>
                Контактное лицо
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>ФИО:</b>
                {client.contactPersonName}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>должность:</b>
                {client.contactPersonJobTitle}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>дата рождения: </b>
                {client.contactPersonBirthday}
              </Typography>
              <Typography component="h1" variant="h5" sx={{ mb: 1, borderBottom: '1px solid black' }}>
                Рекламный канал
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Рекламный канал:</b>
                {client.advertisingChannel}
              </Typography>
            </Box>
          ) : (
            ''
          )}
        </TableCell>
        <TableCell align="right">
          <IconButton
            disabled={removeLoading ? removeLoading === client._id : false}
            onClick={removeClientCard}
            aria-label="delete"
          >
            {removeLoading && removeLoading === client._id && <CircularProgress />}
            <DeleteIcon />
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
