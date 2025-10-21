import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AskQuestion = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUserQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/questions/byuser", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUserQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch user questions:", error);
      toast.error("Failed to fetch your questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserQuestions();
  }, []);

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        "http://localhost:8080/questions",
        { title, description, tags },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("Question submitted successfully!");
      setTitle("");
      setDescription("");
      setTags([]);
      setShowForm(false);

      setUserQuestions([res.data.question, ...userQuestions]);
    } catch (error) {
      console.error("Failed to submit question:", error);
      toast.error("Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {showForm ? "Close Form" : "Ask a Question"}
          </button>

          {showForm && (
            <form
              onSubmit={handleSubmitQuestion}
              className="mt-4 bg-white p-6 rounded-lg shadow-md space-y-4"
            >
              <input
                type="text"
                placeholder="Question title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleTagAdd}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  Add Tag
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                  submitting ? "cursor-not-allowed bg-gray-400" : ""
                }`}
              >
                {submitting ? "Submitting..." : "Submit Question"}
              </button>
            </form>
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Your Past Questions</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : userQuestions.length === 0 ? (
          <p className="text-gray-500">You haven't asked any questions yet.</p>
        ) : (
          <div className="space-y-4">
            {userQuestions.map((q) => (
              <div
                key={q._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">{q.title}</h3>
                <p className="text-gray-600 line-clamp-3">{q.description}</p>
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
    </div>
  );
};

export default AskQuestion;
