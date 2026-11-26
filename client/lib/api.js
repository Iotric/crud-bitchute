// Small fetch wrapper. Always calls relative /api/... (proxied to Express by next.config.mjs).
export const TOKEN_KEY = 'token';

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * api('/users/me', { method: 'PATCH', body: {...} })
 * Throws an Error with the server's message on failure.
 * Pass skipAuthRedirect for calls where a 401 means "wrong password", not "logged out".
 */
export async function api(path, { method = 'GET', body, skipAuthRedirect = false } = {}) {
  const token = getToken();
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token && !skipAuthRedirect && onUnauthorized) onUnauthorized();
    const err = new Error(data.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }

  return data;
}
