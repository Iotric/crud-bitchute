'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { GuestOnly } from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } });
      login(data.token, data.user); // GuestOnly redirects to onboarding or profile
    } catch (err) {
      setFormError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Log in to your account.</p>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <Button type="submit" loading={loading} className="w-full">Log in</Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-slate-600">
        New here? <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">Create an account</Link>
      </p>
    </div>
  );
}
