'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { validateNewPassword } from '@/lib/validate';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button, { buttonClasses } from '@/components/Button';
import { useToast } from '@/components/Toast';

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  );
}

function ChangePassword() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ current: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((errs) => ({ ...errs, [key]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const errs = validateNewPassword(form.password, form.confirm);
    if (!form.current) errs.current = 'Current password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await api('/users/me/password', {
        method: 'PATCH',
        body: { currentPassword: form.current, newPassword: form.password },
        skipAuthRedirect: true, // a 401 here means "wrong current password"
      });
      toast.success('Password changed');
      router.push('/profile');
    } catch (err) {
      if (err.status === 401) setErrors({ current: err.message });
      else setFormError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Change password</h1>
        <p className="mt-1 text-sm text-slate-600">Choose a strong password you don’t use elsewhere.</p>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <Input label="Current password" type="password" autoComplete="current-password" value={form.current} onChange={update('current')} error={errors.current} />
          <Input label="New password" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} error={errors.password} hint="At least 8 characters." />
          <Input label="Confirm new password" type="password" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
            <Link href="/profile" className={buttonClasses('secondary')}>Cancel</Link>
            <Button type="submit" loading={loading}>Update password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
