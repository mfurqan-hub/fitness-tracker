const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get user support tickets (or all tickets if Admin)
// @route   GET /api/support/tickets
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email avatar')
      .sort('-updatedAt');

    return ApiResponse.success(res, 'Tickets retrieved', tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/support/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const ticket = await SupportTicket.findOne(query).populate('user', 'name email avatar');

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found or unauthorized');
    }

    return ApiResponse.success(res, 'Ticket retrieved', ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new support ticket
// @route   POST /api/support/tickets
// @access  Private
const createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, message } = req.body;

    if (!subject || !message) {
      return ApiResponse.badRequest(res, 'Subject and message are required.');
    }

    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject: subject.trim(),
      category: category || 'other',
      priority: priority || 'medium',
      status: 'open',
      messages: [
        {
          sender: req.user._id,
          senderName: req.user.name,
          isStaff: req.user.role === 'admin',
          message: message.trim(),
          createdAt: new Date()
        }
      ]
    });

    return ApiResponse.created(res, 'Support ticket submitted successfully', ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a message reply to ticket
// @route   POST /api/support/tickets/:id/messages
// @access  Private
const replyTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return ApiResponse.badRequest(res, 'Message cannot be empty.');
    }

    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const ticket = await SupportTicket.findOne(query);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found or unauthorized');
    }

    const isStaff = req.user.role === 'admin';

    ticket.messages.push({
      sender: req.user._id,
      senderName: isStaff ? `${req.user.name} (Support Staff)` : req.user.name,
      isStaff,
      message: message.trim(),
      createdAt: new Date()
    });

    if (isStaff && ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    // If staff replied, notify the ticket creator
    if (isStaff && ticket.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: ticket.user,
        title: 'Support Response Received',
        message: `Staff replied to your ticket: "${ticket.subject}"`,
        type: 'support',
        actionUrl: `/support`
      });
    }

    return ApiResponse.success(res, 'Reply added successfully', ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status (Admin or user close)
// @route   PUT /api/support/tickets/:id/status
// @access  Private
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status, priority } = req.body;
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const ticket = await SupportTicket.findOne(query);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    if (status) ticket.status = status;
    if (priority && req.user.role === 'admin') ticket.priority = priority;

    await ticket.save();
    return ApiResponse.success(res, 'Ticket updated successfully', ticket);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  replyTicket,
  updateTicketStatus
};
