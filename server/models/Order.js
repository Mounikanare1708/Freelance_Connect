const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    gigTitle: { type: String, required: true },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
    },
    deliveryDate: { type: Date },
    completedAt: { type: Date },
    freelancerNote: { type: String, default: '' },
    attachments: [{ type: String }],
    timeline: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Update timeline on status change
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      note: `Order status changed to ${this.status}`,
      changedAt: new Date(),
    });
    if (this.status === 'completed') {
      this.completedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
