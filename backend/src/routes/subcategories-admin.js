import { Router } from 'express';
import slugify from 'slugify';
import { Subcategory } from '../models/Subcategory.js';
import { Project } from '../models/Project.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const CATEGORIES = ['photography', 'videography', 'audio'];

router.get('/subcategories', async (req, res) => {
  const filter = {};
  if (req.query.category) {
    if (!CATEGORIES.includes(req.query.category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    filter.category = req.query.category;
  }

  const subcategories = await Subcategory.find(filter).sort({ order: 1, name: 1 });
  res.json(subcategories);
});

router.post('/subcategories', async (req, res) => {
  const { name, category, order } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (!category || !CATEGORIES.includes(category)) {
    return res.status(400).json({ message: 'Valid category is required' });
  }

  const subcategory = await Subcategory.create({
    name: name.trim(),
    slug: slugify(name, { lower: true, strict: true }),
    category,
    order: order ? Number(order) : 0,
  });

  res.status(201).json(subcategory);
});

router.put('/subcategories/:id', async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  const { name, category, order } = req.body;

  if (name) {
    subcategory.name = name.trim();
    subcategory.slug = slugify(name, { lower: true, strict: true });
  }
  if (category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    subcategory.category = category;
  }
  if (order !== undefined) subcategory.order = Number(order);

  await subcategory.save();
  res.json(subcategory);
});

router.delete('/subcategories/:id', async (req, res) => {
  const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  await Project.updateMany({ subcategory: subcategory._id }, { $unset: { subcategory: '' } });
  res.json({ message: 'Subcategory deleted' });
});

export default router;
