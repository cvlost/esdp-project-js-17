import { HydratedDocument, Types } from 'mongoose';
import { ILocation, IPeriod, IUser } from '../types';
import Location from '../models/Location';
import Street from '../models/Street';
import Notification from '../models/Notification';
import dayjs from 'dayjs';
import Client from '../models/Client';
import Direction from '../models/Direction';
import City from '../models/City';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import config from '../config';
import User from '../models/Users';

interface IBookingLocation {
  _id: Types.ObjectId;
  streets: string[];
  city: string;
  direction: string;
  closestBookingDate: Date;
  booking: {
    client: Types.ObjectId;
    booking_date: IPeriod;
  };
}

export interface SocketWithUser extends Socket {
  user: HydratedDocument<IUser>;
}

let io: Server;

export const setupWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    path: '/notifications',
    cors: {
      origin: config.clientUrl,
    },
  });

  io.use(async (socket, next) => {
    try {
      const socketWithUser = socket as SocketWithUser;
      const { token } = socket.handshake.query as { token: string };
      const user = await User.findOne({ token });

      if (!user) return next(new Error('Неавторизованный пользователь.'));

      socketWithUser.user = user;
      next();
    } catch (e) {
      return next(new Error('Непредвиденная ошибка во время проверки пользователя.'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const socketWithUser = socket as SocketWithUser;
    const userId = socketWithUser.user._id.toString();

    try {
      const notifications = await getAll(userId);
      socketWithUser.emit('notifications', notifications);
    } catch (error) {
      console.error('Ошибка при получении уведомлений при подключении пользователя:', error);
    }

    socketWithUser.on('notifications/read', async (data) => {
      try {
        await readOne(userId, data.notificationId);
        const notifications = await getAll(userId);
        socketWithUser.emit('notifications', notifications);
      } catch (error) {
        console.error('Ошибка при получении уведомлений после прочтения одного уведомления:', error);
      }
    });
  });
};

const getDayLabel = (number: number) => {
  if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return 'дней';
  const lastNumb = number % 10;
  if (lastNumb == 1) return 'день';
  if ([2, 3, 4].includes(lastNumb)) return 'дня';
  return 'дней';
};

export const getAll = async (userId: string) => {
  await checkAll();
  return Notification.find({ readBy: { $nin: [userId] } })
    .sort({ createdAt: -1 })
    .populate({ path: 'client', model: Client });
};

export const readOne = async (userId: string, notificationId: string) => {
  await Notification.updateOne({ _id: notificationId }, { $push: { readBy: userId } });
};

export const removeRent = async (locId: string) => {
  await Notification.deleteOne({ $and: [{ location: locId }, { event: 'rent/expires' }] });
  await notifySpecificUsers();
};

export const notifySpecificUsers = async () => {
  const sockets = Array.from(io.sockets.sockets.values());

  for (const socket of sockets) {
    const userId = (socket as SocketWithUser).user._id.toString();
    const notifications = await getAll(userId);
    socket.emit('notifications', notifications);
  }
};

export const updateRent = async () => {
  await notifySpecificUsers();
};

export const updateBooking = async () => {
  await notifySpecificUsers();
};

export const removeBooking = async (locId: string) => {
  await Notification.deleteOne({ $and: [{ location: locId }, { event: 'booking/oncoming' }] });
  await notifySpecificUsers();
};

export const checkBookingOncoming = async () => {
  try {
    const locationsWithoutBooking = await Location.find({ booking: { $size: 0 } });
    const locationIds: Types.ObjectId[] = locationsWithoutBooking.map((loc) => loc._id);

    await Notification.deleteMany({ $and: [{ location: { $in: locationIds } }, { event: 'booking/oncoming' }] });

    const oncomingBookingDays = 7;
    const oncomingBookingDate = dayjs().add(oncomingBookingDays, 'days').toDate();
    const bookedLocations: IBookingLocation[] = await Location.aggregate([
      { $match: { booking: { $not: { $size: 0 } } } },
      { $lookup: { from: 'streets', localField: 'streets', foreignField: '_id', as: 'streets' } },
      { $lookup: { from: 'cities', localField: 'city', foreignField: '_id', as: 'city' } },
      { $lookup: { from: 'directions', localField: 'direction', foreignField: '_id', as: 'direction' } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'booking',
          pipeline: [
            { $lookup: { from: 'clients', localField: 'clientId', foreignField: '_id', as: 'client' } },
            { $set: { client: { $first: '$client' } } },
          ],
        },
      },
      { $set: { streets: { $map: { input: '$streets', as: 'street', in: '$$street.name' } } } },
      { $set: { city: { $first: '$city.name' } } },
      { $set: { direction: { $first: '$direction.name' } } },
      { $unwind: '$booking' },
      { $sort: { 'booking.booking_date.start': 1 } },
      {
        $group: {
          _id: '$_id',
          closestBookingDate: { $min: '$booking.booking_date.start' },
          booking: { $first: '$booking' },
          streets: { $first: '$streets' },
          city: { $first: '$city' },
          direction: { $first: '$direction' },
        },
      },
      { $match: { closestBookingDate: { $lt: oncomingBookingDate } } },
    ]);

    for (const loc of bookedLocations) {
      const currDate = dayjs();
      const bookingDate = dayjs(loc.closestBookingDate);
      const locationPrettyName = `${loc.city} ${loc.streets.sort().join(' / ')}, ${loc.direction}`;
      const daysLeft = bookingDate.diff(currDate, 'day');
      const dayLabel = getDayLabel(Math.abs(daysLeft));
      let message: string;
      if (daysLeft < 0) {
        message = `Срок бронирования локации ${locationPrettyName} прошел ${Math.abs(daysLeft)} ${dayLabel} назад!`;
      } else if (daysLeft === 0) {
        message = `Ближайшая дата бронирования локации ${locationPrettyName} сегодня!`;
      } else {
        message = `Ближайшая дата бронирования локации "${locationPrettyName}" через ${daysLeft} ${dayLabel}!`;
      }
      const notification = await Notification.findOne({ $and: [{ location: loc._id }, { event: 'booking/oncoming' }] });

      if (notification && notification.message === message) continue;

      await Notification.deleteOne({ $and: [{ location: loc._id }, { event: 'booking/oncoming' }] });
      await Notification.create({
        message,
        event: 'booking/oncoming',
        locationPrettyName,
        client: loc.booking.client._id,
        date: loc.booking.booking_date,
        location: loc._id,
      });
    }
  } catch (error) {
    console.error('Ошибка проверки приближающихся сроков бронирования для создания уведомлений:', error);
  }
};

export const checkRentExpiration = async () => {
  try {
    const preExpiredDays = 7;
    const currentDate = new Date();
    const preExpiredDate = dayjs().add(preExpiredDays, 'days').toDate();
    const expiredLocationRents: HydratedDocument<ILocation>[] = await Location.find({
      $and: [{ rent: { $ne: null } }, { 'rent.end': { $lte: currentDate } }],
    });
    const preExpiredLocationRents: HydratedDocument<ILocation>[] = await Location.find({
      $and: [{ rent: { $ne: null } }, { 'rent.end': { $gt: currentDate } }, { 'rent.end': { $lte: preExpiredDate } }],
    });

    for (const loc of expiredLocationRents) {
      const streets: string[] = await Promise.all(
        loc.streets.map(async (street) => {
          const streetObj = await Street.findById(street);
          if (streetObj) return streetObj.name;
          else return '';
        }),
      );
      const direction = (await Direction.findById(loc.direction))?.name;
      const city = (await City.findById(loc.city))?.name;
      const locationPrettyName = `${city} ${streets.sort().join(' / ')}, ${direction}`;
      await Notification.deleteOne({ $and: [{ location: loc._id }, { event: 'rent/ended' }] });
      await Notification.create({
        message: `Срок аренды локации ${locationPrettyName} истек!`,
        event: 'rent/ended',
        locationPrettyName,
        client: loc.client,
        date: loc.rent,
        location: loc._id,
      });

      loc.rent = null;
      loc.client = null;
      await loc.save();
    }

    for (const loc of preExpiredLocationRents) {
      const streets: string[] = await Promise.all(
        loc.streets.map(async (street) => {
          const streetObj = await Street.findById(street);
          if (streetObj) return streetObj.name;
          else return '';
        }),
      );
      const city = (await City.findById(loc.city))?.name;
      const direction = (await Direction.findById(loc.direction))?.name;
      const locationPrettyName = `${city} ${streets.sort().join(' / ')}, ${direction}`;
      const currDate = dayjs();
      const rentEndDate = dayjs(loc.rent?.end);
      const daysLeft = rentEndDate.diff(currDate, 'day') + 1;
      const dayLabel = getDayLabel(daysLeft);
      const message = `Срок аренды локации ${locationPrettyName} истекает через ${daysLeft} ${dayLabel}!`;
      const notification = await Notification.findOne({ $and: [{ location: loc._id }, { event: 'rent/expires' }] });

      if (notification && notification.message === message) continue;

      await Notification.deleteOne({ $and: [{ location: loc._id }, { event: 'rent/expires' }] });
      await Notification.create({
        message,
        event: 'rent/expires',
        locationPrettyName,
        client: loc.client,
        date: loc.rent,
        location: loc._id,
      });
    }
  } catch (error) {
    console.error('Ошибка проверки сроков аренды для создания уведомлений:', error);
  }
};

export const checkAll = async () => {
  await checkRentExpiration();
  await checkBookingOncoming();
};
