import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createQuestion,
  draftCoach,
} from "../../services/question/question.service";

export default function PostQuestion() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tips, setTips] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);

  const handleDraftCoach = async () => {
    try {
      setCoachLoading(true);
      setMessage("");

      const result = await draftCoach({ title, content });

      setTips(result.data?.tips || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to get AI tips");
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const result = await createQuestion({
        title,
        content,
      });

      navigate(`/questions/${result.data.questionHash}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: How do I connect React to Express?"
            style={{ display: "block", width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain your problem clearly..."
            rows="8"
            style={{ display: "block", width: "100%", padding: "10px" }}
          />
        </div>

        <button
          type="button"
          onClick={handleDraftCoach}
          disabled={coachLoading}
        >
          {coachLoading ? "Checking..." : "AI Draft Coach"}
        </button>

        <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>

      {tips.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>AI Suggestions</h3>
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

