'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { validateProfile, validateNewPassword, fieldForApiError } from '@/lib/validate';
import { GuestOnly } from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function SignupPage() {
  return (
    <GuestOnly>
      <SignupForm />
    </GuestOnly>
  );
}

function SignupForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
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
    const { name, username, email, password, confirm } = form;
    const errs = { ...validateProfile({ name, username, email }), ...validateNewPassword(password, confirm) };
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const data = await api('/auth/signup', { method: 'POST', body: { name, username, email, password } });
      login(data.token, data.user); // GuestOnly then sends the new user to onboarding
    } catch (err) {
      const field = fieldForApiError(err.message);
      if (field) setErrors({ [field]: err.message });
      else setFormError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">It only takes a minute.</p>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <Input label="Full name" autoComplete="name" value={form.name} onChange={update('name')} error={errors.name} />
          <Input label="Username" autoComplete="username" value={form.username} onChange={update('username')} error={errors.username} hint="Letters, numbers and underscores." />
          <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={update('email')} error={errors.email} />
          <Input label="Password" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} error={errors.password} hint="At least 8 characters." />
          <Input label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />
          <Button type="submit" loading={loading} className="w-full">Create account</Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Log in</Link>
      </p>
    </div>
  );
}
