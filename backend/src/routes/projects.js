import { Router } from 'express';
import { Project } from '../models/Project.js';

const router = Router();

router.get('/', async (_req, res) => {
  const projects = await Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .select('name slug description coverImage order createdAt');

  res.json(projects);
});

router.get('/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, published: true });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

export default router;
