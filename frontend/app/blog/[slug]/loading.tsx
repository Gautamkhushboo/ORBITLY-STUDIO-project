import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-32 max-w-4xl mx-auto px-6 sm:px-8 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-8" />
        <div className="space-y-4 mb-10">
          <div className="h-4 w-28 bg-zinc-800 rounded" />
          <div className="h-10 w-4/5 bg-zinc-800 rounded" />
          <div className="h-5 w-full bg-zinc-800/60 rounded" />
        </div>
        <div className="h-[360px] rounded-2xl bg-zinc-900 border border-zinc-800 mb-12" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-zinc-800/60 rounded" />
          <div className="h-4 w-5/6 bg-zinc-800/60 rounded" />
          <div className="h-4 w-4/6 bg-zinc-800/60 rounded" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
