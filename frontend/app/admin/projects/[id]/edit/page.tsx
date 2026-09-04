'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getAdminProjects, updateAdminProject, Project } from '@/lib/api';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    heroImage: '',
    category: 'Product Design',
    tags: '',
    services: '',
    year: 2026,
    challenge: '',
    approach: '',
    solution: '',
    outcome: '',
    images: '',
    featured: false,
    published: true,
  });

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError(null);
      const res = await getAdminProjects();
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const existing = (res.data || []).find((p) => p.id === id);
      if (!existing) {
        setError('Project not found');
        setLoading(false);
        return;
      }

      setForm({
        title: existing.title || '',
        slug: existing.slug || '',
        shortDescription: existing.shortDescription || '',
        description: existing.description || '',
        thumbnail: existing.image || '',
        heroImage: existing.image || '',
        category: existing.category || 'Product Design',
        tags: (existing.tags || []).join(', '),
        services: (existing.services || []).join(', '),
        year: existing.year || 2026,
        challenge: existing.challenge || '',
        approach: existing.approach || '',
        solution: existing.solution || '',
        outcome: existing.outcome || '',
        images: (existing.images || []).join('\n'),
        featured: Boolean(existing.featured),
        published: Boolean(existing.published),
      });
      setLoading(false);
    }

    if (id) {
      loadProject();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setSubmitting(true);

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

    const res = await updateAdminProject(id, payload);
    setSubmitting(false);

    if (res.success) {
      setSuccess('Project updated successfully.');
      setTimeout(() => router.push('/admin/projects'), 1200);
    } else {
      setError(res.error || 'Failed to update project');
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-900 rounded" />
        <div className="h-96 bg-zinc-950/80 rounded-2xl border border-zinc-800" />
      </div>
    );
  }

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
            Edit Project
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">ID: {id}</p>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-300 font-mono">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3 text-xs text-red-300 font-mono">
          ⚠ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Details */}
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
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
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
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Media & Tags */}
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
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
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
                Published Visibility
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
                Featured Case Study
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
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
