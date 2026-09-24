const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getSystemLogs,
  getSystemSettings,
  updateSystemSettings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

// Apply Protect and Admin Authorize to all admin routes
router.use(protect, authorize(ROLES.ADMIN));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.route('/users/:id')
  .put(updateUserStatus)
  .delete(deleteUser);

router.get('/logs', getSystemLogs);
router.route('/settings')
  .get(getSystemSettings)
  .put(updateSystemSettings);

module.exports = router;
