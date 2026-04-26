const Review = require('../models/Review');
const Order = require('../models/Order');
const Gig = require('../models/Gig');

/**
 * @desc    Create a review for a gig
 * @route   POST /api/reviews
 * @access  Private (Client who completed the order)
 */
const createReview = async (req, res) => {
  try {
    const { gigId, orderId, rating, comment } = req.body;

    // Check for completed order
    const order = await Order.findOne({
      _id: orderId,
      clientId: req.user._id,
      gigId,
      status: 'completed',
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'You can only review gigs from completed orders',
      });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ userId: req.user._id, gigId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this gig' });
    }

    const review = await Review.create({
      userId: req.user._id,
      gigId,
      orderId,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: true,
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name avatar');

    res.status(201).json({ success: true, message: 'Review submitted!', review: populatedReview });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this gig' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

/**
 * @desc    Get all reviews for a gig
 * @route   GET /api/reviews/:gigId
 * @access  Public
 */
const getGigReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId })
      .populate('userId', 'name avatar location')
      .sort({ createdAt: -1 });

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1; });

    res.json({ success: true, reviews, ratingBreakdown, total: reviews.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

/**
 * @desc    Add freelancer reply to review
 * @route   PUT /api/reviews/:id/reply
 * @access  Private (Freelancer)
 */
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id).populate('gigId', 'freelancerId');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.gigId.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.freelancerReply = reply;
    await review.save();

    res.json({ success: true, message: 'Reply added', review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add reply' });
  }
};

module.exports = { createReview, getGigReviews, replyToReview };
