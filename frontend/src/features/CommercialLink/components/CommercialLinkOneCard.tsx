import React from 'react';
import { Box, Tab, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const CommercialLinkOneCard = () => {
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Описание" value="1" />
            <Tab label="Характеристики" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Typography
            component="h6"
            variant="h6"
            color="#333"
            fontWeight="bold"
            textAlign="center"
            maxWidth="sm"
            mx="auto"
            mt={2}
            mb={5}
          >{`Локация`}</Typography>
          <Typography>test</Typography>
        </TabPanel>
        <TabPanel value="2">
          <Typography fontWeight="bold" color="gray" my={1}>
            Биллборд
          </Typography>
          <Table sx={{ mb: 5 }}>
            <TableBody>
              <TableRow>
                <TableCell>Размер</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>В аренде</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Забронирован</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Расположение</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена за месяц</TableCell>
                <TableCell>1 сом</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Освещение</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Формат</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography fontWeight="bold" color="gray" my={1}>
            Локация
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Город / Село</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Улица</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Заметка к адресу</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Район</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Область</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Направление</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Юр. лицо</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default CommercialLinkOneCard;
