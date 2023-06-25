import { model, Schema } from 'mongoose';
import { INotification } from '../types';
import { PeriodSchema } from './Period';

const NotificationSchema = new Schema<INotification>(
  {
    message: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    locationPrettyName: {
      type: String,
      required: true,
    },
    date: PeriodSchema,
    readBy: [Schema.Types.ObjectId],
    deletedBy: [Schema.Types.ObjectId],
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  { versionKey: false },
);

const Notification = model('Notification', NotificationSchema);

export default Notification;
