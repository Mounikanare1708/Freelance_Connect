const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerName: { type: String, required: true },
    freelancerAvatar: { type: String, default: '' },
    title: {
      type: String,
      required: [true, 'Gig title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Programming & Tech',
        'Design & Creative',
        'Writing & Translation',
        'Digital Marketing',
        'Video & Animation',
        'Music & Audio',
        'Data & Analytics',
        'Business & Finance',
      ],
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [5, 'Minimum price is $5'],
      max: [10000, 'Maximum price is $10,000'],
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: [1, 'Minimum delivery time is 1 day'],
    },
    revisions: {
      type: Number,
      default: 1,
      min: [0, 'Revisions cannot be negative'],
    },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
gigSchema.index({ title: 'text', description: 'text', tags: 'text' });
gigSchema.index({ category: 1, price: 1, createdAt: -1 });
gigSchema.index({ freelancerId: 1 });

module.exports = mongoose.model('Gig', gigSchema);
