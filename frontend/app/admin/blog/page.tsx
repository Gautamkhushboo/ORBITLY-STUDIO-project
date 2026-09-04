'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getCurrentAdmin,
  getAdminBlogPosts,
  updateAdminBlogPost,
  deleteAdminBlogPost,
  BlogPost,
} from '@/lib/api';

export default function AdminBlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Delete modal state
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    const res = await getAdminBlogPosts();
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    if (res.error) {
      setError(res.error);
    } else {
      setBlogs(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function init() {
      const auth = await getCurrentAdmin();
      if (auth.status === 401 || !auth.data) {
        router.push('/admin/login');
        return;
      }
      fetchBlogs();
    }
    init();
  }, [router]);

  // Toggle publish
  const handleTogglePublish = async (post: BlogPost) => {
    setActionLoading(post.id);
    const updatedStatus = !post.featured; // Wait, post.featured or post.published?
    // Let's check BlogPost type in index.ts: published is in the backend, let's pass published: !Boolean(post.published)
    const nextPublished = !(post as any).published;
    const res = await updateAdminBlogPost(post.id, {
      ...post,
      published: nextPublished,
    } as any);
    setActionLoading(null);

    if (res.success) {
      setSuccess(`Article "${post.title}" ${nextPublished ? 'published' : 'moved to drafts'}.`);
      setBlogs((prev) =>
        prev.map((b) => (b.id === post.id ? { ...b, published: nextPublished } as any : b))
      );
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to update article status.');
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (post: BlogPost) => {
    setActionLoading(post.id);
    const updatedFeatured = !post.featured;
    const res = await updateAdminBlogPost(post.id, {
      featured: updatedFeatured,
    });
    setActionLoading(null);

    if (res.success) {
      setSuccess(`Article "${post.title}" ${updatedFeatured ? 'marked featured' : 'unfeatured'}.`);
      setBlogs((prev) =>
        prev.map((b) => (b.id === post.id ? { ...b, featured: updatedFeatured } : b))
      );
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to update featured state.');
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setActionLoading(blogToDelete.id);
    const res = await deleteAdminBlogPost(blogToDelete.id);
    setActionLoading(null);

    if (res.success) {
      setSuccess(`Article "${blogToDelete.title}" deleted.`);
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      setBlogToDelete(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to delete article.');
      setBlogToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <span>// EDITORIAL</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Blog Post Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage thought-leadership articles, editorial notes, and publication states.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95"
        >
          + Create Article
        </Link>
      </div>

      {/* Notifications */}
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

      {/* Loading Skeletons */}
      {loading && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-zinc-900/60" />
          ))}
        </div>
      )}

      {/* Blogs Table */}
      {!loading && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-900 bg-zinc-900/40 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Article Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/80">
                {blogs.map((b: any) => (
                  <tr
                    key={b.id}
                    className="hover:bg-zinc-900/30 transition-colors text-zinc-300"
                  >
                    <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                      {b.title}
                      <span className="block text-xs font-mono text-zinc-500 font-normal">
                        /{b.slug}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-zinc-400">{b.category}</td>
                    <td className="py-4 px-4 text-xs font-mono text-zinc-400">{b.author || 'Orbitly'}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(b)}
                        disabled={actionLoading === b.id}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                          b.published
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                        }`}
                      >
                        {b.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(b)}
                        disabled={actionLoading === b.id}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                          b.featured
                            ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                            : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        {b.featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/admin/blog/${b.id}/edit`}
                        className="inline-block text-xs font-mono px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setBlogToDelete(b)}
                        className="text-xs font-mono px-3 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 transition-colors border border-red-500/30"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-500 text-sm font-mono">
                      No articles found. Create your first article above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400">
              <span>⚠ CONFIRM DELETION</span>
            </div>
            <h3 className="text-xl font-medium text-white">
              Delete &quot;{blogToDelete.title}&quot;?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete this article? This action cannot be undone and will permanently remove this piece.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 rounded-full border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading === blogToDelete.id}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-xs font-semibold uppercase tracking-wider text-white transition-all active:scale-95"
              >
                {actionLoading === blogToDelete.id ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
