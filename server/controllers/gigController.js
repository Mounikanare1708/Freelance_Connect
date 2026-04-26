const Gig = require('../models/Gig');
const User = require('../models/User');

/**
 * @desc    Create a new gig
 * @route   POST /api/gigs
 * @access  Private (Freelancer/Both)
 */
const createGig = async (req, res) => {
  try {
    const { title, description, category, tags, price, deliveryTime, revisions } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    // Parse tags
    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim().toLowerCase())
      : (tags || []);

    const gig = await Gig.create({
      freelancerId: req.user._id,
      freelancerName: req.user.name,
      freelancerAvatar: req.user.avatar,
      title,
      description,
      category,
      tags: parsedTags,
      price: Number(price),
      deliveryTime: Number(deliveryTime),
      revisions: Number(revisions) || 1,
      images,
    });

    res.status(201).json({ success: true, message: 'Gig created successfully!', gig });
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create gig' });
  }
};

/**
 * @desc    Get all gigs with search & filter
 * @route   GET /api/gigs
 * @access  Public
 */
const getGigs = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'popular':
        sortOption = { ordersCount: -1, rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [gigs, total] = await Promise.all([
      Gig.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Gig.countDocuments(query),
    ]);

    res.json({
      success: true,
      gigs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gigs' });
  }
};

/**
 * @desc    Get a single gig by ID
 * @route   GET /api/gigs/:id
 * @access  Public
 */
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancerId', 'name avatar bio skills location createdAt');

    if (!gig || !gig.isActive) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    // Increment views
    gig.views += 1;
    await gig.save({ validateBeforeSave: false });

    // Track recently viewed for authenticated users
    if (req.user) {
      // First remove the gig if it already exists to prevent duplicates and update its position
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { recentlyViewed: gig._id }
      });
      
      // Then push it to the end of the array and keep only the last 10
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          recentlyViewed: {
            $each: [gig._id],
            $slice: -10, // Keep only last 10
          },
        },
      });
    }

    // Get similar gigs
    const similarGigs = await Gig.find({
      category: gig.category,
      _id: { $ne: gig._id },
      isActive: true,
    }).limit(4);

    res.json({ success: true, gig, similarGigs });
  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gig' });
  }
};

/**
 * @desc    Update a gig
 * @route   PUT /api/gigs/:id
 * @access  Private (Gig owner)
 */
const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this gig' });
    }

    const { title, description, category, tags, price, deliveryTime, revisions } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (price) updateData.price = Number(price);
    if (deliveryTime) updateData.deliveryTime = Number(deliveryTime);
    if (revisions !== undefined) updateData.revisions = Number(revisions);
    if (tags) {
      updateData.tags = typeof tags === 'string'
        ? tags.split(',').map(t => t.trim().toLowerCase())
        : tags;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      updateData.images = [...(gig.images || []), ...newImages].slice(0, 5);
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Gig updated successfully!', gig: updatedGig });
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({ success: false, message: 'Failed to update gig' });
  }
};

/**
 * @desc    Delete a gig (soft delete)
 * @route   DELETE /api/gigs/:id
 * @access  Private (Gig owner)
 */
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this gig' });
    }

    // Soft delete
    gig.isActive = false;
    await gig.save();

    res.json({ success: true, message: 'Gig deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete gig' });
  }
};

/**
 * @desc    Get freelancer's own gigs
 * @route   GET /api/gigs/my-gigs
 * @access  Private (Freelancer)
 */
const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ freelancerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your gigs' });
  }
};

/**
 * @desc    Get trending/featured gigs for home page
 * @route   GET /api/gigs/featured
 * @access  Public
 */
const getFeaturedGigs = async (req, res) => {
  try {
    const [trending, newest, topRated] = await Promise.all([
      Gig.find({ isActive: true }).sort({ views: -1, ordersCount: -1 }).limit(8),
      Gig.find({ isActive: true }).sort({ createdAt: -1 }).limit(8),
      Gig.find({ isActive: true, reviewsCount: { $gt: 0 } }).sort({ rating: -1 }).limit(8),
    ]);

    res.json({ success: true, trending, newest, topRated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured gigs' });
  }
};

module.exports = {
  createGig,
  getGigs,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigs,
  getFeaturedGigs,
};
