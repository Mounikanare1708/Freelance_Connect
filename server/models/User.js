const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['client', 'freelancer', 'both'],
      default: 'client',
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name}`;
      },
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    skills: [{ type: String, trim: true }],
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    savedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    notifications: [
      {
        message: String,
        type: { type: String, enum: ['order', 'review', 'system', 'message'], default: 'system' },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Virtual for full profile URL
userSchema.virtual('profileUrl').get(function () {
  return `/profile/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);
