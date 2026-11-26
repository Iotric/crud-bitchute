// Small, explicit input checks. Each returns an error message or null.
import { COUNTRIES } from './countries.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

const isString = (v) => typeof v === 'string';

export const validators = {
  name(v) {
    if (!isString(v) || v.trim().length < 2 || v.trim().length > 50) return 'Name must be 2–50 characters';
    return null;
  },
  username(v) {
    if (!isString(v) || !USERNAME_RE.test(v.trim().toLowerCase()))
      return 'Username must be 3–20 characters: letters, numbers or underscore';
    return null;
  },
  email(v) {
    if (!isString(v) || !EMAIL_RE.test(v.trim())) return 'Please enter a valid email';
    return null;
  },
  password(v) {
    if (!isString(v) || v.length < 8) return 'Password must be at least 8 characters';
    return null;
  },
  avatarUrl(v) {
    if (v === '' || v == null) return null;
    if (!isString(v)) return 'Avatar must be a valid URL';
    try {
      const url = new URL(v.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      return 'Avatar must be a valid http(s) URL';
    }
    return null;
  },
  bio(v) {
    if (v == null) return null;
    if (!isString(v) || v.trim().length > 300) return 'Bio must be 300 characters or fewer';
    return null;
  },
  country(v) {
    if (v === '' || v == null) return null;
    if (!isString(v) || !COUNTRIES.includes(v.trim())) return 'Please choose a country from the list';
    return null;
  },
  onboarded(v) {
    if (typeof v !== 'boolean') return 'Onboarded must be true or false';
    return null;
  },
};

// Returns the first error found for the given fields, or null.
export function firstError(body, fields) {
  for (const field of fields) {
    const err = validators[field](body[field]);
    if (err) return err;
  }
  return null;
}
