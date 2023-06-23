import { HydratedDocument } from 'mongoose';
import { ILocation } from '../types';
import Location from '../models/Location';
import Street from '../models/Street';
import Notification from '../models/Notification';

export const getAll = async () => {
  const locations: HydratedDocument<ILocation>[] = await Location.find({ rent: { $ne: null } });

  for (const loc of locations) {
    if (loc.rent) {
      if (loc.rent.end.getTime() < new Date().getTime()) {
        const streets: string[] = await Promise.all(
          loc.streets.map(async (street) => {
            const streetObj = await Street.findById(street);
            if (streetObj) return streetObj.name;
            else return '';
          }),
        );
        await Notification.deleteMany({ location: loc._id });
        await Notification.create({
          message: `Срок аренды локации ${streets.join(' / ')} истек`,
          subject: 'rent',
          event: 'ended',
          location: loc._id,
        });
      }
    }
  }

  return Notification.find();
};
