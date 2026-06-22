import { Router } from 'express';
import { Subcategory } from '../models/Subcategory.js';

const router = Router();

router.get('/', async (req, res) => {
  const filter = {};
  const { category } = req.query;

  if (category) {
    if (!['photography', 'videography', 'audio'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    filter.category = category;
  }

  const subcategories = await Subcategory.find(filter).sort({ order: 1, name: 1 });
  res.json(subcategories);
});

export default router;
