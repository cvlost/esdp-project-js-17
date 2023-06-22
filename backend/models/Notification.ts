import { model, Schema } from 'mongoose';
import { INotification } from '../types';

const NotificationSchema = new Schema<INotification>(
  {
    message: {
      type: String,
      required: true,
    },
    subject: {
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
