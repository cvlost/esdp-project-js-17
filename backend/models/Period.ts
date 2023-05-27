import { HydratedDocument, Schema } from 'mongoose';
import { IPeriod } from '../types';

export const PeriodSchema = new Schema<IPeriod>(
  {
    start: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: HydratedDocument<IPeriod>, value: Date) {
          return value < this.end;
        },
        message: 'Дата начала аренды должа быть меньше даты окончания.',
      },
    },
    end: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: HydratedDocument<IPeriod>, value: Date) {
          return value > this.start;
        },
        message: 'Дата окончания аренды должа быть больше даты начала.',
      },
    },
  },
  { versionKey: false, _id: false },
);
