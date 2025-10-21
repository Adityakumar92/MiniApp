const Question = require('../models/Question.model');
const Answer = require('../models/Answer.model');

const createQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newQuestion = new Question({
            title,
            description,
            tags,
            createdBy: req.user.id
        });

        await newQuestion.save();

        res.status(201).json({ message: 'Question created successfully', question: newQuestion });
    } catch (error) {
        console.error('Create Question Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getQuestionDetailById = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id)
            .populate('createdBy', 'name email role');

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const answers = await Answer.find({ questionId: id })
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({ question, answers });
    } catch (error) {
        console.error('Get Question Detail Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        const { search, tags } = req.body;

        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (tags && Array.isArray(tags) && tags.length > 0) {
            query.tags = { $in: tags };
        }

        const questions = await Question.find(query)
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json(questions);
    } catch (error) {
        console.error('Get Questions Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags } = req.body;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (question.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        question.title = title || question.title;
        question.description = description || question.description;
        question.tags = tags || question.tags;

        await question.save();

        res.status(200).json({ message: 'Question updated successfully', question });
    } catch (error) {
        console.error('Update Question Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (question.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Question.findByIdAndDelete(id);

        await Answer.deleteMany({ questionId: id });

        res.status(200).json({ message: 'Question and its answers deleted successfully' });
    } catch (error) {
        console.error('Delete Question Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllQuestionsByCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const questions = await Question.find({ createdBy: userId })
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 });

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this user' });
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error('Get Current User Questions Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createQuestion,
    getQuestionDetailById,
    getAllQuestions,
    updateQuestion,
    deleteQuestion,
    getAllQuestionsByCurrentUser
}