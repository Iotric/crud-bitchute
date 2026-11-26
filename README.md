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

## Deploy to Vercel

The repo deploys as **one Vercel project** using [Vercel Services](https://vercel.com/docs/services) (see `vercel.json`):
`/api/*` is routed to the Express `server` service and everything else to the Next.js `client` service, on the same domain.

1. Import the repo into Vercel (leave Root Directory as the repo root).
2. Add these environment variables in the project settings:
   - `MONGODB_URI`: a cloud database such as MongoDB Atlas (allow access from `0.0.0.0/0`)
   - `JWT_SECRET`: a long random string (`openssl rand -hex 32`)
   - `JWT_EXPIRES_IN`: e.g. `7d`
3. Deploy. `PORT`, `API_URL` and `CLIENT_URL` are not needed on Vercel.
