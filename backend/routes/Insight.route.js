const express = require('express');
const router = express.Router();
const protect = require('../middleware/AuthMiddleware');
const {
  createInsight,
  getAllInsights,
  getInsightsByQuestion,
  updateInsight,
  deleteInsight
} = require('../controllers/Insight.controller');

// Manager-only routes
router.post('/:questionId', protect, createInsight);
router.get('/', protect, getAllInsights);
router.get('/:questionId', protect, getInsightsByQuestion);
router.patch('/:id', protect, updateInsight);
router.delete('/:id', protect, deleteInsight);

module.exports = router;
