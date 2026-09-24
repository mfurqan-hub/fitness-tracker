const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  replyTicket,
  updateTicketStatus
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/tickets')
  .get(getTickets)
  .post(createTicket);

router.route('/tickets/:id')
  .get(getTicketById);

router.post('/tickets/:id/messages', replyTicket);
router.put('/tickets/:id/status', updateTicketStatus);

module.exports = router;
