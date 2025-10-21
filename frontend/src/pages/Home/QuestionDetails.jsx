import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const QuestionDetails = () => {
  const { id } = useParams(); // question id from URL
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch question details
  const fetchQuestionDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/questions/${id}`, {
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
      const res = await axios.get(
        `http://localhost:8080/answers/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
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

  // Submit a new answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        `http://localhost:8080/answers/${id}`,
        { content: newAnswer }, // matches your controller
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Answer submitted!");
      setNewAnswer("");
      setAnswers([res.data.answer, ...answers]); // update answers immediately
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
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
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{question.title}</h1>
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
        <h2 className="text-xl font-semibold mb-4">Answers ({answers.length})</h2>
        {answers.length === 0 ? (
          <p className="text-gray-500">No answers yet.</p>
        ) : (
          <div className="space-y-4">
            {answers.map((a) => (
              <div
                key={a._id}
                className="bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <p className="text-gray-700">{a.content || a.answer}</p>
                <p className="text-sm text-gray-500 mt-2">
                  — {a.createdBy?.name || "Anonymous"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
