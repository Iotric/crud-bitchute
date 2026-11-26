'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { buttonClasses } from '@/components/Button';

const FEATURES = [
  { title: 'Secure by default', text: 'Passwords are hashed with bcrypt and never leave the server.' },
  { title: 'Your profile, your way', text: 'Add an avatar and bio, and update them whenever you like.' },
  { title: 'Full control', text: 'Change your password or delete your account at any time.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="py-6 sm:py-12">
      <section className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
          Simple account management
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Your account, <span className="text-indigo-600">simply managed.</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          Sign up in seconds, set up your profile, and keep everything up to date in one clean place.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {user ? (
            <Link href="/profile" className={buttonClasses('primary', 'px-6 py-3')}>Go to your profile</Link>
          ) : (
            <>
              <Link href="/signup" className={buttonClasses('primary', 'px-6 py-3')}>Get started</Link>
              <Link href="/login" className={buttonClasses('secondary', 'px-6 py-3')}>Log in</Link>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="mb-3 h-8 w-8 rounded-lg bg-indigo-100" />
            <h3 className="font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
