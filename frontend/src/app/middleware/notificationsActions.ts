import { createAction } from '@reduxjs/toolkit';

export const wsConnect = createAction<string>('socket/connect');
export const wsDisconnect = createAction('socket/disconnect');
export const wsReadNotification = createAction<string, 'notifications/read'>('notifications/read');

type ReadNotificationAction = ReturnType<typeof wsReadNotification>;

export type ClientAction = ReadNotificationAction;
