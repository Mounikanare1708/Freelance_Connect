const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, getUserById,
  toggleSaveGig, getNotifications,
  markNotificationsRead, getDashboardStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.post('/save-gig/:gigId', protect, toggleSaveGig);
router.get('/:id', getUserById);

module.exports = router;
