import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-8" />
        <div className="space-y-4 mb-12 max-w-3xl">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-12 w-3/4 bg-zinc-800 rounded" />
          <div className="h-6 w-full bg-zinc-800/60 rounded" />
        </div>
        <div className="h-[400px] rounded-2xl bg-zinc-900 border border-zinc-800 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-64 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          <div className="lg:col-span-8 h-96 rounded-xl bg-zinc-900/60 border border-zinc-800" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
