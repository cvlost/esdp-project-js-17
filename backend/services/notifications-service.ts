import { HydratedDocument } from 'mongoose';
import { ILocation } from '../types';
import Location from '../models/Location';
import Street from '../models/Street';
import Notification from '../models/Notification';
import dayjs from 'dayjs';

const getDayLabel = (number: number) => {
  if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return 'дней';
  const lastNumb = number % 10;
  if (lastNumb == 1) return 'день';
  if ([2, 3, 4].includes(lastNumb)) return 'дня';
  return 'дней';
};

export const getAll = async (userId: string) => {
  await checkRentExpiration();
  return Notification.find({ readBy: { $nin: [userId] } }).sort({ createdAt: -1 });
};

export const readOne = async (userId: string, notificationId: string) => {
  await Notification.updateOne({ _id: notificationId }, { $push: { readBy: userId } });
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
      await Notification.deleteOne({ $and: [{ location: loc._id }, { event: 'ended' }] });
      await Notification.create({
        message: `Срок аренды локации ${streets.join(' / ')} истек!`,
        subject: 'rent',
        event: 'ended',
        location: loc._id,
      });

      loc.rent = null;
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

      const currDate = dayjs();
      const rentEndDate = dayjs(loc.rent?.end);
      const daysLeft = rentEndDate.diff(currDate, 'day');
      const message = `Срок аренды локации ${streets.join(' / ')} истекает через ${daysLeft} ${getDayLabel(daysLeft)}!`;

      const notification = await Notification.findOne({
        $and: [{ location: loc._id }, { event: 'expires' }],
      });

      if (notification && notification.message === message) continue;

      await Notification.deleteOne({
        $and: [{ location: loc._id }, { event: 'expires' }],
      });

      await Notification.create({
        message,
        subject: 'rent',
        event: 'expires',
        location: loc._id,
      });
    }
  } catch (error) {
    console.error('Ошибка проверки сроков аренды для создания уведомлений:', error);
  }
};
