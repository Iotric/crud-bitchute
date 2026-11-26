import mongoose from 'mongoose';
import config from './config.js';

// Reuse one connection across requests (important on Vercel, where the function instance is reused).
let connecting = null;

export function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose
      .connect(config.mongodbUri)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => {
        connecting = null; // allow a retry on the next request
        throw err;
      });
  }
  return connecting;
}
