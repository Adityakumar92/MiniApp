const express = require('express');
const router = express.Router();
const {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer
} = require('../controllers/Answer.controller');
const protect = require('../middleware/AuthMiddleware');

router.post('/:questionId', protect, createAnswer);
router.get('/:questionId', protect, getAnswersByQuestion);
router.patch('/:id', protect, updateAnswer);
router.delete('/:id', protect, deleteAnswer);

module.exports = router;
