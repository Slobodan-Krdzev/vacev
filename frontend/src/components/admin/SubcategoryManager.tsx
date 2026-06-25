'use client';

import { useCallback, useEffect, useState } from 'react';
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from '@/lib/categories';
import type { ProjectCategory } from '@/lib/categories';
import {
  createSubcategory,
  deleteSubcategory,
  getAdminSubcategories,
  updateSubcategory,
} from '@/lib/api';
import type { Subcategory } from '@/types';
import { useAuth } from '@/lib/auth-context';

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-heading outline-none focus:border-accent';

export default function SubcategoryManager({ onUpdate }: { onUpdate?: () => void }) {
  const { getToken } = useAuth();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<ProjectCategory | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('photography');
  const [order, setOrder] = useState('0');
  const [isSaving, setIsSaving] = useState(false);

  const loadSubcategories = useCallback(async () => {
    const token = await getToken();
    if (!token) return;

    const data = await getAdminSubcategories(token);
    setSubcategories(data);
    setIsLoading(false);
  }, [getToken]);

  useEffect(() => {
    loadSubcategories();
  }, [loadSubcategories]);

  const filtered = subcategories.filter(
    (item) => filterCategory === 'all' || item.category === filterCategory
  );

  function resetForm() {
    setName('');
    setCategory('photography');
    setOrder('0');
    setEditingId(null);
    setError('');
  }

  function startEdit(subcategory: Subcategory) {
    setEditingId(subcategory._id);
    setName(subcategory.name);
    setCategory(subcategory.category);
    setOrder(String(subcategory.order));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const token = await getToken();
      if (!token) return;

      const payload = {
        name: name.trim(),
        category,
        order: Number(order),
      };

      if (editingId) {
        await updateSubcategory(editingId, payload, token);
      } else {
        await createSubcategory(payload, token);
      }

      resetForm();
      await loadSubcategories();
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save subcategory');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const token = await getToken();
    if (!token) return;

    await deleteSubcategory(id, token);
    setDeleteConfirm(null);
    if (editingId === id) resetForm();
    await loadSubcategories();
    onUpdate?.();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-heading">
          {editingId ? 'Edit Subcategory' : 'Add Subcategory'}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className={inputClass}
              >
                {PROJECT_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {CATEGORY_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingId ? 'Update' : 'Add Subcategory'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-heading transition-colors hover:border-accent hover:text-accent"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-heading">Subcategories</h2>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ProjectCategory | 'all')}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-heading outline-none focus:border-accent"
          >
            <option value="all">All categories</option>
            {PROJECT_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="text-muted">Loading subcategories...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface py-12 text-center">
            <p className="text-muted">No subcategories yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((subcategory) => (
              <div
                key={subcategory._id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div>
                  <h3 className="font-medium text-heading">{subcategory.name}</h3>
                  <p className="text-sm text-muted">
                    {CATEGORY_LABELS[subcategory.category]} · Order {subcategory.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(subcategory)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-heading transition-colors hover:border-accent hover:text-accent"
                  >
                    Edit
                  </button>
                  {deleteConfirm === subcategory._id ? (
                    <>
                      <button
                        onClick={() => handleDelete(subcategory._id)}
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
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(subcategory._id)}
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
      </div>
    </div>
  );
}
