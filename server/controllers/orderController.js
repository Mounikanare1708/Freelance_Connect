const Order = require('../models/Order');
const Gig = require('../models/Gig');
const User = require('../models/User');

/**
 * @desc    Create a new order/request
 * @route   POST /api/orders
 * @access  Private (Client/Both)
 */
const createOrder = async (req, res) => {
  try {
    const { gigId, message } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig || !gig.isActive) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.freelancerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot order your own gig' });
    }

    const order = await Order.create({
      clientId: req.user._id,
      freelancerId: gig.freelancerId,
      gigId: gig._id,
      gigTitle: gig.title,
      message,
      amount: gig.price,
      timeline: [{ status: 'pending', note: 'Order placed by client' }],
    });

    // Notify freelancer
    await User.findByIdAndUpdate(gig.freelancerId, {
      $push: {
        notifications: {
          message: `New order request for "${gig.title}" from ${req.user.name}`,
          type: 'order',
        },
      },
    });

    // Increment gig orders count
    await Gig.findByIdAndUpdate(gigId, { $inc: { ordersCount: 1 } });

    const populatedOrder = await Order.findById(order._id)
      .populate('clientId', 'name avatar email')
      .populate('freelancerId', 'name avatar')
      .populate('gigId', 'title images price');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

/**
 * @desc    Get user's orders (as client or freelancer)
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  try {
    const { role = 'client', status } = req.query;
    const query = {};

    if (role === 'freelancer') {
      query.freelancerId = req.user._id;
    } else {
      query.clientId = req.user._id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('clientId', 'name avatar email')
      .populate('freelancerId', 'name avatar')
      .populate('gigId', 'title images price deliveryTime')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Client or Freelancer of that order)
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name avatar email location')
      .populate('freelancerId', 'name avatar email bio skills')
      .populate('gigId', 'title images price deliveryTime revisions description');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check access
    const userId = req.user._id.toString();
    if (order.clientId._id.toString() !== userId && order.freelancerId._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Freelancer or Client depending on action)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const userId = req.user._id.toString();
    const isClient = order.clientId.toString() === userId;
    const isFreelancer = order.freelancerId.toString() === userId;

    // Permission checks based on role and status
    const freelancerActions = ['accepted', 'rejected', 'in-progress', 'completed'];
    const clientActions = ['cancelled'];

    if (freelancerActions.includes(status) && !isFreelancer) {
      return res.status(403).json({ success: false, message: 'Only the freelancer can perform this action' });
    }

    if (clientActions.includes(status) && !isClient) {
      return res.status(403).json({ success: false, message: 'Only the client can cancel an order' });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['accepted', 'rejected', 'cancelled'],
      accepted: ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      completed: [],
      rejected: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from '${order.status}' to '${status}'`,
      });
    }

    order.status = status;
    if (note) order.freelancerNote = note;

    // Handle delivery attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(f => `/uploads/${f.filename}`);
      order.attachments = [...(order.attachments || []), ...newAttachments];
    }

    await order.save();

    // Notify the other party
    const notifyUserId = isFreelancer ? order.clientId : order.freelancerId;
    await User.findByIdAndUpdate(notifyUserId, {
      $push: {
        notifications: {
          message: `Your order "${order.gigTitle}" has been ${status}`,
          type: 'order',
        },
      },
    });

    const updatedOrder = await Order.findById(order._id)
      .populate('clientId', 'name avatar email')
      .populate('freelancerId', 'name avatar')
      .populate('gigId', 'title images price');

    res.json({ success: true, message: `Order ${status} successfully!`, order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };
