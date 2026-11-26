import app from './app.js';
import config from './config.js';
import { connectDB } from './db.js';

// On Vercel the exported app is the request handler. Locally we connect first, then listen.
if (!config.isVercel) {
  connectDB()
    .then(() => {
      app.listen(config.port, () => console.log(`API listening on http://localhost:${config.port}`));
    })
    .catch((err) => {
      console.error('Could not connect to MongoDB:', err.message);
      process.exit(1);
    });
}

export default app;
