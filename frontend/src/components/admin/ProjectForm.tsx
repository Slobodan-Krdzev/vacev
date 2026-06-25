'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from '@/lib/categories';
import type { ProjectCategory } from '@/lib/categories';
import { resolveImageUrl } from '@/lib/images';
import { isUploadedAudioPath, resolveMediaUrl } from '@/lib/media';
import type { Photo, PlatformLink, PlatformType, Project, Subcategory } from '@/types';

interface ProjectFormProps {
  project?: Project;
  subcategories: Subcategory[];
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

function getInitialSubcategoryId(project?: Project): string {
  if (!project?.subcategory) return '';
  if (typeof project.subcategory === 'string') return project.subcategory;
  return project.subcategory._id;
}

function getInitialExternalAudioUrl(project?: Project): string {
  const url = project?.audioUrl || '';
  return isUploadedAudioPath(url) ? '' : url;
}

function hadExternalAudioUrl(project?: Project): boolean {
  const url = project?.audioUrl || '';
  return Boolean(url) && !isUploadedAudioPath(url);
}

function getInitialPlatformLinks(project?: Project): PlatformLink[] {
  if (project?.platformLinks?.length) {
    return project.platformLinks.map((link) => ({
      platform: link.platform,
      url: link.url,
      label: link.label,
    }));
  }
  return [{ platform: 'youtube', url: '', label: '' }];
}

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-heading outline-none focus:border-accent';

export default function ProjectForm({ project, subcategories, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [category, setCategory] = useState<ProjectCategory>(project?.category || 'photography');
  const [subcategoryId, setSubcategoryId] = useState(getInitialSubcategoryId(project));
  const [order, setOrder] = useState(project?.order?.toString() || '0');
  const [published, setPublished] = useState(project?.published ?? true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>(project?.photos || []);
  const [youtubeEmbed, setYoutubeEmbed] = useState(project?.youtubeVideoId || '');
  const [youtubeLink, setYoutubeLink] = useState(project?.youtubeLink || '');
  const [youtubeLinkLabel, setYoutubeLinkLabel] = useState(project?.youtubeLinkLabel || '');
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>(getInitialPlatformLinks(project));
  const [audioUrl, setAudioUrl] = useState(getInitialExternalAudioUrl(project));
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [removeAudio, setRemoveAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categorySubcategories = subcategories.filter((item) => item.category === category);
  const isVideography = category === 'videography';
  const isAudio = category === 'audio';
  const photosOptional = isVideography || isAudio;

  const hasUploadedAudio =
    Boolean(project?.audioUrl && isUploadedAudioPath(project.audioUrl)) &&
    !removeAudio &&
    !audioFile;

  useEffect(() => {
    if (!subcategoryId) return;
    const isValid = categorySubcategories.some((item) => item._id === subcategoryId);
    if (!isValid) setSubcategoryId('');
  }, [category, categorySubcategories, subcategoryId]);

  const coverPreview = coverImage
    ? URL.createObjectURL(coverImage)
    : project?.coverImage
      ? resolveImageUrl(project.coverImage)
      : undefined;

  function updatePlatformLink(index: number, field: keyof PlatformLink, value: string) {
    setPlatformLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
  }

  function addPlatformLink() {
    setPlatformLinks((prev) => [...prev, { platform: 'spotify', url: '', label: '' }]);
  }

  function removePlatformLink(index: number) {
    setPlatformLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subcategoryId', subcategoryId || '');
      formData.append('order', order);
      formData.append('published', String(published));

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      if (isVideography) {
        formData.append('youtubeEmbed', youtubeEmbed);
        formData.append('youtubeLink', youtubeLink);
        formData.append('youtubeLinkLabel', youtubeLinkLabel);
      }

      if (isAudio) {
        const validLinks = platformLinks.filter((link) => link.url.trim() && link.label.trim());
        formData.append('platformLinks', JSON.stringify(validLinks));
        if (audioUrl.trim()) {
          formData.append('audioUrl', audioUrl.trim());
        } else if (hadExternalAudioUrl(project) && !removeAudio) {
          formData.append('clearAudioUrl', 'true');
        }
        if (audioFile) {
          formData.append('audioFile', audioFile);
        }
        if (removeAudio) {
          formData.append('removeAudio', 'true');
        }
      }

      photos.forEach((file) => formData.append('photos', file));

      if (project) {
        formData.append('existingPhotos', JSON.stringify(existingPhotos));
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  }

  function removeExistingPhoto(index: number) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
        <label className="mb-1.5 block text-sm font-medium text-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <label className="mb-1.5 block text-sm font-medium text-muted">Subcategory</label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className={inputClass}
            disabled={categorySubcategories.length === 0}
          >
            <option value="">None</option>
            {categorySubcategories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {categorySubcategories.length === 0 && (
            <p className="mt-1.5 text-xs text-muted">No subcategories for this category yet.</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-background accent-accent"
            />
            Published
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">
          Cover Image {!project && <span className="text-red-400">*</span>}
        </label>
        {coverPreview && (
          <div className="apple-round relative mb-3 aspect-video w-full max-w-xs overflow-hidden bg-background">
            <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          required={!project}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:text-white file:hover:bg-accent-hover"
        />
      </div>

      {isVideography && (
        <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
          <h3 className="text-sm font-semibold text-heading">Videography</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              YouTube Embed
            </label>
            <input
              type="text"
              value={youtubeEmbed}
              onChange={(e) => setYoutubeEmbed(e.target.value)}
              placeholder="Paste YouTube URL, embed code, or video ID"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-muted">
              Shown as an embedded player above the gallery.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                YouTube Link Label
              </label>
              <input
                type="text"
                value={youtubeLinkLabel}
                onChange={(e) => setYoutubeLinkLabel(e.target.value)}
                placeholder="e.g. Check the video on YouTube"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                YouTube Link URL
              </label>
              <input
                type="url"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-muted">
            Provide a YouTube embed and/or an external link with label. At least one is required.
          </p>
        </div>
      )}

      {isAudio && (
        <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
          <h3 className="text-sm font-semibold text-heading">Audio</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted">Platform Links</label>
              <button
                type="button"
                onClick={addPlatformLink}
                className="text-sm text-accent hover:text-accent-hover"
              >
                Add link
              </button>
            </div>
            {platformLinks.map((link, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[140px_1fr_1fr_auto]">
                <select
                  value={link.platform}
                  onChange={(e) => updatePlatformLink(index, 'platform', e.target.value as PlatformType)}
                  className={inputClass}
                >
                  <option value="youtube">YouTube</option>
                  <option value="spotify">Spotify</option>
                </select>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updatePlatformLink(index, 'label', e.target.value)}
                  placeholder="Link label"
                  className={inputClass}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updatePlatformLink(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
                {platformLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlatformLink(index)}
                    className="self-center text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Audio Player URL
            </label>
            <input
              type="url"
              value={audioUrl}
              onChange={(e) => {
                setAudioUrl(e.target.value);
                setRemoveAudio(false);
              }}
              placeholder="https://... (optional if uploading a file)"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-muted">
              For external audio links only. Uploaded files are managed below.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Upload Audio File
            </label>
            {hasUploadedAudio && (
              <div className="mb-3">
                <audio controls className="w-full max-w-md" src={resolveMediaUrl(project!.audioUrl!)} />
                <button
                  type="button"
                  onClick={() => setRemoveAudio(true)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove current audio
                </button>
              </div>
            )}
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                setAudioFile(e.target.files?.[0] || null);
                setRemoveAudio(false);
              }}
              className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:text-white"
            />
          </div>

          <p className="text-xs text-muted">
            Add at least one platform link, audio URL, or uploaded audio file.
          </p>
        </div>
      )}

      {existingPhotos.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">Existing Photos</label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {existingPhotos.map((photo, index) => (
              <div
                key={photo._id || photo.url}
                className="apple-round relative aspect-square overflow-hidden bg-background"
              >
                <Image src={resolveImageUrl(photo.url)} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingPhoto(index)}
                  className="absolute right-1 top-1 rounded bg-background/80 px-2 py-0.5 text-xs text-foreground hover:bg-background"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">
          {project ? 'Add More Photos' : 'Photos'}
          {photosOptional && <span className="ml-1 text-xs font-normal text-muted">(optional)</span>}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(Array.from(e.target.files || []))}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:text-white"
        />
        {photos.length > 0 && (
          <p className="mt-2 text-sm text-muted">{photos.length} new file(s) selected</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-heading transition-colors hover:border-accent hover:text-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
