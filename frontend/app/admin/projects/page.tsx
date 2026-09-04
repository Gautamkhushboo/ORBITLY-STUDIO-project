'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getCurrentAdmin,
  getAdminProjects,
  updateAdminProject,
  deleteAdminProject,
  Project,
} from '@/lib/api';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    const res = await getAdminProjects();
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    if (res.error) {
      setError(res.error);
    } else {
      setProjects(res.data);
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
      fetchProjects();
    }
    init();
  }, [router]);

  // Toggle publish
  const handleTogglePublish = async (project: Project) => {
    setActionLoading(project.id);
    const updatedStatus = !project.published;
    const res = await updateAdminProject(project.id, {
      published: updatedStatus,
    });
    setActionLoading(null);

    if (res.success) {
      setSuccess(`Project "${project.title}" ${updatedStatus ? 'published' : 'moved to drafts'}.`);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: updatedStatus } : p))
      );
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to update project status.');
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (project: Project) => {
    setActionLoading(project.id);
    const updatedFeatured = !project.featured;
    const res = await updateAdminProject(project.id, {
      featured: updatedFeatured,
    });
    setActionLoading(null);

    if (res.success) {
      setSuccess(`Project "${project.title}" ${updatedFeatured ? 'marked featured' : 'unfeatured'}.`);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: updatedFeatured } : p))
      );
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to update featured state.');
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setActionLoading(projectToDelete.id);
    const res = await deleteAdminProject(projectToDelete.id);
    setActionLoading(null);

    if (res.success) {
      setSuccess(`Project "${projectToDelete.title}" deleted.`);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to delete project.');
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <span>// PORTFOLIO</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Project Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage case studies, publication visibility, and featured highlights.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95"
        >
          + Create Project
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

      {/* Projects Table */}
      {!loading && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-900 bg-zinc-900/40 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Project Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/80">
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-900/30 transition-colors text-zinc-300"
                  >
                    <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                      {p.title}
                      <span className="block text-xs font-mono text-zinc-500 font-normal">
                        /{p.slug}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-zinc-400">{p.category}</td>
                    <td className="py-4 px-4 text-xs font-mono text-zinc-400">{p.year}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        disabled={actionLoading === p.id}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                          p.published
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        disabled={actionLoading === p.id}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                          p.featured
                            ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                            : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        {p.featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="inline-block text-xs font-mono px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setProjectToDelete(p)}
                        className="text-xs font-mono px-3 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 transition-colors border border-red-500/30"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-500 text-sm font-mono">
                      No projects found. Create your first case study above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400">
              <span>⚠ CONFIRM DELETION</span>
            </div>
            <h3 className="text-xl font-medium text-white">
              Delete &quot;{projectToDelete.title}&quot;?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete this project? This action cannot be undone and will permanently remove this case study.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-full border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading === projectToDelete.id}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-xs font-semibold uppercase tracking-wider text-white transition-all active:scale-95"
              >
                {actionLoading === projectToDelete.id ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
