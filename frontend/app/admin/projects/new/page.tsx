'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createAdminProject, Project } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    heroImage: '',
    category: 'Product Design',
    tags: 'UI/UX, Mobile, Web',
    services: 'Product Strategy, UX/UI Design',
    year: 2026,
    challenge: '',
    approach: '',
    solution: '',
    outcome: '',
    images: '',
    featured: false,
    published: true,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug === generateSlug(prev.title) || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const payload: Partial<Project> & Record<string, any> = {
      title: form.title,
      slug: form.slug.toLowerCase().trim(),
      shortDescription: form.shortDescription,
      description: form.description,
      thumbnail: form.thumbnail || form.heroImage,
      heroImage: form.heroImage,
      category: form.category,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
      year: Number(form.year),
      challenge: form.challenge,
      approach: form.approach,
      solution: form.solution,
      outcome: form.outcome,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published,
    };

    const res = await createAdminProject(payload);
    setLoading(false);

    if (res.success) {
      router.push('/admin/projects');
    } else {
      setError(res.error || 'Failed to create project');
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Create New Project
          </h1>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3 text-xs text-red-300 font-mono">
          ⚠ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-medium text-white pb-3 border-b border-zinc-900">
            1. Core Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Apex Financial Terminal"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
              {fieldErrors['title'] && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors['title']}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="apex-financial-terminal"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
              />
              {fieldErrors['slug'] && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors['slug']}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Category *
              </label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Product Design"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Year *
              </label>
              <input
                type="number"
                required
                min={2000}
                max={2100}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Short Description (Card Excerpt) *
            </label>
            <input
              type="text"
              required
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Frictionless wealth-tech mobile app design with intuitive charts."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
            {fieldErrors['shortDescription'] && (
              <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors['shortDescription']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Full Project Overview *
            </label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Comprehensive narrative describing the project scope, background, and objectives."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
            {fieldErrors['description'] && (
              <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors['description']}</p>
            )}
          </div>
        </div>

        {/* Media & Tags Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-medium text-white pb-3 border-b border-zinc-900">
            2. Imagery & Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Hero Image URL
              </label>
              <input
                type="url"
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Fintech, Mobile, UI/UX"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Services (Comma-separated)
              </label>
              <input
                type="text"
                value={form.services}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
                placeholder="UI/UX Design, Design Systems"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Additional Image URLs (One per line)
            </label>
            <textarea
              rows={3}
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Case Study Narrative Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-medium text-white pb-3 border-b border-zinc-900">
            3. Case Study Breakdown (Optional but Recommended)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                01 — The Challenge
              </label>
              <textarea
                rows={3}
                value={form.challenge}
                onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                placeholder="Core obstacles and bottlenecks faced by the team."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                02 — Our Approach
              </label>
              <textarea
                rows={3}
                value={form.approach}
                onChange={(e) => setForm({ ...form, approach: e.target.value })}
                placeholder="Strategic frameworks and design methodology applied."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                03 — The Solution
              </label>
              <textarea
                rows={3}
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                placeholder="The shipped artifact, interface architecture, or product features."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                04 — The Outcome / Impact Metric
              </label>
              <textarea
                rows={3}
                value={form.outcome}
                onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                placeholder="+40% increase in daily active users"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visibility Toggles & Action */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="text-sm font-mono text-zinc-300">
                Published immediately
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-purple-500 rounded"
              />
              <span className="text-sm font-mono text-zinc-300">
                Mark as Featured
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/projects"
              className="px-5 py-2.5 rounded-full border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Publish Project'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
