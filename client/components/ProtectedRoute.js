'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { PageSpinner } from './Spinner';

// Only renders children for logged-in users; otherwise sends them to /login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hadUser = useRef(false);
  if (user) hadUser.current = true;

  useEffect(() => {
    // If the user was here and just logged out, logout() already chose where to go.
    if (!loading && !user && !hadUser.current) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) return <PageSpinner />;
  return children;
}

// For /login and /signup: logged-in users are sent on to the app.
export function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace(user.onboarded ? '/profile' : '/onboarding');
  }, [loading, user, router]);

  if (loading || user) return <PageSpinner />;
  return children;
}
