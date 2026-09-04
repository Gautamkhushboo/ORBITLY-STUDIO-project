'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getAdminBlogPosts, updateAdminBlogPost, BlogPost } from '@/lib/api';

export default function EditBlogPage() {
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
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Product Strategy',
    author: 'Orbitly Studio',
    tags: '',
    featured: false,
    published: true,
  });

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);
      const res = await getAdminBlogPosts();
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const existing = (res.data || []).find((b) => b.id === id);
      if (!existing) {
        setError('Article not found');
        setLoading(false);
        return;
      }

      setForm({
        title: existing.title || '',
        slug: existing.slug || '',
        excerpt: existing.excerpt || '',
        content: existing.content || '',
        featuredImage: existing.featuredImage || '',
        category: existing.category || 'Product Strategy',
        author: existing.author || 'Orbitly Studio',
        tags: (existing.tags || []).join(', '),
        featured: Boolean(existing.featured),
        published: Boolean((existing as any).published),
      });
      setLoading(false);
    }

    if (id) {
      loadArticle();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setSubmitting(true);

    const payload: Partial<BlogPost> & Record<string, any> = {
      title: form.title,
      slug: form.slug.toLowerCase().trim(),
      excerpt: form.excerpt,
      content: form.content,
      featuredImage: form.featuredImage,
      category: form.category,
      author: form.author,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published,
    };

    const res = await updateAdminBlogPost(id, payload);
    setSubmitting(false);

    if (res.success) {
      setSuccess('Article updated successfully.');
      setTimeout(() => router.push('/admin/blog'), 1200);
    } else {
      setError(res.error || 'Failed to update article');
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
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
          >
            ← Back to Articles
          </Link>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Edit Article
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
        {/* Core Article Details */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-medium text-white pb-3 border-b border-zinc-900">
            1. Title & Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Article Title *
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
                Author *
              </label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Summary / Excerpt *
            </label>
            <input
              type="text"
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Media & Tags */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-medium text-white pb-3 border-b border-zinc-900">
            2. Media & Tags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Featured Cover Image URL
              </label>
              <input
                type="url"
                value={form.featuredImage}
                onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>

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
          </div>
        </div>

        {/* Article Body */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-medium text-white pb-3 border-b border-zinc-900">
            3. Article Content (Markdown Supported)
          </h2>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Body Content *
            </label>
            <textarea
              rows={12}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm font-mono text-zinc-200 leading-relaxed focus:border-emerald-400 focus:outline-none"
            />
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
                Mark as Featured
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog"
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
