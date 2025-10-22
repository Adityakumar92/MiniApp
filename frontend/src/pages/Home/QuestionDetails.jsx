import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const token = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user")); // logged-in user

  // Fetch question details
  const fetchQuestionDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setQuestion(res.data.question);
    } catch (error) {
      console.error("Failed to fetch question:", error);
      toast.error("Failed to fetch question details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all answers for the question
  const fetchAnswers = async () => {
    try {
      const res = await api.get(`/answers/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAnswers(res.data);
    } catch (error) {
      console.error("Failed to fetch answers:", error);
      toast.error("Failed to fetch answers");
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
    fetchAnswers();
  }, [id]);

  // Submit new answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post(
        `/answers/${id}`,
        { content: newAnswer },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      // Inject user info so "Anonymous" doesn't appear
      const newAnswerObj = {
        ...res.data,
        createdBy: { name: userObj?.name || "You", _id: userObj?.id },
      };

      toast.success("Answer submitted!");
      setAnswers([newAnswerObj, ...answers]);
      setNewAnswer("");
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const startEditing = (answerId, currentText) => {
    setEditingAnswerId(answerId);
    setEditingText(currentText);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingAnswerId(null);
    setEditingText("");
  };

  // Save edited answer
  const saveEditedAnswer = async (id) => {
    if (!editingText.trim()) return;
    try {
      const res = await api.patch(
        `/answers/${id}`,
        { answer: editingText },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("Answer updated successfully!");
      setAnswers(
        answers.map((a) =>
          a._id === id ? { ...res.data.answer, createdBy: a.createdBy } : a
        )
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update answer:", error);
      toast.error("Failed to update answer");
    }
  };

  // Delete answer
  const deleteAnswer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await api.delete(`/answers/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Answer deleted successfully!");
      setAnswers(answers.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Failed to delete answer:", error);
      toast.error("Failed to delete answer");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!question)
    return <p className="text-center mt-10 text-gray-500">Question not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Question */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {question.title}
        </h1>
        <p className="text-gray-700 mb-6">{question.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <p className="text-gray-500 mb-8">
          Posted by:{" "}
          <span className="font-medium text-gray-700">
            {question.createdBy?.name || "Unknown"}
          </span>
        </p>

        <hr className="mb-6" />

        {/* Answer Form */}
        <form onSubmit={handleSubmitAnswer} className="mb-6">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 mb-2"
            rows={4}
          />
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Submitting..." : "Post Answer"}
          </button>
        </form>

        {/* Answers */}
        <h2 className="text-xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>
        {answers.length === 0 ? (
          <p className="text-gray-500">No answers yet.</p>
        ) : (
          <div className="space-y-4">
            {answers.map((a) => (
              <div
                key={a._id}
                className="bg-gray-50 p-4 rounded-md border border-gray-200 relative"
              >
                {editingAnswerId === a._id ? (
                  <div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 mb-2"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditedAnswer(a._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                      >
                        <FiCheck /> Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 flex items-center gap-1"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">{a.answer || a.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      — {a.createdBy?.name || "Anonymous"} |{" "}
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                    {a.createdBy?._id === userObj?.id && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => startEditing(a._id, a.answer || a.content)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => deleteAnswer(a._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
