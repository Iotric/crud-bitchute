import express from 'express';
import cors from 'cors';
import config from './config.js';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();

if (config.clientUrl) app.use(cors({ origin: config.clientUrl }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Make sure the database is connected before any route touches it.
app.use('/api', async (_req, _res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// Express 5 forwards rejected promises from async handlers here.
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again' });
});

export default app;
