'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-zinc-800/80 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-medium tracking-tight text-lg group"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform duration-300" />
          <span className="tracking-tighter font-semibold text-zinc-100">
            Orbitly<span className="text-zinc-500 ml-1 font-normal">Studio</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 active:scale-95"
          >
            Start a project
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white focus:outline-none"
        >
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-black/95 backdrop-blur-xl px-6 py-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-zinc-300 hover:text-white py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-900">
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-5 py-3 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all"
              >
                Start a project
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
