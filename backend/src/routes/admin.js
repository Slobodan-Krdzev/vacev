import { Router } from 'express';
import slugify from 'slugify';
import { Project } from '../models/Project.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

function buildImageUrl(_req, filename) {
  return `/uploads/${filename}`;
}

router.get('/projects', async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

router.get('/projects/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
});

router.post('/projects', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'photos', maxCount: 30 },
]), async (req, res) => {
  const { name, description, order, published } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  const coverFile = req.files?.coverImage?.[0];
  if (!coverFile) {
    return res.status(400).json({ message: 'Cover image is required' });
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
    coverImage: buildImageUrl(req, coverFile.filename),
    photos,
    order: order ? Number(order) : 0,
    published: published !== 'false',
  });

  res.status(201).json(project);
});

router.put('/projects/:id', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'photos', maxCount: 30 },
]), async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const { name, description, order, published, existingPhotos } = req.body;

  if (name) {
    project.name = name;
    project.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) project.description = description;
  if (order !== undefined) project.order = Number(order);
  if (published !== undefined) project.published = published !== 'false';

  const coverFile = req.files?.coverImage?.[0];
  if (coverFile) {
    project.coverImage = buildImageUrl(req, coverFile.filename);
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

export default router;
