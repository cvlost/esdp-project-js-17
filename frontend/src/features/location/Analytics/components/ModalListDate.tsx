import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { MONTHS } from '../../../../constants';
import { ClientHistoryOneType, DateHistoryClient } from '../../../../types';

interface Props {
  open: boolean;
  setOpenDate: (clientHistoryOne: DateHistoryClient) => void;
  setCloseDate: React.MouseEventHandler;
  clientHistoryOne: ClientHistoryOneType;
}

const ModalListDate: React.FC<Props> = ({ open, setOpenDate, setCloseDate, clientHistoryOne }) => {
  const generateItem = (month: string, ary: ClientHistoryOneType, item: number) => {
    if (ary.start.month === month && ary.end.month === month) {
      return (
        <Paper
          key={item}
          sx={{
            p: 1,
            mr: 1,
            background: item >= ary.start.day && item <= ary.end.day ? '#ffd500' : null,
          }}
        >
          {item}
        </Paper>
      );
    } else if (ary.monthNames.indexOf(month) !== -1) {
      return (
        <Paper
          key={item}
          sx={{
            p: 1,
            mr: 1,
            background: '#ffd500',
          }}
        >
          {item}
        </Paper>
      );
    }

    if (ary.start?.month === month) {
      return (
        <Paper
          key={item}
          sx={{
            p: 1,
            mr: 1,
            background: ary.start.day <= item ? '#ffd500' : null,
          }}
        >
          {item}
        </Paper>
      );
    } else if (ary.end.month === month) {
      return (
        <Paper
          key={item}
          sx={{
            p: 1,
            mr: 1,
            background: ary.end.day >= item ? '#ffd500' : null,
          }}
        >
          {item}
        </Paper>
      );
    } else {
      return (
        <Paper
          key={item}
          sx={{
            p: 1,
            mr: 1,
          }}
        >
          {item}
        </Paper>
      );
    }
  };
  return (
    <Dialog maxWidth="xl" open={open} onClose={setOpenDate}>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Даты</TableCell>
                <TableCell>
                  <Paper sx={{ p: 1, display: 'flex' }}>
                    <Typography sx={{ mr: 1 }} component="p">
                      Месяц
                    </Typography>
                    <Tooltip title="В аренде">
                      <Box
                        sx={{ width: '25px', height: '25px', background: '#ffd500', borderRadius: '5px', mr: 1 }}
                      ></Box>
                    </Tooltip>
                    <Tooltip title="Свободно">
                      <Box
                        sx={{
                          width: '25px',
                          height: '25px',
                          background: '#fff',
                          border: '1px solid #000',
                          borderRadius: '5px',
                        }}
                      ></Box>
                    </Tooltip>
                  </Paper>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MONTHS.map((month) => (
                <TableRow key={month.month} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ display: 'flex' }} align="right">
                    {clientHistoryOne.coll.length !== 0 &&
                      clientHistoryOne.coll
                        .slice(0, month.day)
                        .map((item) => generateItem(month.month, clientHistoryOne, item))}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {month.month}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={setCloseDate} autoFocus>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalListDate;
