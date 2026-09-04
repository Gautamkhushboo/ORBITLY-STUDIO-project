import React from 'react';
import { services } from '@/lib/mockData';

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <span>// 02 — CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
              Holistic craft across the product lifecycle.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            We partner on end-to-end greenfield builds, strategic redesigns, or targeted design systems engagements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service.number}
              className="group relative rounded-xl border border-zinc-800/70 bg-black/60 p-8 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">
                    {service.number}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-emerald-400 transition-colors" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Deliverable bullets */}
              <div className="pt-6 border-t border-zinc-900/90">
                <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
                  Focus Areas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.deliverables.map((item) => (
                    <span
                      key={item}
                      className="text-xs text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded border border-zinc-800/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
