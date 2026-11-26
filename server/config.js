// The only file that reads process.env. Everything else imports from here.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Locally, load the single .env at the repo root. On Vercel, env vars come from the project settings.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`Missing env: ${key}`);
    process.exit(1);
  }
}

const config = {
  port: Number(process.env.PORT) || 5050, // local only; Vercel assigns its own
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  clientUrl: process.env.CLIENT_URL || null, // optional: only needed if a different origin calls the API
  isVercel: Boolean(process.env.VERCEL),
};

export default config;
