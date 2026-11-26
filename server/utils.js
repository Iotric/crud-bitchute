import jwt from 'jsonwebtoken';
import config from './config.js';

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

// Turns a Mongo duplicate-key error into a friendly 409 message, or returns null.
export function duplicateMessage(err) {
  if (err?.code !== 11000) return null;
  const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
  if (field === 'email') return 'Email already in use';
  if (field === 'username') return 'Username taken';
  return 'Already exists';
}
