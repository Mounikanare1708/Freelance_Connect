const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freelance-connect';

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    
    // Update users
    const usersResult1 = await db.collection('users').updateMany({ role: 'seller' }, { $set: { role: 'freelancer' } });
    console.log('Updated sellers:', usersResult1.modifiedCount);
    
    const usersResult2 = await db.collection('users').updateMany({ role: 'buyer' }, { $set: { role: 'client' } });
    console.log('Updated buyers:', usersResult2.modifiedCount);

    const ordersResult1 = await db.collection('orders').updateMany({}, { $rename: { 'buyerId': 'clientId', 'sellerId': 'freelancerId', 'sellerNote': 'freelancerNote' } });
    console.log('Updated order fields');

    const reviewsResult1 = await db.collection('reviews').updateMany({}, { $rename: { 'sellerReply': 'freelancerReply' } });
    console.log('Updated review fields');

    const gigsResult1 = await db.collection('gigs').updateMany({}, { $rename: { 'sellerId': 'freelancerId', 'sellerName': 'freelancerName', 'sellerAvatar': 'freelancerAvatar' } });
    console.log('Updated gig fields');

    console.log('Migration complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
