import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  List,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Groups';
import { getEditingUser, getUsersList, logout, updateUser } from '../../features/users/usersThunks';
import ModalBody from '../ModalBody';
import UserForm from '../../features/users/components/UserForm';
import {
  openSnackbar,
  selectEditingError,
  selectEditOneUserLoading,
  selectOneEditingUser,
  selectUser,
  selectUserAlerts,
  selectUserAlertsLoading,
  selectUsersListData,
} from '../../features/users/usersSlice';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useConfirm from '../Dialogs/Confirm/useConfirm';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { wsReadNotification } from '../../app/middleware/notificationsActions';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const usersListData = useAppSelector(selectUsersListData);
  const mainUser = useAppSelector(selectUser);
  const error = useAppSelector(selectEditingError);
  const alerts = useAppSelector(selectUserAlerts);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const alertsLoading = useAppSelector(selectUserAlertsLoading);
  const { confirm } = useConfirm();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDialog = async () => {
    handleClose();
    await dispatch(getEditingUser(user._id));
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    try {
      await dispatch(updateUser({ id: user._id, user: userToChange })).unwrap();
      if (mainUser && mainUser.role === 'admin') {
        await dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
      }
      dispatch(openSnackbar({ status: true, parameter: 'editProfile' }));
      setIsDialogOpen(false);
    } catch (error) {
      throw new Error(`Произошла ошибка: ${error}`);
    }
  };

  return (
    <>
      <Button onClick={handleClick} color="inherit" style={{ textTransform: 'inherit' }}>
        <Typography mr={1}>{user.displayName}</Typography>
        <AccountCircleIcon />
      </Button>
      <IconButton size="small" onClick={() => setIsNotificationsOpen(true)}>
        <Badge badgeContent={alerts.length ? alerts.length : undefined} color="warning">
          <NotificationsIcon sx={{ color: 'white' }} />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {user.role === 'admin' && [
          <MenuItem
            key="user-management"
            onClick={() => {
              handleClose();
              navigate('/users');
            }}
          >
            <GroupIcon sx={{ mr: 1 }} />
            Управление пользователями
          </MenuItem>,
          <Divider key="user-divider" />,
        ]}
        {user && [
          <MenuItem
            key="user-management"
            onClick={() => {
              handleClose();
              navigate('/');
            }}
          >
            <ShareLocationIcon sx={{ mr: 1 }} />
            Управление локациями
          </MenuItem>,
          <Divider key="user-divider" />,
        ]}
        {user && [
          <MenuItem
            key="user-management"
            onClick={() => {
              handleClose();
              navigate('/clients-analytics');
            }}
          >
            <AnalyticsIcon sx={{ mr: 1 }} />
            Аналитика клиентов
          </MenuItem>,
          <Divider key="user-divider" />,
        ]}
        <MenuItem onClick={openDialog}>
          <AccountBoxIcon sx={{ mr: 1 }} />
          Редактировать профиль
        </MenuItem>
        <Divider key="user-divider" />
        <MenuItem
          sx={{ justifyContent: 'center' }}
          onClick={async () => {
            if (await confirm('Выход', 'Вы действительно хотите выйти? Так быстро?')) {
              dispatch(logout());
              handleClose();
              navigate('/');
            }
          }}
        >
          Выйти
          <LogoutIcon sx={{ ml: 1 }} />
        </MenuItem>
      </Menu>
      {editingUser && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <UserForm error={error} onSubmit={onFormSubmit} existingUser={editingUser} isEdit isLoading={editLoading} />
        </ModalBody>
      )}
      <Dialog open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} fullWidth={true}>
        <DialogContent>
          <>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <NotificationsNoneIcon />
              <Typography>Уведомления</Typography>
            </Box>
            {alerts.length ? (
              <List>
                {alerts.map((alert) => (
                  <Accordion key={alert._id} sx={{ boxShadow: '0 0 .2em #cccccc', bgcolor: '#f6f8ff' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography component="div">
                        {alert.event === 'rent/ended' ? (
                          <>
                            <Chip
                              avatar={<ErrorOutlineIcon />}
                              label="Аренда"
                              variant="outlined"
                              size="small"
                              color="info"
                            />
                            <Typography component="span" sx={{ fontSize: '0.8em', fontWeight: 'bold', mx: 1 }}>
                              Окончание аренды
                            </Typography>
                          </>
                        ) : alert.event === 'rent/expires' ? (
                          <>
                            <Chip
                              avatar={<DateRangeIcon />}
                              label="Аренда"
                              variant="outlined"
                              size="small"
                              color="info"
                            />
                            <Typography component="span" sx={{ fontSize: '0.8em', fontWeight: 'bold', mx: 1 }}>
                              Срок аренды подходит к концу
                            </Typography>
                          </>
                        ) : alert.event === 'booking/oncoming' ? (
                          <>
                            <Chip
                              avatar={<PlaylistAddCheckCircleIcon />}
                              label="Бронирование"
                              variant="outlined"
                              size="small"
                              color="info"
                            />
                            <Typography component="span" sx={{ fontSize: '0.8em', fontWeight: 'bold', mx: 1 }}>
                              Близжайшая дата бронирования
                            </Typography>
                          </>
                        ) : (
                          'Неизвестный тип уведомления'
                        )}
                      </Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                      <Typography sx={{ fontWeight: 'bold', my: 2 }}>{alert.message}</Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography sx={{ fontSize: '0.8em' }}>Локация: {alert.locationPrettyName}</Typography>
                      <Typography sx={{ fontSize: '0.8em' }}>Клиент: {alert.client.companyName}</Typography>
                      <Typography sx={{ fontSize: '0.8em' }}>
                        Дата начала: {dayjs(alert.date.start).format('DD MMMM YYYY')}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8em' }}>
                        Дата окончания: {dayjs(alert.date.end).format('DD MMMM YYYY')}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography sx={{ fontSize: '0.8em', mb: 2 }}>
                        Уведомление создано {dayjs(alert.createdAt).format('DD MMMM YYYY')}
                      </Typography>
                    </AccordionDetails>
                    <Divider />
                    <AccordionActions>
                      <Button
                        disabled={alertsLoading}
                        size="small"
                        onClick={() => {
                          navigate(`/location/${alert.location}`);
                          setIsNotificationsOpen(false);
                        }}
                      >
                        Локация
                      </Button>
                      <Button
                        disabled={alertsLoading}
                        size="small"
                        onClick={async () => {
                          dispatch(wsReadNotification(alert._id));
                        }}
                      >
                        Скрыть
                      </Button>
                    </AccordionActions>
                  </Accordion>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ width: '100%' }}>
                Новых уведомлений нет.
              </Alert>
            )}
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
