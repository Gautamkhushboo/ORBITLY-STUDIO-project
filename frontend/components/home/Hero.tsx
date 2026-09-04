import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-black text-white">
      {/* Subtle radial ambient glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] bg-gradient-to-tr from-emerald-950/20 via-zinc-900/40 to-transparent blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            DIGITAL PRODUCT STUDIO
          </span>
        </div>

        {/* Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white max-w-5xl leading-[1.08] mb-8">
          We design digital products{' '}
          <span className="text-zinc-500 font-normal">people remember.</span>
        </h1>

        {/* Supporting Narrative */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-12">
          Orbitly Studio partners with ambitious teams to turn complex ideas into clear, useful, and beautifully crafted digital experiences.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-20">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-200 active:scale-95"
          >
            Start a project
          </Link>
          <Link
            href="#work"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm uppercase tracking-wider font-semibold rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900/50 transition-all duration-200"
          >
            Explore our work
          </Link>
        </div>

        {/* Hero Visual Showcase — Crafted Design Canvas */}
        <div className="relative rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
          {/* Mock window control bar */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-4 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="ml-3 text-zinc-400">orbitly.canvas // v2.6.4</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500 hidden sm:flex">
              <span>Zoom 100%</span>
              <span className="text-emerald-400">Synced to Figma</span>
            </div>
          </div>

          {/* Grid Layout inside Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Interactive Flow Mockup */}
            <div className="md:col-span-8 rounded-xl bg-zinc-950/90 border border-zinc-800/60 p-6 flex flex-col justify-between min-h-[260px] sm:min-h-[320px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-mono">
                    ✦
                  </div>
                  <span className="text-xs font-medium text-zinc-300">Aura Engine Canvas</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Latency: 14ms
                </span>
              </div>

              <div className="space-y-3 my-6">
                <div className="h-2.5 w-1/3 bg-zinc-800 rounded-full" />
                <div className="h-6 w-3/4 bg-zinc-800/80 rounded" />
                <div className="h-2.5 w-1/2 bg-zinc-800/50 rounded-full" />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-900">
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
                  <p className="text-[10px] uppercase font-mono text-zinc-500">Signal Ratio</p>
                  <p className="text-lg font-semibold text-white mt-1">99.8%</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
                  <p className="text-[10px] uppercase font-mono text-zinc-500">Design Drift</p>
                  <p className="text-lg font-semibold text-emerald-400 mt-1">0.00%</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
                  <p className="text-[10px] uppercase font-mono text-zinc-500">Friction</p>
                  <p className="text-lg font-semibold text-white mt-1">-42%</p>
                </div>
              </div>
            </div>

            {/* Side Design Tokens / Component Inspector */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/60 p-5 flex-1">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                  <span>Design Tokens</span>
                  <span className="text-emerald-400 text-[10px]">Strict Mode</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-zinc-900 text-zinc-400">
                    <span className="font-mono text-zinc-500">type-scale</span>
                    <span className="text-zinc-200">Editorial Modern</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-900 text-zinc-400">
                    <span className="font-mono text-zinc-500">radius-system</span>
                    <span className="text-zinc-200">8px / 12px / 24px</span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-zinc-400">
                    <span className="font-mono text-zinc-500">contrast</span>
                    <span className="text-emerald-400">WCAG AAA (11.4:1)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-zinc-900/60 to-emerald-950/20 border border-zinc-800/60 p-5">
                <p className="text-xs font-mono text-zinc-400 mb-1">Human-Centered</p>
                <p className="text-sm font-medium text-zinc-200 leading-snug">
                  Every interaction is engineered to feel weightless and purposeful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
