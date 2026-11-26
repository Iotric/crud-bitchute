import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// Load the single .env at the repo root (one folder up).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
nextEnv.loadEnvConfig(path.resolve(__dirname, '..'));

/** @type {(phase: string) => import('next').NextConfig} */
export default function nextConfig(phase) {
  // Locally, Next proxies /api to the Express server. On Vercel, vercel.json routes /api to the
  // server service on the same domain, so API_URL is only required for `next dev`.
  if (phase === PHASE_DEVELOPMENT_SERVER && !process.env.API_URL) {
    console.error('Missing env: API_URL');
    process.exit(1);
  }

  return {
    async rewrites() {
      if (!process.env.API_URL) return [];
      return [{ source: '/api/:path*', destination: `${process.env.API_URL}/api/:path*` }];
    },
  };
}
