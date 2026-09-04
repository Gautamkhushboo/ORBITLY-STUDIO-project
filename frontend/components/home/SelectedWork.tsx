'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types';
import { getProjects } from '@/lib/api';

export default function SelectedWork() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      const res = await getProjects();
      if (!isMounted) return;
      if (res.error) {
        setError('Unable to load our latest work right now.');
      } else {
        setProjects(res.data);
      }
      setLoading(false);
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProject = projects.find((p) => p.featured) || (projects.length > 0 ? projects[0] : null);
  const gridProjects = featuredProject
    ? projects.filter((p) => p.id !== featuredProject.id)
    : [];

  return (
    <section id="work" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <span>// 03 — CASE STUDIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
              Selected work
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            Digital products and experiences designed with clarity, purpose, and measurable outcomes.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="h-96 rounded-2xl bg-zinc-900/60 border border-zinc-800" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-72 rounded-xl bg-zinc-900/40 border border-zinc-800" />
              <div className="h-72 rounded-xl bg-zinc-900/40 border border-zinc-800" />
            </div>
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
        {!loading && !error && projects.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <p className="text-zinc-300 text-base mb-2">No projects available yet.</p>
            <p className="text-xs font-mono text-zinc-500">
              Our latest case studies will appear here once published.
            </p>
          </div>
        )}

        {/* Content: Featured Project Showcase */}
        {!loading && !error && featuredProject && (
          <div className="mb-12 group rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden hover:border-zinc-700 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-12">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/30">
                    Featured Project
                  </span>
                  {featuredProject.client && (
                    <span className="text-xs font-mono text-zinc-400">
                      // {featuredProject.client}
                    </span>
                  )}
                  <span className="text-xs font-mono text-zinc-500">{featuredProject.year}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white group-hover:text-emerald-300 transition-colors">
                  {featuredProject.title}
                </h3>

                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {featuredProject.description || featuredProject.shortDescription}
                </p>

                {featuredProject.metrics && (
                  <div className="inline-block p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <p className="text-[11px] font-mono text-zinc-500 uppercase">Impact Metric</p>
                    <p className="text-sm font-semibold text-emerald-400 mt-0.5">{featuredProject.metrics}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {featuredProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/projects/${featuredProject.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors"
                  >
                    <span>View Case Study</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>

              {/* Visual Thumbnail */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] rounded-xl overflow-hidden border border-zinc-800">
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Content: Remaining Projects Grid */}
        {!loading && !error && gridProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gridProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden border border-zinc-800/80 mb-6">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono text-zinc-300 border border-zinc-700/50">
                      {project.year}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                      {project.category}
                    </p>
                    <h3 className="text-xl font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom Tags & Metrics */}
                <div className="pt-6 border-t border-zinc-900 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2.5 py-0.5 rounded border border-zinc-800/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 group-hover:text-white transition-colors"
                  >
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
