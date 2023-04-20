import { IRole } from './types';
import { styled, TableCell, tableCellClasses, TableRow } from '@mui/material';

export const apiURL = 'http://localhost:8000';

export const ROLES: IRole[] = [
  {
    prettyName: 'Администратор',
    name: 'admin',
  },
  {
    prettyName: 'Пользователь',
    name: 'user',
  },
];

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#e3f2fd',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
