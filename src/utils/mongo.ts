import { connect } from 'mongoose';

const DEFAULT_MONGO_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/MongoDB';
const mongoDBConnectionString = process.env.MONGO_CONNECTION_STRING ?? DEFAULT_MONGO_CONNECTION_STRING;

export const connectToMongoDB = async () => {
  try {
    console.log(`Connecting to MongoDB on ${mongoDBConnectionString}`);

    await connect(mongoDBConnectionString);

    console.log(`Successfully connected to MongoDB\n`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
