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
    backgroundColor: MainColorGreen,
    color: theme.palette.common.white,
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

export const MainColorGreen = '#2e7d32';

export const MONTHS = [
  {
    month: 'январь',
    day: 31,
  },
  {
    month: 'февраль',
    day: 27,
  },
  {
    month: 'март',
    day: 31,
  },
  {
    month: 'апрель',
    day: 30,
  },
  {
    month: 'май',
    day: 31,
  },
  {
    month: 'июнь',
    day: 30,
  },
  {
    month: 'июль',
    day: 31,
  },
  {
    month: 'август',
    day: 31,
  },
  {
    month: 'сентябрь',
    day: 30,
  },
  {
    month: 'ноябрь',
    day: 31,
  },
  {
    month: 'декабрь',
    day: 30,
  },
];
