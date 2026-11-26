'use client';

import { useEffect, useState } from 'react';

export function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
}

const SIZES = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-24 w-24 text-3xl',
};

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);

  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-4 ring-white ${SIZES[size]} ${className}`;

  if (src && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ? `${name}'s avatar` : 'Avatar'} onError={() => setBroken(true)} className={`${base} object-cover`} />;
  }

  return (
    <span className={`${base} bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white`} aria-label={name ? `${name}'s avatar` : 'Avatar'}>
      {initials(name)}
    </span>
  );
}
