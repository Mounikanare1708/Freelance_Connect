const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    }).populate('participants', 'name avatar').sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Fetch conversations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// Get messages for a specific conversation or between two users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The other user's ID
    
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] }
    });

    if (!conversation) {
      return res.json({ success: true, messages: [] });
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    res.json({ success: true, messages, conversationId: conversation._id });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      text
    });

    conversation.lastMessage = text;
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // Push notification to receiver
    await User.findByIdAndUpdate(receiverId, {
      $push: {
        notifications: {
          message: `New message from ${req.user.name}`,
          type: 'message',
        },
      },
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

module.exports = { getConversations, getMessages, sendMessage };
