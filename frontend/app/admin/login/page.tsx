'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAdmin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginAdmin({ email, password });
    setLoading(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 py-12 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white font-medium tracking-tight text-lg mb-4"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-zinc-100">
              Orbitly<span className="text-zinc-500 ml-1 font-normal">Studio</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Admin Console
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Sign in with authorized administrator credentials to manage portfolio and articles.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-300 font-mono leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2"
              >
                Administrator Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-zinc-100 py-3.5 text-xs uppercase tracking-wider font-semibold text-zinc-950 hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
