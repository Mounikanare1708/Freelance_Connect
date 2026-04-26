const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const User = require('./models/User');
    const Order = require('./models/Order');
    const Gig = require('./models/Gig');

    // Find the client
    const client = await User.findOne({ email: 'emma@demo.com' });
    if (!client) {
      console.log('Client not found');
      process.exit(1);
    }

    // Find a completed order for this client
    let order = await Order.findOne({ clientId: client._id, status: 'completed' });
    if (!order) {
      console.log('No completed order found. Let us create and complete one!');
      const freelancer = await User.findOne({ email: 'alex@demo.com' });
      const Gig = require('./models/Gig');
      const gig = await Gig.findOne({ freelancerId: freelancer._id });
      
      order = await Order.create({
        clientId: client._id,
        freelancerId: freelancer._id,
        gigId: gig._id,
        gigTitle: gig.title,
        message: 'Test order',
        amount: 50,
        status: 'completed'
      });
      console.log('Created a completed order');
    }

    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    try {
      console.log('Submitting review for gig:', order.gigId, 'order:', order._id);
      const Review = require('./models/Review');
      
      const existing = await Review.findOne({ userId: client._id, gigId: order.gigId });
      if (existing) {
         console.log('Already reviewed');
         process.exit(0);
      }

      const review = await Review.create({
        userId: client._id,
        gigId: order.gigId,
        orderId: order._id,
        rating: 5,
        comment: 'This is a test review that must be at least 10 chars.',
        isVerifiedPurchase: true,
      });
      console.log('Success!', review);
      process.exit(0);
    } catch (err) {
      console.error('Failed:', err.message);
      process.exit(1);
    }
  });
