'use client';

import { useId, useState } from 'react';

export default function Input({ label, error, hint, type = 'text', textarea = false, className = '', ...props }) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const fieldClass = `block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm
    placeholder:text-slate-400 focus:outline-none focus:ring-4 transition
    ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'}
    ${isPassword ? 'pr-16' : ''}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {textarea ? (
          <textarea id={id} aria-invalid={!!error} aria-describedby={describedBy} className={`${fieldClass} resize-none`} {...props} />
        ) : (
          <input
            id={id}
            type={isPassword && show ? 'text' : type}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={fieldClass}
            {...props}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 px-3.5 text-xs font-semibold text-slate-500 hover:text-indigo-600"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Select({ label, error, className = '', children, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-4 transition
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'}`}
        {...props}
      >
        {children}
      </select>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
