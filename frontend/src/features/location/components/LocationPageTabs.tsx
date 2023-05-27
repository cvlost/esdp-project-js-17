import React from 'react';
import { Alert, Box, Grid, Tab, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useAppSelector } from '../../../app/hooks';
import { selectOneLocation } from '../locationsSlice';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import { selectUser } from '../../users/usersSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

interface Props {
  openModalBooking: React.MouseEventHandler;
  openModalBookingList: React.MouseEventHandler;
}

const LocationPageTabs: React.FC<Props> = ({ openModalBooking, openModalBookingList }) => {
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
          >{`Локация ${loc?.city} ${loc?.streets[0] + '/' + loc?.streets[1]}, ${loc?.direction}`}</Typography>
          {loc?.description ? (
            <Typography>{loc.description}</Typography>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="info" sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Typography>Описание локации отсутствует</Typography>
              </Alert>
              {user?.role === 'admin' && (
                <LoadingButton
                  loading={false}
                  sx={{ fontWeight: 'bold' }}
                  loadingPosition="start"
                  startIcon={<EditIcon />}
                  onClick={async () => {
                    if (await confirm('Редактирование локации', 'Приступить к редактированию этой локации?')) {
                      console.log('confirmed');
                    }
                  }}
                >
                  Добавить
                </LoadingButton>
              )}
            </Box>
          )}
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
                <TableCell>
                  {loc.rent ? (
                    <>
                      Да (с {dayjs(loc.rent.start).format('DD.MM.YYYY')} до {dayjs(loc.rent.end).format('DD.MM.YYYY')})
                    </>
                  ) : (
                    `Нет`
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Забронирован</TableCell>
                <TableCell>
                  {loc.reserve ? (
                    <>
                      Да (с {dayjs(loc.reserve.start).format('DD.MM.YYYY')} до{' '}
                      {dayjs(loc.reserve.end).format('DD.MM.YYYY')})
                    </>
                  ) : (
                    `Нет`
                  )}
                </TableCell>
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
                <TableCell>{loc?.streets[0] + '/' + loc?.streets[1]}</TableCell>
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
              <Grid item>
                <LoadingButton
                  onClick={openModalBooking}
                  loading={false}
                  variant="contained"
                  loadingPosition="start"
                  startIcon={<GroupAddIcon />}
                >
                  Бронировать
                </LoadingButton>
              </Grid>
              <Grid item>
                <LoadingButton
                  onClick={openModalBookingList}
                  loading={false}
                  variant="contained"
                  loadingPosition="start"
                  startIcon={<FormatListBulletedIcon />}
                >
                  Список броней
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
