import React from 'react';

export default function About() {
  const pillars = [
    {
      label: 'Focus',
      title: 'Small team. Senior thinking.',
      description: 'You work directly with experienced product designers and systems architects—no middle layers or handoffs to junior staff.'
    },
    {
      label: 'Philosophy',
      title: 'Clarity over novelty.',
      description: 'We believe memorable software is quiet, incredibly fast, and solves the actual problem without performative visual friction.'
    },
    {
      label: 'Craft',
      title: 'Thoughtful execution.',
      description: 'From typography and spacing systems to micro-interaction physics, we obsess over details that turn casual users into brand advocates.'
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Section Header */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <span>// 01 — THE STUDIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight text-zinc-100">
              We operate at the intersection of product strategy, craft, and technology.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Orbitly Studio was founded on the conviction that high-growth technology companies deserve design partners who understand business leverage, engineering feasibility, and user psychology in equal measure.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="divide-y divide-zinc-900">
              {pillars.map((pillar) => (
                <div key={pillar.label} className="py-8 first:pt-0 last:pb-0 group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                      {pillar.label}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium text-zinc-100 mb-3 group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Studio Metrics / Proof Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-900 text-center sm:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-white">100%</p>
                <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">Senior Team</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-white">$2.8B+</p>
                <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">Client Valuation</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-white">8+ Yrs</p>
                <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">Average Exp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
