import React from 'react';
import { Box, Tab, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useAppSelector } from '../../../app/hooks';
import { selectLocationLinkOne } from '../commercialLinkSlice';
import dayjs from 'dayjs';

const CommercialLinkOneCard = () => {
  const locationLinkOne = useAppSelector(selectLocationLinkOne);
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return !locationLinkOne.location ? null : (
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
          >
            {locationLinkOne.location.description || 'Информация недоступна'}
          </Typography>
          <Typography>
            {locationLinkOne.location.description ? locationLinkOne.location.description : 'Информация недоступна'}
          </Typography>
        </TabPanel>
        <TabPanel value="2">
          <Typography fontWeight="bold" color="gray" my={1}>
            Биллборд
          </Typography>
          <Table sx={{ mb: 5 }}>
            <TableBody>
              {locationLinkOne.location.size && (
                <TableRow>
                  <TableCell>Размер</TableCell>
                  <TableCell>{locationLinkOne.location.size}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.rent && (
                <TableRow>
                  <TableCell>В аренде</TableCell>
                  <TableCell>
                    {locationLinkOne.location.rent ? (
                      <>
                        Да (с {dayjs(locationLinkOne.location.rent.start).format('DD.MM.YYYY')} до{' '}
                        {dayjs(locationLinkOne.location.rent.end).format('DD.MM.YYYY')})
                      </>
                    ) : (
                      `Нет`
                    )}
                  </TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.placement && (
                <TableRow>
                  <TableCell>Расположение</TableCell>
                  <TableCell>{locationLinkOne.location.placement ? `По направлению` : `Не по направлению`}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.price && (
                <TableRow>
                  <TableCell>Цена за месяц</TableCell>
                  <TableCell>{locationLinkOne.location.price} сом</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.lighting && (
                <TableRow>
                  <TableCell>Освещение</TableCell>
                  <TableCell>{locationLinkOne.location.lighting}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.format && (
                <TableRow>
                  <TableCell>Формат</TableCell>
                  <TableCell>{locationLinkOne.location.format}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Typography fontWeight="bold" color="gray" my={1}>
            Локация
          </Typography>
          <Table>
            <TableBody>
              {locationLinkOne.location.city && (
                <TableRow>
                  <TableCell>Город / Село</TableCell>
                  <TableCell>{locationLinkOne.location.city}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.streets && (
                <TableRow>
                  <TableCell>Улица</TableCell>
                  <TableCell>
                    {locationLinkOne.location.streets[0] + '/' + locationLinkOne.location.streets[1]}
                  </TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.addressNote && (
                <TableRow>
                  <TableCell>Заметка к адресу</TableCell>
                  <TableCell>{locationLinkOne.location.addressNote}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.region && (
                <TableRow>
                  <TableCell>Район</TableCell>
                  <TableCell>{locationLinkOne.location.region}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.area && (
                <TableRow>
                  <TableCell>Область</TableCell>
                  <TableCell>{locationLinkOne.location.area}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.direction && (
                <TableRow>
                  <TableCell>Сторона</TableCell>
                  <TableCell>{locationLinkOne.location.direction}</TableCell>
                </TableRow>
              )}
              {locationLinkOne.location.legalEntity && (
                <TableRow>
                  <TableCell>Юр. лицо</TableCell>
                  <TableCell>{locationLinkOne.location.legalEntity}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default CommercialLinkOneCard;
