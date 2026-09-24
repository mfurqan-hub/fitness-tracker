const express = require('express');
const router = express.Router();
const { updateProfile, uploadAvatar, updatePreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.put('/preferences', updatePreferences);

module.exports = router;
