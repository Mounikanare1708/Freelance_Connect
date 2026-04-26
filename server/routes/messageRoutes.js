const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all message routes
router.route('/conversations').get(getConversations);
router.route('/:userId').get(getMessages);
router.route('/').post(sendMessage);

module.exports = router;
