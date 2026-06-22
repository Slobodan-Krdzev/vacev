import mongoose from 'mongoose';
import slugify from 'slugify';

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, index: true },
    category: {
      type: String,
      enum: ['photography', 'videography', 'audio'],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subcategorySchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

subcategorySchema.index({ category: 1, slug: 1 }, { unique: true });

export const Subcategory = mongoose.model('Subcategory', subcategorySchema);
