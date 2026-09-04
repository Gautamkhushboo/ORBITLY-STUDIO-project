import React from 'react';
import { testimonials } from '@/lib/mockData';

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <span>// 05 — PERSPECTIVES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
              Trusted by product leaders
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            What founders and executive product leaders say about collaborating with Orbitly Studio.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <span className="text-emerald-400 text-2xl font-serif block mb-4">“</span>
                <p className="text-zinc-300 text-base leading-relaxed mb-8 font-normal">
                  {item.quote}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-900">
                <p className="text-sm font-medium text-white">{item.author}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {item.role}, <span className="text-zinc-300">{item.company}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
