const express = require('express');
const router = express.Router();
const {
  createGig, getGigs, getGigById,
  updateGig, deleteGig, getMyGigs, getFeaturedGigs,
} = require('../controllers/gigController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/featured', getFeaturedGigs);
router.get('/', getGigs);
router.get('/:id', optionalAuth, getGigById);

// Protected routes
router.post('/', protect, authorize('freelancer'), upload.array('images', 5), createGig);
router.get('/user/my-gigs', protect, authorize('freelancer'), getMyGigs);
router.put('/:id', protect, authorize('freelancer'), upload.array('images', 5), updateGig);
router.delete('/:id', protect, authorize('freelancer'), deleteGig);

module.exports = router;
