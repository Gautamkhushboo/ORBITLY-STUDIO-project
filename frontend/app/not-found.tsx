import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-32 sm:py-40">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
            <span>// 404 — NOT FOUND</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white">
            Page not located
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            The requested project or article does not exist or has not yet been published by Orbitly Studio.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all"
            >
              Return to Homepage
            </Link>
            <Link
              href="/#work"
              className="inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider font-semibold rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            >
              Explore Selected Work
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
