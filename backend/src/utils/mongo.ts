import { MongoServerError } from 'mongodb';
import { connect } from 'mongoose';
import { envVar } from '.';

export const connectToMongoDB = async () => {
  const mongoDBConnectionString = envVar.MONGO_CONNECTION_STRING;

  try {
    console.log(`Connecting to MongoDB on '${mongoDBConnectionString}'`);

    await connect(mongoDBConnectionString);

    console.log(`Successfully connected to MongoDB\n`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export enum MongoErrorCode {
  DUPLICATE_KEY = 11000,
  DOCUMENT_VALIDATION_FAILED = 121,
}

export const isDuplicateKeyMongoError = (error: unknown) =>
  error instanceof MongoServerError && error.code === MongoErrorCode.DUPLICATE_KEY;
