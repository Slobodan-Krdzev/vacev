import { Router } from 'express';
import slugify from 'slugify';
import { Project } from '../models/Project.js';
import { Subcategory } from '../models/Subcategory.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { parseYoutubeVideoId } from '../utils/youtube.js';
import subcategoryAdminRoutes from './subcategories-admin.js';

const router = Router();

router.use(authenticate);

const CATEGORIES = ['photography', 'videography', 'audio'];
const PLATFORM_TYPES = ['youtube', 'spotify'];

const projectUpload = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'photos', maxCount: 30 },
  { name: 'audioFile', maxCount: 1 },
]);

async function resolveSubcategory(subcategoryId, category) {
  if (!subcategoryId || subcategoryId === 'null' || subcategoryId === '') {
    return null;
  }

  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    throw new Error('Subcategory not found');
  }
  if (subcategory.category !== category) {
    throw new Error('Subcategory does not belong to the selected category');
  }

  return subcategory._id;
}

function buildImageUrl(_req, filename) {
  return `/uploads/${filename}`;
}

function parsePlatformLinks(raw) {
  if (!raw) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid platformLinks JSON');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('platformLinks must be an array');
  }

  return parsed.map((link, index) => {
    const platform = link?.platform;
    const url = typeof link?.url === 'string' ? link.url.trim() : '';
    const label = typeof link?.label === 'string' ? link.label.trim() : '';

    if (!PLATFORM_TYPES.includes(platform)) {
      throw new Error(`Invalid platform at link ${index + 1}`);
    }
    if (!url) {
      throw new Error(`Platform link ${index + 1} requires a URL`);
    }
    if (!label) {
      throw new Error(`Platform link ${index + 1} requires a label`);
    }

    return { platform, url, label };
  });
}

function validateVideographyFields({ youtubeEmbed, youtubeLink, youtubeLinkLabel }) {
  const youtubeVideoId = parseYoutubeVideoId(youtubeEmbed);
  const link = typeof youtubeLink === 'string' ? youtubeLink.trim() : '';
  const linkLabel = typeof youtubeLinkLabel === 'string' ? youtubeLinkLabel.trim() : '';

  if (!youtubeVideoId && !link) {
    return { error: 'YouTube embed or external link is required for videography projects' };
  }

  if (link && !linkLabel) {
    return { error: 'YouTube link label is required when a YouTube link is provided' };
  }

  if (linkLabel && !link) {
    return { error: 'YouTube link URL is required when a link label is provided' };
  }

  return { youtubeVideoId, youtubeLink: link, youtubeLinkLabel: linkLabel };
}

function validateAudioFields({ platformLinksRaw, audioUrl, hasAudioFile }) {
  let platformLinks = [];
  try {
    platformLinks = parsePlatformLinks(platformLinksRaw);
  } catch (err) {
    return { error: err.message };
  }

  const url = typeof audioUrl === 'string' ? audioUrl.trim() : '';
  if (platformLinks.length === 0 && !url && !hasAudioFile) {
    return {
      error: 'At least one platform link, audio URL, or audio file is required for audio projects',
    };
  }

  return { platformLinks, audioUrl: url };
}

router.get('/projects', async (_req, res) => {
  const projects = await Project.find()
    .populate('subcategory', 'name slug category')
    .sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

router.get('/projects/:id', async (req, res) => {
  const project = await Project.findById(req.params.id).populate('subcategory', 'name slug category');
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
});

router.post('/projects', projectUpload, async (req, res) => {
  const {
    name,
    description,
    category,
    subcategoryId,
    order,
    published,
    youtubeEmbed,
    youtubeLink,
    youtubeLinkLabel,
    platformLinks,
    audioUrl,
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  const projectCategory = category || 'photography';
  if (!CATEGORIES.includes(projectCategory)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  let subcategory = null;
  try {
    subcategory = await resolveSubcategory(subcategoryId, projectCategory);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const coverFile = req.files?.coverImage?.[0];
  if (!coverFile) {
    return res.status(400).json({ message: 'Cover image is required' });
  }

  let youtubeVideoId = '';
  let resolvedYoutubeLink = '';
  let resolvedYoutubeLinkLabel = '';
  let resolvedPlatformLinks = [];
  let resolvedAudioUrl = '';

  if (projectCategory === 'videography') {
    const result = validateVideographyFields({ youtubeEmbed, youtubeLink, youtubeLinkLabel });
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    youtubeVideoId = result.youtubeVideoId;
    resolvedYoutubeLink = result.youtubeLink;
    resolvedYoutubeLinkLabel = result.youtubeLinkLabel;
  }

  if (projectCategory === 'audio') {
    const audioFile = req.files?.audioFile?.[0];
    const result = validateAudioFields({
      platformLinksRaw: platformLinks,
      audioUrl,
      hasAudioFile: Boolean(audioFile),
    });
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    resolvedPlatformLinks = result.platformLinks;
    resolvedAudioUrl = result.audioUrl;

    if (audioFile) {
      resolvedAudioUrl = buildImageUrl(req, audioFile.filename);
    }
  }

  const photoFiles = req.files?.photos || [];
  const photos = photoFiles.map((file, index) => ({
    url: buildImageUrl(req, file.filename),
    alt: name,
    order: index,
    span: 'normal',
  }));

  const project = await Project.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    description: description || '',
    category: projectCategory,
    subcategory,
    coverImage: buildImageUrl(req, coverFile.filename),
    youtubeVideoId,
    youtubeLink: resolvedYoutubeLink,
    youtubeLinkLabel: resolvedYoutubeLinkLabel,
    platformLinks: resolvedPlatformLinks,
    audioUrl: resolvedAudioUrl,
    photos,
    order: order ? Number(order) : 0,
    published: published !== 'false',
  });

  res.status(201).json(project);
});

router.put('/projects/:id', projectUpload, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const {
    name,
    description,
    category,
    subcategoryId,
    order,
    published,
    existingPhotos,
    youtubeEmbed,
    youtubeLink,
    youtubeLinkLabel,
    platformLinks,
    audioUrl,
    removeAudio,
    clearAudioUrl,
  } = req.body;

  if (name) {
    project.name = name;
    project.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) project.description = description;

  const projectCategory = category !== undefined ? category : project.category;
  if (category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    project.category = category;
  }

  if (subcategoryId !== undefined) {
    try {
      project.subcategory = await resolveSubcategory(subcategoryId, projectCategory);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  } else if (category !== undefined && project.subcategory) {
    const current = await Subcategory.findById(project.subcategory);
    if (!current || current.category !== project.category) {
      project.subcategory = null;
    }
  }

  if (order !== undefined) project.order = Number(order);
  if (published !== undefined) project.published = published !== 'false';

  const coverFile = req.files?.coverImage?.[0];
  if (coverFile) {
    project.coverImage = buildImageUrl(req, coverFile.filename);
  }

  if (projectCategory === 'videography') {
    const embedInput = youtubeEmbed !== undefined ? youtubeEmbed : project.youtubeVideoId;
    const linkInput = youtubeLink !== undefined ? youtubeLink : project.youtubeLink;
    const labelInput =
      youtubeLinkLabel !== undefined ? youtubeLinkLabel : project.youtubeLinkLabel;

    const result = validateVideographyFields({
      youtubeEmbed: embedInput,
      youtubeLink: linkInput,
      youtubeLinkLabel: labelInput,
    });
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    project.youtubeVideoId = result.youtubeVideoId;
    project.youtubeLink = result.youtubeLink;
    project.youtubeLinkLabel = result.youtubeLinkLabel;
    project.platformLinks = [];
    project.audioUrl = '';
  } else if (projectCategory === 'audio') {
    const audioFile = req.files?.audioFile?.[0];
    const platformLinksInput =
      platformLinks !== undefined ? platformLinks : JSON.stringify(project.platformLinks || []);

    let audioUrlForValidation = '';
    if (removeAudio === 'true' && !audioFile) {
      audioUrlForValidation = '';
    } else if (audioUrl !== undefined && audioUrl.trim() !== '') {
      audioUrlForValidation = audioUrl.trim();
    } else if (clearAudioUrl === 'true') {
      audioUrlForValidation = '';
    } else {
      audioUrlForValidation = project.audioUrl || '';
    }

    const result = validateAudioFields({
      platformLinksRaw: platformLinksInput,
      audioUrl: audioUrlForValidation,
      hasAudioFile: Boolean(audioFile),
    });
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    project.platformLinks = result.platformLinks;
    if (audioFile) {
      project.audioUrl = buildImageUrl(req, audioFile.filename);
    } else if (removeAudio === 'true') {
      project.audioUrl = '';
    } else if (clearAudioUrl === 'true') {
      project.audioUrl = '';
    } else if (audioUrl !== undefined && audioUrl.trim() !== '') {
      project.audioUrl = audioUrl.trim();
    }

    project.youtubeVideoId = '';
    project.youtubeLink = '';
    project.youtubeLinkLabel = '';
  } else {
    project.youtubeVideoId = '';
    project.youtubeLink = '';
    project.youtubeLinkLabel = '';
    project.platformLinks = [];
    project.audioUrl = '';
  }

  let photos = [];
  if (existingPhotos) {
    try {
      photos = JSON.parse(existingPhotos);
    } catch {
      return res.status(400).json({ message: 'Invalid existingPhotos JSON' });
    }
  } else {
    photos = [...project.photos.map((p) => p.toObject())];
  }

  const photoFiles = req.files?.photos || [];
  const newPhotos = photoFiles.map((file, index) => ({
    url: buildImageUrl(req, file.filename),
    alt: project.name,
    order: photos.length + index,
    span: 'normal',
  }));

  project.photos = [...photos, ...newPhotos];
  await project.save();
  res.json(project);
});

router.delete('/projects/:id', async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json({ message: 'Project deleted' });
});

router.post('/upload', upload.array('photos', 30), async (req, res) => {
  const files = req.files || [];
  const urls = files.map((file) => buildImageUrl(req, file.filename));
  res.json({ urls });
});

router.use(subcategoryAdminRoutes);

export default router;
