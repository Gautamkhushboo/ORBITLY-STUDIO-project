'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin, getAdminProjects, getAdminBlogPosts, Project, BlogPost } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      setAuthError(null);

      // Verify authentication
      const auth = await getCurrentAdmin();
      if (!isMounted) return;

      if (auth.status === 401 || !auth.data) {
        router.push('/admin/login');
        return;
      }

      if (auth.status === 403) {
        setAuthError('Access Denied: Administrator role required.');
        setLoading(false);
        return;
      }

      // Fetch dashboard data
      const [projRes, blogRes] = await Promise.all([
        getAdminProjects(),
        getAdminBlogPosts(),
      ]);

      if (!isMounted) return;
      setProjects(projRes.data || []);
      setBlogs(blogRes.data || []);
      setLoading(false);
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (authError) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-12 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-medium text-red-400 mb-2">Access Restricted</h2>
        <p className="text-zinc-400 text-sm mb-6">{authError}</p>
        <Link
          href="/admin/login"
          className="inline-flex px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-xs font-semibold uppercase tracking-wider"
        >
          Sign in with another account
        </Link>
      </div>
    );
  }

  // Summary Metrics
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const draftProjects = totalProjects - publishedProjects;

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.published).length;
  const draftBlogs = totalBlogs - publishedBlogs;

  return (
    <div className="space-y-10">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            <span>// ADMIN OVERVIEW</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Studio Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time summary of projects, publications, and draft status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95"
          >
            + New Project
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
          >
            + New Article
          </Link>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          ))}
        </div>
      )}

      {/* Metric Cards */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
              Total Projects
            </p>
            <p className="text-3xl font-semibold text-white mt-2">{totalProjects}</p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5">
            <p className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider">
              Published Work
            </p>
            <p className="text-3xl font-semibold text-emerald-400 mt-2">
              {publishedProjects}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5">
            <p className="text-[11px] font-mono uppercase text-amber-400 tracking-wider">
              Draft Work
            </p>
            <p className="text-3xl font-semibold text-amber-400 mt-2">{draftProjects}</p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5">
            <p className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
              Total Articles
            </p>
            <p className="text-3xl font-semibold text-white mt-2">{totalBlogs}</p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5">
            <p className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider">
              Published Notes
            </p>
            <p className="text-3xl font-semibold text-emerald-400 mt-2">
              {publishedBlogs}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-5">
            <p className="text-[11px] font-mono uppercase text-amber-400 tracking-wider">
              Draft Notes
            </p>
            <p className="text-3xl font-semibold text-amber-400 mt-2">{draftBlogs}</p>
          </div>
        </div>
      )}

      {/* Recent Work and Articles Overview Grids */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Recent Projects Table Preview */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Recent Projects</h2>
              <Link
                href="/admin/projects"
                className="text-xs font-mono text-emerald-400 hover:underline"
              >
                Manage All ({totalProjects}) →
              </Link>
            </div>

            <div className="divide-y divide-zinc-900 text-sm">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200 truncate">{p.title}</p>
                    <p className="text-xs font-mono text-zinc-500">{p.category} • {p.year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        p.published
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="text-xs font-mono text-zinc-400 hover:text-white p-1"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-xs font-mono text-zinc-500 py-4">No projects found.</p>
              )}
            </div>
          </div>

          {/* Recent Articles Table Preview */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Recent Articles</h2>
              <Link
                href="/admin/blog"
                className="text-xs font-mono text-emerald-400 hover:underline"
              >
                Manage All ({totalBlogs}) →
              </Link>
            </div>

            <div className="divide-y divide-zinc-900 text-sm">
              {blogs.slice(0, 5).map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200 truncate">{b.title}</p>
                    <p className="text-xs font-mono text-zinc-500">{b.category} • {b.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        b.published
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      href={`/admin/blog/${b.id}/edit`}
                      className="text-xs font-mono text-zinc-400 hover:text-white p-1"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <p className="text-xs font-mono text-zinc-500 py-4">No articles found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
