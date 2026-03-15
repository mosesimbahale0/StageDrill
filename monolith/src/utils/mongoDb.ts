// src/utils/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

colors.enable();




dotenv.config();


export default function connectMongoDB() {
  const uri = process.env.MONGODB_ATLAS_PRODUCTION_URI;
  mongoose.connect(uri);
  const db = mongoose.connection;
  db.on('error', err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
  db.once('open', () => {
    console.log(colors.bgRed('Connected to MongoDB!'));
  });
}


