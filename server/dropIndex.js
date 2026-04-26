require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    await mongoose.connection.collection('users').dropIndex('phone_1');
    console.log('Index dropped successfully!');
  } catch(e) {
    console.log('Error dropping index:', e.message);
  }
  process.exit(0);
}
run();
