'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { isUrl } from '@/lib/validate';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { useToast } from '@/components/Toast';

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <Onboarding />
    </ProtectedRoute>
  );
}

const STEPS = ['Profile photo', 'About you'];

function Onboarding() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [bio, setBio] = useState(user.bio || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(null); // 'skip' | 'finish' | null

  const avatarError = avatarUrl && !isUrl(avatarUrl) ? 'Please enter a valid http(s) URL' : '';

  async function complete(kind) {
    setError('');
    const body = kind === 'finish' ? { avatarUrl: avatarUrl.trim(), bio: bio.trim(), onboarded: true } : { onboarded: true };
    setSaving(kind);
    try {
      const data = await api('/users/me', { method: 'PATCH', body });
      setUser(data.user);
      if (kind === 'finish') toast.success('Your profile is all set!');
      router.push('/profile');
    } catch (err) {
      setError(err.message);
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-sm text-slate-600">Let’s finish setting up your profile.</p>
      </div>

      <Card>
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium">
            {STEPS.map((label, i) => (
              <span key={label} className={i <= step ? 'text-indigo-600' : 'text-slate-400'}>
                Step {i + 1} · {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
            <div className="h-full rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {step === 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar src={avatarError ? '' : avatarUrl} name={user.name} size="lg" className="!ring-slate-100" />
              <p className="text-xs text-slate-500">Live preview</p>
            </div>
            <Input
              label="Avatar URL"
              type="url"
              placeholder="https://example.com/me.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              error={avatarError}
              hint="Paste a link to an image. Leave empty to use your initials."
            />
          </div>
        ) : (
          <Input
            label="Bio"
            textarea
            rows={5}
            maxLength={300}
            placeholder="A sentence or two about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            hint={`${bio.length}/300`}
          />
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step === 0 ? (
            <span />
          ) : (
            <Button variant="ghost" onClick={() => setStep(0)} disabled={!!saving}>Back</Button>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => complete('skip')} loading={saving === 'skip'} disabled={!!saving}>
              Skip
            </Button>
            {step === 0 ? (
              <Button onClick={() => setStep(1)} disabled={!!avatarError}>Next</Button>
            ) : (
              <Button onClick={() => complete('finish')} loading={saving === 'finish'} disabled={!!saving}>Finish</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
