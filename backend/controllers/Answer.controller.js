const Answer = require('../models/Answer.model');
const Question = require('../models/Question.model');

const createAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { content } = req.body;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const newAnswer = new Answer({
            questionId,
            answer: content,
            createdBy: req.user.id
        });

        await newAnswer.save();

        await newAnswer.populate('createdBy', 'name email role');

        res.status(201).json(newAnswer);
    } catch (error) {
        console.error('Create Answer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAnswersByQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const answers = await Answer.find({ questionId })
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json(answers);
    } catch (error) {
        console.error('Get Answers Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;

        const existingAnswer = await Answer.findById(id);
        if (!existingAnswer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        if (existingAnswer.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        existingAnswer.answer = answer || existingAnswer.answer;
        await existingAnswer.save();

        res.status(200).json({ message: 'Answer updated successfully', answer: existingAnswer });
    } catch (error) {
        console.error('Update Answer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;

        const existingAnswer = await Answer.findById(id);
        if (!existingAnswer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        if (existingAnswer.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await existingAnswer.deleteOne();

        res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        console.error('Delete Answer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAnswer,
    getAnswersByQuestion,
    updateAnswer,
    deleteAnswer
};
