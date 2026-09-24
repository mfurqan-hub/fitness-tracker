const express = require('express');
const router = express.Router();
const {
  getReportPreview,
  exportCSV,
  exportPDF
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/preview', getReportPreview);
router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);

module.exports = router;
