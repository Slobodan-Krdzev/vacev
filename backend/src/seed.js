import 'dotenv/config';
import slugify from 'slugify';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import { Subcategory } from './models/Subcategory.js';

const sampleSubcategories = [
  { name: 'Portraits', category: 'photography', order: 0 },
  { name: 'Fashion', category: 'photography', order: 1 },
  { name: 'Commercial', category: 'videography', order: 0 },
  { name: 'Brand Films', category: 'videography', order: 1 },
];

const sampleProjects = [
  {
    name: 'Portraits',
    description:
      'A collection of intimate portrait work exploring light, color, and character. Each session captures the unique essence of the subject through dramatic lighting and bold composition.',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    category: 'photography',
    subcategorySlug: 'portraits',
    order: 0,
    photos: [
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80', alt: 'Portrait 1', order: 0, span: 'wide' },
      { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', alt: 'Portrait 2', order: 1, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', alt: 'Portrait 3', order: 2, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Portrait 4', order: 3, span: 'tall' },
      { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', alt: 'Portrait 5', order: 4, span: 'small' },
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', alt: 'Portrait 6', order: 5, span: 'small' },
    ],
  },
  {
    name: 'Commercial',
    description:
      'Brand-focused commercial photography and video campaigns. From product launches to lifestyle content, delivering visuals that connect with audiences and elevate brands.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    category: 'videography',
    subcategorySlug: 'commercial',
    order: 1,
    photos: [
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', alt: 'Commercial 1', order: 0, span: 'wide' },
      { url: 'https://images.unsplash.com/photo-1556745753-b390469bb73c?w=800&q=80', alt: 'Commercial 2', order: 1, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80', alt: 'Commercial 3', order: 2, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', alt: 'Commercial 4', order: 3, span: 'tall' },
    ],
  },
  {
    name: 'Fashion',
    description:
      'Editorial fashion photography blending contemporary style with timeless aesthetics. Collaborations with designers, stylists, and models to create striking visual narratives.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    category: 'photography',
    subcategorySlug: 'fashion',
    order: 2,
    photos: [
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80', alt: 'Fashion 1', order: 0, span: 'wide' },
      { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', alt: 'Fashion 2', order: 1, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', alt: 'Fashion 3', order: 2, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', alt: 'Fashion 4', order: 3, span: 'tall' },
      { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', alt: 'Fashion 5', order: 4, span: 'small' },
      { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80', alt: 'Fashion 6', order: 5, span: 'small' },
    ],
  },
];

async function seed() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@vacev.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    await User.create({ email, password });
    console.log(`Admin user created: ${email}`);
  } else {
    console.log('Admin user already exists');
  }

  const subcategoryCount = await Subcategory.countDocuments();
  if (subcategoryCount === 0) {
    await Subcategory.insertMany(
      sampleSubcategories.map((item) => ({
        ...item,
        slug: slugify(item.name, { lower: true, strict: true }),
      }))
    );
    console.log(`Seeded ${sampleSubcategories.length} subcategories`);
  } else {
    console.log('Subcategories already exist, skipping seed');
  }

  const subcategoryBySlug = Object.fromEntries(
    (await Subcategory.find()).map((item) => [item.slug, item._id])
  );

  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany(
      sampleProjects.map(({ subcategorySlug, ...project }) => ({
        ...project,
        subcategory: subcategoryBySlug[subcategorySlug] || null,
      }))
    );
    console.log(`Seeded ${sampleProjects.length} sample projects`);
  } else {
    console.log('Projects already exist, skipping seed');
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
