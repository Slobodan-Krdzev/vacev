import mongoose from 'mongoose';
import slugify from 'slugify';

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    order: { type: Number, default: 0 },
    span: { type: String, enum: ['normal', 'wide', 'tall', 'small'], default: 'normal' },
  },
  { _id: true }
);

const platformLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, enum: ['youtube', 'spotify'], required: true },
    url: { type: String, required: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['photography', 'videography', 'audio'],
      default: 'photography',
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      default: null,
    },
    coverImage: { type: String, required: true },
    youtubeVideoId: { type: String, default: '' },
    youtubeLink: { type: String, default: '' },
    youtubeLinkLabel: { type: String, default: '' },
    platformLinks: [platformLinkSchema],
    audioUrl: { type: String, default: '' },
    photos: [photoSchema],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Project = mongoose.model('Project', projectSchema);
