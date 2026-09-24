const mongoose = require('mongoose');
const {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES
} = require('../config/constants');

const ticketMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    subject: {
      type: String,
      required: [true, 'Ticket subject is required'],
      trim: true,
      maxlength: [120, 'Subject cannot exceed 120 characters']
    },
    category: {
      type: String,
      enum: TICKET_CATEGORIES,
      default: 'other',
      index: true
    },
    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      default: 'medium'
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: 'open',
      index: true
    },
    messages: [ticketMessageSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
