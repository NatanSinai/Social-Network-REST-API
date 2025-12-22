import { connect } from 'mongoose';
import { envVar } from '.';

const mongoDBConnectionString = envVar.MONGO_CONNECTION_STRING;

export const connectToMongoDB = async () => {
  try {
    console.log(`Connecting to MongoDB on '${mongoDBConnectionString}'`);

    await connect(mongoDBConnectionString);

    console.log(`Successfully connected to MongoDB\n`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
