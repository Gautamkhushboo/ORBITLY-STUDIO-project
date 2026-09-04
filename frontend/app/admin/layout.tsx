'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearStoredAuth, getStoredUser, AdminUser } from '@/lib/api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!isLoginPage) {
      const user = getStoredUser();
      setCurrentUser(user);
    }
  }, [isLoginPage]);

  const handleLogout = () => {
    clearStoredAuth();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Blog Posts', href: '/admin/blog' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Admin Header Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-white font-medium tracking-tight text-base group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-zinc-100">
                Orbitly<span className="text-zinc-500 ml-1 font-normal">Admin</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors ${
                      isActive
                        ? 'text-emerald-400 font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {currentUser && (
              <span className="text-zinc-400 hidden sm:inline-block">
                {currentUser.email}
              </span>
            )}
            <Link
              href="/"
              target="_blank"
              className="text-zinc-500 hover:text-zinc-300 hidden sm:inline-block transition-colors"
            >
              View Live Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 bg-zinc-900/60 transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation sub-bar */}
        <div className="md:hidden flex items-center gap-4 px-6 py-2 border-t border-zinc-900/80 text-xs font-mono overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap py-1 ${
                pathname === item.href ? 'text-emerald-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="text-zinc-500 ml-auto whitespace-nowrap">
            Live Site ↗
          </Link>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
