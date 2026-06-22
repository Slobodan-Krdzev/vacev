import { Router } from 'express';
import { Project } from '../models/Project.js';

const router = Router();

router.get('/', async (req, res) => {
  const filter = { published: true };
  const { category, subcategory } = req.query;

  if (category && ['photography', 'videography', 'audio'].includes(category)) {
    filter.category = category;
  }

  if (subcategory) {
    filter.subcategory = subcategory;
  }

  const projects = await Project.find(filter)
    .populate('subcategory', 'name slug category')
    .sort({ order: 1, createdAt: -1 })
    .select('name slug description coverImage category subcategory order createdAt');

  res.json(projects);
});

router.get('/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, published: true })
    .populate('subcategory', 'name slug category');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

export default router;
