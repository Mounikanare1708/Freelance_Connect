const User = require('../models/User');
const Gig = require('../models/Gig');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedGigs', 'title price images rating reviewsCount')
      .populate('recentlyViewed', 'title price images rating');
    res.json({ success: true, user });
  } catch (error) {
    console.error('getProfile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const {
      name, bio, skills, location, phone,
      socialLinks, role, removeAvatar
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (socialLinks) user.socialLinks = socialLinks;
    if (role && ['client', 'freelancer', 'both'].includes(role)) user.role = role;

    // Handle avatar upload
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    } else if (removeAvatar === 'true') {
      // Unsetting the avatar will allow the schema default (Dicebear) to take over
      // or we can explicitly set it to the default pattern
      user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || user.name)}`;
    }

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully!', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

/**
 * @desc    Get public user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -notifications -savedGigs -recentlyViewed');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const gigs = await Gig.find({ freelancerId: req.params.id, isActive: true }).limit(6);
    res.json({ success: true, user, gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

/**
 * @desc    Save/unsave a gig
 * @route   POST /api/users/save-gig/:gigId
 * @access  Private
 */
const toggleSaveGig = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const gigId = req.params.gigId;
    const saved = user.savedGigs.includes(gigId);

    if (saved) {
      user.savedGigs = user.savedGigs.filter(id => id.toString() !== gigId);
    } else {
      user.savedGigs.push(gigId);
    }

    await user.save();
    res.json({
      success: true,
      message: saved ? 'Gig removed from wishlist' : 'Gig saved to wishlist',
      saved: !saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save gig' });
  }
};

/**
 * @desc    Get notifications
 * @route   GET /api/users/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

/**
 * @desc    Mark notifications as read
 * @route   PUT /api/users/notifications/read
 * @access  Private
 */
const markNotificationsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].isRead': true },
    });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
};

/**
 * @desc    Get dashboard stats for a user
 * @route   GET /api/users/dashboard-stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const userId = req.user._id;
    const role = req.user.role;

    const stats = {};

    if (role === 'freelancer' || role === 'both') {
      const [totalGigs, orders] = await Promise.all([
        Gig.countDocuments({ freelancerId: userId }),
        Order.find({ freelancerId: userId }),
      ]);
      stats.freelancer = {
        totalGigs,
        totalRequests: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        active: orders.filter(o => o.status === 'in-progress' || o.status === 'accepted').length,
        completed: orders.filter(o => o.status === 'completed').length,
        earnings: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0),
      };
    }

    if (role === 'client' || role === 'both') {
      const orders = await Order.find({ clientId: userId }).populate('gigId', 'title images');
      stats.client = {
        totalOrders: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        active: orders.filter(o => ['accepted', 'in-progress'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'completed').length,
        totalSpent: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0),
        recentOrders: orders.slice(-5).reverse(),
      };
    }

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  toggleSaveGig,
  getNotifications,
  markNotificationsRead,
  getDashboardStats,
};
