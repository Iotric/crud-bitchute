// Client-side checks that mirror the server rules, for instant inline errors.
export function validateProfile({ name, username, email, avatarUrl, bio }) {
  const errors = {};
  if (name !== undefined && (name.trim().length < 2 || name.trim().length > 50)) errors.name = 'Name must be 2–50 characters';
  if (username !== undefined && !/^[a-z0-9_]{3,20}$/.test(username.trim().toLowerCase()))
    errors.username = '3–20 characters: letters, numbers or underscore';
  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email';
  if (avatarUrl && !isUrl(avatarUrl)) errors.avatarUrl = 'Please enter a valid http(s) URL';
  if (bio !== undefined && bio.trim().length > 300) errors.bio = 'Bio must be 300 characters or fewer';
  return errors;
}

export function validateNewPassword(password, confirm) {
  const errors = {};
  if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (confirm !== password) errors.confirm = 'Passwords do not match';
  return errors;
}

export function isUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Maps a 409 message from the API onto the matching field.
export function fieldForApiError(message = '') {
  if (/email/i.test(message)) return 'email';
  if (/username/i.test(message)) return 'username';
  return null;
}
