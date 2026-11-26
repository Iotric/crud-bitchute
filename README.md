# Accountly

A simple user account app: sign up, log in, onboard, view/edit your profile, change your password and delete your account.

- **server/** — Express + Mongoose API (`/api/auth/*`, `/api/users/me*`)
- **client/** — Next.js (App Router) + Tailwind; `/api/*` is proxied to the API

## Run it

1. `cp .env.example .env` and fill in the values (MongoDB URI, a long random `JWT_SECRET`, etc.)
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

The API runs on `PORT` (default 5050 — avoid 5000 on macOS, AirPlay uses it). The client always runs on port 3000 and proxies `/api` to `API_URL`.
