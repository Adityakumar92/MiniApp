import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Questions
  const fetchQuestions = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:8080/questions/all",
      { search, tags },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    setQuestions(res.data);
  } catch (error) {
    console.error("Fetch Error:", error);
    toast.error("Failed to fetch questions");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchQuestions();
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

  const handleFilter = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Questions</h1>

        {/* Filters */}
        <form
          onSubmit={handleFilter}
          className="flex flex-wrap items-center gap-3 mb-8 bg-white shadow p-4 rounded-lg"
        >
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
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

          <input
            type="text"
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={handleTagAdd}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Add Tag
          </button>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Apply Filter
          </button>
        </form>

        {/* Questions List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500">No questions found.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <div
                key={q._id}
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/question/${q._id}`)}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {q.title}
                </h2>
                <p className="text-gray-600 line-clamp-3">
                  {q.description.slice(0, 200)}...
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between text-sm text-gray-500">
                  <div className="flex gap-2 flex-wrap">
                    {q.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p>By: {q.createdBy?.name || "Unknown"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

