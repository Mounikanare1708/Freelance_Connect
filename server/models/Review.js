const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    freelancerReply: { type: String, default: '' },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per user per gig
reviewSchema.index({ userId: 1, gigId: 1 }, { unique: true });

// Update gig rating after review save/remove
reviewSchema.post('save', async function () {
  const Gig = mongoose.model('Gig');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { gigId: this.gigId } },
    { $group: { _id: '$gigId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Gig.findByIdAndUpdate(this.gigId, {
      rating: stats[0].avgRating.toFixed(1),
      reviewsCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
