import React from 'react';
import {
  Box,
  Container,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import FormCreateRegion from './components/FormCreateRegion';
import CardRegion from './components/CardRegion';

const CreateRegion = () => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#8f22ff',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  return (
    <Typography variant="h5" component="h5">
      <Container component="main" maxWidth="xs">
        <FormCreateRegion />
      </Container>
      <Container>
        <Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Регион</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <CardRegion />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Typography>
  );
};

export default CreateRegion;
