import React from 'react';

export default function ContactCTA() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-950/20 blur-3xl pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black p-8 sm:p-12 lg:p-16 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-6">
              <span>// 07 — INITIATION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
              Have a product worth building?
            </h2>

            <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed mb-10 max-w-2xl">
              Let&apos;s turn the idea into something people want to use. We partner with a limited number of ambitious teams each quarter.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <a
                href="mailto:inquiries@orbitlystudio.com"
                className="inline-flex items-center justify-center px-8 py-4 text-sm uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-200 active:scale-95 text-center"
              >
                Start a conversation
              </a>
              <span className="text-xs font-mono text-zinc-500 text-center sm:text-left">
                Typical reply window: &lt; 24 hours
              </span>
            </div>

            {/* Direct Contact Card Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-900 text-xs font-mono">
              <div>
                <p className="text-zinc-500 uppercase">Direct Email</p>
                <a
                  href="mailto:inquiries@orbitlystudio.com"
                  className="text-zinc-300 hover:text-white mt-1 block"
                >
                  inquiries@orbitlystudio.com
                </a>
              </div>
              <div>
                <p className="text-zinc-500 uppercase">Studio Location</p>
                <p className="text-zinc-300 mt-1">San Francisco • Remote Worldwide</p>
              </div>
              <div>
                <p className="text-zinc-500 uppercase">Current Capacity</p>
                <p className="text-emerald-400 mt-1">Open for Q4 Engagements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
