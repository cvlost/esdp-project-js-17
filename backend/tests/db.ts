import mongoose from 'mongoose';
import config from '../config';

export const connect = async () => {
  const uri = config.db;
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
};

export const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
