import React from 'react';
import { processSteps } from '@/lib/mockData';

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <span>// 04 — METHODOLOGY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
              How we work
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            A disciplined, four-phase engagement model calibrated to remove ambiguity and maximize velocity.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-xl border border-zinc-800/80 bg-black/60 p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <span className="text-2xl font-mono font-semibold text-zinc-600 block mb-6">
                  {step.number}
                </span>
                <h3 className="text-xl font-medium text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs font-mono text-emerald-400 mb-4">
                  {step.summary}
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-600">
                <span>Phase {step.number}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
