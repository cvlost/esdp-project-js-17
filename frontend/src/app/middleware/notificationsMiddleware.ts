import { Dispatch, Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { io, Socket } from 'socket.io-client';
import { apiURL } from '../../constants';
import { INotification } from '../../types';
import { setNotifications } from '../../features/users/usersSlice';
import { ClientAction, wsConnect, wsDisconnect, wsReadNotification } from './notificationsActions';

const initSocketMiddleware: () => Middleware = () => {
  let socket: null | Socket = null;

  const connectSocket = (dispatch: Dispatch, getState: () => RootState, userId: string) => {
    socket = io(apiURL, {
      path: '/notifications',
      query: { userId },
    });

    socket.on('notifications', (data) => {
      const notifications = data as INotification[];
      console.log('Received notification:', notifications);
      dispatch(setNotifications(notifications));
    });
  };

  const disconnectSocket = () => {
    if (socket !== null) socket.disconnect();
    socket = null;
  };

  const readNotification = (dispatch: Dispatch, notificationId: string) => {
    if (socket) socket.emit('notifications/read', { notificationId });
  };

  const sendSocketMessage = (dispatch: Dispatch, action: ClientAction) => {
    if (socket)
      switch (action.type) {
        case wsReadNotification.type:
          readNotification(dispatch, action.payload);
          break;
      }
  };

  return (api) => (next) => (action) => {
    const { dispatch, getState } = api;
    const { type } = action;

    switch (type) {
      case wsConnect.type:
        connectSocket(dispatch, getState, action.payload as string);
        break;

      case wsDisconnect.type:
        disconnectSocket();
        break;

      default:
        sendSocketMessage(dispatch, action as ClientAction);
        break;
    }

    return next(action);
  };
};

const notificationsMiddleware = initSocketMiddleware();

export default notificationsMiddleware;
