'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { validateProfile, fieldForApiError } from '@/lib/validate';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Input, { Select } from '@/components/Input';
import Button, { buttonClasses } from '@/components/Button';
import Avatar from '@/components/Avatar';
import { COUNTRIES } from '@/lib/countries';
import { useToast } from '@/components/Toast';

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfile />
    </ProtectedRoute>
  );
}

function EditProfile() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || '',
    country: user.country || '',
  });
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
    const errs = validateProfile(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const data = await api('/users/me', { method: 'PATCH', body: form });
      setUser(data.user);
      toast.success('Profile updated');
      router.push('/profile');
    } catch (err) {
      const field = fieldForApiError(err.message);
      if (field) setErrors({ [field]: err.message });
      else setFormError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit profile</h1>
        <p className="mt-1 text-sm text-slate-600">Update how others see you.</p>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

          <div className="flex items-center gap-4">
            <Avatar src={errors.avatarUrl ? '' : form.avatarUrl} name={form.name} size="md" className="!ring-slate-100" />
            <Input label="Avatar URL" type="url" placeholder="https://example.com/me.jpg" value={form.avatarUrl} onChange={update('avatarUrl')} error={errors.avatarUrl} className="flex-1" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Full name" autoComplete="name" value={form.name} onChange={update('name')} error={errors.name} />
            <Input label="Username" autoComplete="username" value={form.username} onChange={update('username')} error={errors.username} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={update('email')} error={errors.email} />
            <Select label="Country" autoComplete="country-name" value={form.country} onChange={update('country')} error={errors.country}>
              <option value="">Select a country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <Input label="Bio" textarea rows={4} maxLength={300} value={form.bio} onChange={update('bio')} error={errors.bio} hint={`${form.bio.length}/300`} />

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
            <Link href="/profile" className={buttonClasses('secondary')} aria-disabled={loading}>Cancel</Link>
            <Button type="submit" loading={loading}>Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
