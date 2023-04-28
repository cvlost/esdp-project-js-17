import React from 'react';
import { Box, Grid, Tab, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useAppSelector } from '../../../app/hooks';
import { selectOneLocation } from '../locationsSlice';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import { selectUser } from '../../users/usersSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const LocationPageTabs = () => {
  const user = useAppSelector(selectUser);
  const { confirm } = useConfirm();
  const [value, setValue] = React.useState('1');
  const loc = useAppSelector(selectOneLocation);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return !loc ? null : (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Описание" value="1" />
            <Tab label="Характеристики" value="2" />
            {user?.role === 'admin' && <Tab label="Управление" value="3" />}
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
          >{`Локация ${loc?.city} ${loc?.street}, ${loc?.direction}`}</Typography>
          <Typography mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur debitis distinctio ea
            enim eum ex excepturi ipsa iure laudantium minima nulla odio officia officiis perferendis perspiciatis porro
            qui quibusdam, quod sit soluta tempora temporibus! Aliquid et iure rerum velit.
          </Typography>
          <Typography mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur debitis distinctio ea
            enim eum ex excepturi ipsa iure laudantium minima nulla odio officia officiis perferendis perspiciatis porro
            qui quibusdam, quod sit soluta tempora temporibus! Aliquid et iure rerum velit.
          </Typography>
          <Typography mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur debitis distinctio ea
            enim eum ex excepturi ipsa iure laudantium minima nulla odio officia officiis perferendis perspiciatis porro
            qui quibusdam, quod sit soluta tempora temporibus! Aliquid et iure rerum velit.
          </Typography>
        </TabPanel>
        <TabPanel value="2">
          <Typography fontWeight="bold" color="gray" my={1}>
            Биллборд
          </Typography>
          <Table sx={{ mb: 5 }}>
            <TableBody>
              <TableRow>
                <TableCell>Размер</TableCell>
                <TableCell>{loc.size}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>В аренде</TableCell>
                <TableCell>{loc.rent ? `Да` : `Нет`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Забронирован</TableCell>
                <TableCell>{loc.reserve ? `Да` : `Нет`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Расположение</TableCell>
                <TableCell>{loc.placement ? `По направлению` : `Не по направлению`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена за месяц</TableCell>
                <TableCell>{loc.price} сом</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Освещение</TableCell>
                <TableCell>{loc.lighting}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Формат</TableCell>
                <TableCell>{loc.format}</TableCell>
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
                <TableCell>{loc.city}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Улица</TableCell>
                <TableCell>{loc.street}</TableCell>
              </TableRow>
              {loc.addressNote && (
                <TableRow>
                  <TableCell>Заметка к адресу</TableCell>
                  <TableCell>{loc.addressNote}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Район</TableCell>
                <TableCell>{loc.region}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Область</TableCell>
                <TableCell>{loc.area}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Направление</TableCell>
                <TableCell>{loc.direction}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Юр. лицо</TableCell>
                <TableCell>{loc.legalEntity}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabPanel>
        {user?.role === 'admin' && (
          <TabPanel value="3">
            <Grid container spacing={1}>
              <Grid item>
                <LoadingButton
                  loading={false}
                  variant="contained"
                  loadingPosition="start"
                  startIcon={<EditIcon />}
                  onClick={async () => {
                    if (await confirm('Редактирование локации', 'Приступить к редактированию этой локации?')) {
                      console.log('confirmed');
                    }
                  }}
                >
                  Изменить
                </LoadingButton>
              </Grid>
              <Grid item>
                <LoadingButton
                  loading={false}
                  variant="contained"
                  loadingPosition="start"
                  startIcon={<DeleteIcon />}
                  onClick={async () => {
                    if (await confirm('Удаление локации', 'Вы действительно хотите удалить эту локацию?')) {
                      console.log('confirmed');
                    }
                  }}
                >
                  Удалить
                </LoadingButton>
              </Grid>
            </Grid>
          </TabPanel>
        )}
      </TabContext>
    </Box>
  );
};

export default LocationPageTabs;
