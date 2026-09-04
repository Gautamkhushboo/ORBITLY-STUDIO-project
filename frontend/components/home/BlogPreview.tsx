'use client';

import React, { useEffect, useState } from 'react';
import { BlogPost } from '@/types';
import { getBlogPosts } from '@/lib/api';

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      const res = await getBlogPosts();
      if (!isMounted) return;
      if (res.error) {
        setError('Unable to load our latest articles right now.');
      } else {
        setPosts(res.data);
      }
      setLoading(false);
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="blog" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <span>// 06 — WRITING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
              Thinking & studio notes
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            Observations on software design, design systems architecture, and product strategy.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="h-64 rounded-xl bg-zinc-900/50 border border-zinc-800" />
            <div className="h-64 rounded-xl bg-zinc-900/50 border border-zinc-800" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <p className="text-zinc-300 text-base mb-2">{error}</p>
            <p className="text-xs font-mono text-zinc-500">
              Please refresh or check back shortly.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <p className="text-zinc-300 text-base mb-2">No articles available yet.</p>
            <p className="text-xs font-mono text-zinc-500">
              New writing and studio perspectives will be published soon.
            </p>
          </div>
        )}

        {/* Content: Blog Cards Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-xl border border-zinc-800/80 bg-black/50 p-8 flex flex-col justify-between hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 mb-4">
                    <span className="text-emerald-400">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-white group-hover:text-emerald-300 transition-colors mb-4 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-8 border-t border-zinc-900 mt-8 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                    Read Article
                  </span>
                  <span className="text-zinc-400 group-hover:translate-x-1 group-hover:text-white transition-all">
                    →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
