const Insight = require('../models/Insight.model');
const Question = require('../models/Question.model');

// ✅ Helper: Check if user is Manager
const checkManager = (req, res) => {
  if (!req.user || req.user.role !== 1) {
    res.status(403).json({ message: 'Access denied: Managers only' });
    return false;
  }
  return true;
};

// ✅ Create a new Insight
const createInsight = async (req, res) => {
  if (!checkManager(req, res)) return;

  try {
    const { questionId } = req.params;
    const { summary } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const insight = await Insight.create({
      questionId,
      summary,
      createdBy: req.user.id,
    });

    // 🔧 Populate createdBy and question for instant frontend display
    await insight.populate('createdBy', 'name email');
    await insight.populate('questionId', 'title description tags');

    res.status(201).json({
      message: 'Insight created successfully',
      insight,
    });
  } catch (error) {
    console.error('Create Insight Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get all Insights (Manager only)
const getAllInsights = async (req, res) => {
  if (!checkManager(req, res)) return;

  try {
    const insights = await Insight.find()
      .populate('questionId', 'title description tags')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(insights);
  } catch (error) {
    console.error('Get Insights Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get Insights for a specific Question
const getInsightsByQuestion = async (req, res) => {
  if (!checkManager(req, res)) return;

  try {
    const { questionId } = req.params;

    const insights = await Insight.find({ questionId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(insights);
  } catch (error) {
    console.error('Get Insights by Question Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update an Insight
const updateInsight = async (req, res) => {
  if (!checkManager(req, res)) return;

  try {
    const { id } = req.params;
    const { summary } = req.body;

    const insight = await Insight.findById(id);
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }

    if (insight.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this insight' });
    }

    insight.summary = summary || insight.summary;
    await insight.save();

    await insight.populate('createdBy', 'name email');

    res.status(200).json({
      message: 'Insight updated successfully',
      insight,
    });
  } catch (error) {
    console.error('Update Insight Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete an Insight
const deleteInsight = async (req, res) => {
  if (!checkManager(req, res)) return;

  try {
    const { id } = req.params;

    const insight = await Insight.findById(id);
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }

    if (insight.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this insight' });
    }

    await insight.deleteOne();

    res.status(200).json({ message: 'Insight deleted successfully' });
  } catch (error) {
    console.error('Delete Insight Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createInsight,
  getAllInsights,
  getInsightsByQuestion,
  updateInsight,
  deleteInsight,
};
