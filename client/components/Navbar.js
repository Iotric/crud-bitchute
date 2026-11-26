'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { buttonClasses } from './Button';
import Avatar from './Avatar';

export const APP_NAME = 'Accountly';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">A</span>
      {APP_NAME}
    </Link>
  );
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !menuRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {loading ? null : user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <Avatar src={user.avatarUrl} name={user.name} size="sm" className="!ring-0" />
              <span className="hidden text-sm font-medium text-slate-700 sm:block">{user.name.split(' ')[0]}</span>
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">@{user.username}</p>
                </div>
                <Link href="/profile" role="menuitem" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Profile
                </Link>
                <button role="menuitem" onClick={() => logout('/login')} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonClasses('ghost')}>Log in</Link>
            <Link href="/signup" className={buttonClasses('primary')}>Sign up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
