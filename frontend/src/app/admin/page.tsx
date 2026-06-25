'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import ProjectForm from '@/components/admin/ProjectForm';
import SubcategoryManager from '@/components/admin/SubcategoryManager';
import type { Project, Subcategory } from '@/types';
import {
  createProject,
  deleteProject,
  getAdminProjects,
  getAdminSubcategories,
  updateProject,
} from '@/lib/api';
import { CATEGORY_LABELS } from '@/lib/categories';
import { resolveImageUrl } from '@/lib/images';
import { useAuth } from '@/lib/auth-context';

type AdminTab = 'projects' | 'subcategories';

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}

function AdminDashboard() {
  const { logout, getToken } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await getAdminProjects(token);
    setProjects(data);
    setIsLoading(false);
  }, [getToken]);

  const loadSubcategories = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await getAdminSubcategories(token);
    setSubcategories(data);
  }, [getToken]);

  useEffect(() => {
    loadProjects();
    loadSubcategories();
  }, [loadProjects, loadSubcategories]);

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
  }

  async function handleCreate(formData: FormData) {
    const token = await getToken();
    if (!token) return;
    await createProject(formData, token);
    setIsCreating(false);
    await loadProjects();
  }

  async function handleUpdate(formData: FormData) {
    if (!editingProject) return;
    const token = await getToken();
    if (!token) return;
    await updateProject(editingProject._id, formData, token);
    setEditingProject(null);
    await loadProjects();
  }

  async function handleDelete(id: string) {
    const token = await getToken();
    if (!token) return;
    await deleteProject(id, token);
    setDeleteConfirm(null);
    await loadProjects();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <Link href="/" className="font-display text-2xl font-bold uppercase tracking-wide">
              Vacev
            </Link>
            <p className="text-sm text-muted">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted transition-colors hover:text-accent">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-accent hover:text-accent"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects');
              setIsCreating(false);
              setEditingProject(null);
            }}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-heading'
            }`}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('subcategories');
              setIsCreating(false);
              setEditingProject(null);
            }}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'subcategories'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-heading'
            }`}
          >
            Subcategories
          </button>
        </div>

        {activeTab === 'subcategories' ? (
          <SubcategoryManager onUpdate={loadSubcategories} />
        ) : isCreating || editingProject ? (
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-heading">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h2>
            <ProjectForm
              project={editingProject || undefined}
              subcategories={subcategories}
              onSubmit={editingProject ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsCreating(false);
                setEditingProject(null);
              }}
            />
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-heading">Projects</h1>
              <button
                onClick={() => {
                  loadSubcategories();
                  setIsCreating(true);
                }}
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Add Project
              </button>
            </div>

            {isLoading ? (
              <p className="text-muted">Loading projects...</p>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
                <p className="text-muted">No projects yet. Create your first one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="apple-round relative h-20 w-20 shrink-0 overflow-hidden bg-background">
                      <Image
                        src={resolveImageUrl(project.coverImage)}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-heading">{project.name}</h3>
                      <p className="truncate text-sm text-muted">
                        {CATEGORY_LABELS[project.category || 'photography']}
                        {project.subcategory &&
                          typeof project.subcategory !== 'string' &&
                          ` · ${project.subcategory.name}`}
                        {' · '}
                        {project.photos.length} photos · Order {project.order}
                        {!project.published && ' · Draft'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/work/${project.slug}`}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-heading transition-colors hover:border-accent hover:text-accent"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          loadSubcategories();
                          setEditingProject(project);
                        }}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-heading transition-colors hover:border-accent hover:text-accent"
                      >
                        Edit
                      </button>
                      {deleteConfirm === project._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg border border-border px-4 py-2 text-sm text-heading transition-colors hover:border-accent"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(project._id)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
