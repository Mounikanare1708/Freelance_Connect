const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // create dummy file
    fs.writeFileSync('dummy.png', 'dummy image content');

    const form = new FormData();
    form.append('avatar', fs.createReadStream('dummy.png'));

    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Upload Status:', res.status);
      console.log('New Avatar:', res.data.user.avatar);
      
      fs.unlinkSync('dummy.png');
      process.exit(0);
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      fs.unlinkSync('dummy.png');
      process.exit(1);
    }
  });
