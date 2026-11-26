import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';

// Load the single .env at the repo root (one folder up).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
nextEnv.loadEnvConfig(path.resolve(__dirname, '..'));

if (!process.env.API_URL) {
  console.error('Missing env: API_URL');
  process.exit(1);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${process.env.API_URL}/api/:path*` }];
  },
};

export default nextConfig;
