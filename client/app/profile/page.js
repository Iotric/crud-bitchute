'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Button, { buttonClasses } from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}

function Profile() {
  const { user, logout } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="!p-0 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600" />
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Avatar src={user.avatarUrl} name={user.name} size="lg" />
            <div className="flex flex-wrap gap-2">
              <Link href="/profile/edit" className={buttonClasses('primary')}>Edit profile</Link>
              <Link href="/profile/password" className={buttonClasses('secondary')}>Change password</Link>
              <Button variant="ghost" onClick={() => logout('/login')}>Log out</Button>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-sm text-slate-500">@{user.username}</p>
          </div>

          <p className={`mt-4 whitespace-pre-line text-sm leading-relaxed ${user.bio ? 'text-slate-700' : 'italic text-slate-400'}`}>
            {user.bio || 'No bio yet.'}
          </p>

          <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 truncate text-sm text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Country</dt>
              <dd className={`mt-1 text-sm ${user.country ? 'text-slate-900' : 'italic text-slate-400'}`}>{user.country || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Member since</dt>
              <dd className="mt-1 text-sm text-slate-900">{memberSince}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <Card className="border-red-200/70">
        <h2 className="text-base font-semibold text-red-600">Danger zone</h2>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Permanently delete your account and all of its data. This can’t be undone.</p>
          <Button variant="dangerOutline" onClick={() => setDeleteOpen(true)} className="shrink-0">Delete account</Button>
        </div>
      </Card>

      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
}

function DeleteAccountModal({ open, onClose }) {
  const { logout } = useAuth();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    if (loading) return;
    setPassword('');
    setError('');
    onClose();
  }, [loading, onClose]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!password) return setError('Please enter your password');
    setError('');
    setLoading(true);
    try {
      await api('/users/me', { method: 'DELETE', body: { password }, skipAuthRedirect: true });
      logout('/');
      toast.success('Your account has been deleted.');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={close} title="Delete your account?">
      <form onSubmit={onSubmit} className="space-y-5">
        <p className="text-sm text-slate-600">
          This permanently removes your profile. Enter your password to confirm.
        </p>
        <Input label="Password" type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="danger" loading={loading}>Delete account</Button>
        </div>
      </form>
    </Modal>
  );
}
