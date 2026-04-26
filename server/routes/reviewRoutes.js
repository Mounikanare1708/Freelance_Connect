const express = require('express');
const router = express.Router();
const { createReview, getGigReviews, replyToReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/:gigId', getGigReviews);
router.put('/:id/reply', protect, replyToReview);

module.exports = router;
