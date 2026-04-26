const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      process.exit(1);
    }
    console.log('Testing with user:', user.name);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const body = JSON.stringify({ removeAvatar: 'true' });
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      console.log('Status:', res.statusCode);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        console.log('Body:', data);
        
        // Let's verify DB directly
        const updatedUser = await User.findById(user._id);
        console.log('DB Avatar:', updatedUser.avatar);
        process.exit(0);
      });
    });

    req.on('error', e => console.error(e));
    req.write(body);
    req.end();
  });
