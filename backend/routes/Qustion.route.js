const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestionDetailById,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  getAllQuestionsByCurrentUser
} = require('../controllers/Qustion.controller');
const  protect  = require('../middleware/AuthMiddleware');

// Protected routes (only logged-in users)
router.post('/', protect, createQuestion);
router.get('/byuser', protect, getAllQuestionsByCurrentUser);
router.get('/:id', protect, getQuestionDetailById);
router.post('/all', protect, getAllQuestions);
router.patch('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
