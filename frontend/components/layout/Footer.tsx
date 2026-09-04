import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 text-sm py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-zinc-900">
          {/* Studio Bio */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white font-medium tracking-tight text-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="tracking-tighter font-semibold text-zinc-100">
                Orbitly<span className="text-zinc-500 ml-1 font-normal">Studio</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              An independent digital design and product studio crafting software, brand systems, and web flagships with senior rigor and human clarity.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for select Q4 engagements
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#work" className="hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition-colors">
                  Capabilities & Services
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  Studio Philosophy
                </Link>
              </li>
              <li>
                <Link href="#process" className="hover:text-white transition-colors">
                  How We Work
                </Link>
              </li>
              <li>
                <Link href="#blog" className="hover:text-white transition-colors">
                  Perspectives & Writing
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Connect
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-zinc-300 font-mono text-xs">
                inquiries@orbitlystudio.com
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  X / Twitter
                </a>
                <span className="text-zinc-800">•</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <span className="text-zinc-800">•</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {currentYear} Orbitly Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Crafted with craft & restraint</span>
            <span>TypeScript • Next.js App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
