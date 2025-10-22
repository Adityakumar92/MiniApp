import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingInsightId, setEditingInsightId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const token = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user")); // store user details (name, id) on login

  // Fetch all questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/questions/all",
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch insights for selected question
  const fetchInsights = async (questionId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/insights/${questionId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setInsights(res.data);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      toast.error("Failed to fetch insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // When a question is selected
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    fetchInsights(question._id);
    setSummary("");
    setEditingInsightId(null);
  };

  // Submit a new insight
  const handleSubmitInsight = async (e) => {
    e.preventDefault();
    if (!summary.trim() || !selectedQuestion) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        `http://localhost:8080/insights/${selectedQuestion._id}`,
        { summary },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      // ✅ Inject current user info so it doesn’t show "Anonymous"
      const newInsight = {
        ...res.data.insight,
        createdBy: { name: userObj?.name || "You", _id: userObj?.id },
      };

      toast.success("Insight added successfully!");
      setInsights([newInsight, ...insights]);
      setSummary("");
    } catch (error) {
      console.error("Failed to submit insight:", error);
      toast.error("Failed to submit insight");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete insight
  const handleDeleteInsight = async (id) => {
    if (!window.confirm("Are you sure you want to delete this insight?")) return;

    try {
      await axios.delete(`http://localhost:8080/insights/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Insight deleted successfully!");
      setInsights(insights.filter((i) => i._id !== id));
    } catch (error) {
      console.error("Failed to delete insight:", error);
      toast.error("Failed to delete insight");
    }
  };

  // Start editing
  const startEditing = (id, currentSummary) => {
    setEditingInsightId(id);
    setEditingText(currentSummary);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingInsightId(null);
    setEditingText("");
  };

  // Save edited insight
  const saveEditing = async (id) => {
    if (!editingText.trim()) return;

    try {
      const res = await axios.patch(
        `http://localhost:8080/insights/${id}`,
        { summary: editingText },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Insight updated successfully!");
      setInsights(insights.map((i) => (i._id === id ? res.data.insight : i)));
      cancelEditing();
    } catch (error) {
      console.error("Failed to update insight:", error);
      toast.error("Failed to update insight");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

        {/* Questions List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          {loading && !questions.length ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q) => (
                <div
                  key={q._id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition ${
                    selectedQuestion?._id === q._id
                      ? "border-2 border-indigo-500"
                      : "border border-gray-200"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{q.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{q.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {q.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted by: {q.createdBy?.name || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights Section */}
        {selectedQuestion && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Insights for: {selectedQuestion.title}
            </h2>

            {/* Add Insight Form */}
            <form onSubmit={handleSubmitInsight} className="mb-4">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write insight summary..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
              />
              <button
                type="submit"
                disabled={submitting}
                className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                  submitting ? "cursor-not-allowed bg-gray-400" : ""
                }`}
              >
                {submitting ? "Submitting..." : "Add Insight"}
              </button>
            </form>

            {/* Insights List */}
            {loading && !insights.length ? (
              <p>Loading insights...</p>
            ) : insights.length === 0 ? (
              <p>No insights yet for this question.</p>
            ) : (
              <div className="space-y-4">
                {insights.map((i) => (
                  <div
                    key={i._id}
                    className="bg-gray-50 p-4 rounded-md border border-gray-200 relative"
                  >
                    {editingInsightId === i._id ? (
                      <div>
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEditing(i._id)}
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
                        <p>{i.summary}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          — {i.createdBy?.name || "You"} |{" "}
                          {new Date(i.createdAt).toLocaleString()}
                        </p>

                        {/* Only show actions if this user created it */}
                        {!loading && i.createdBy?._id === userObj?.id && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => startEditing(i._id, i.summary)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteInsight(i._id)}
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
