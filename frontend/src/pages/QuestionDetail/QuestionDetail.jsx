import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestion } from "../../services/question/question.service";
import { answerService } from "../../services/answer/answer.service";

export default function QuestionDetail() {
  const { questionHash } = useParams();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [fitResult, setFitResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadQuestion = async () => {
    try {
      setLoading(true);

      const result = await getQuestion(questionHash);

      setQuestion(result.question || result.data?.question);
      setAnswers(result.answers || result.data?.answers || []);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [questionHash]);

  const handleAnswerFit = async () => {
    try {
      const result = await answerService.answerFit(questionHash, answerText);

      setFitResult(result.data);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to evaluate answer");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    try {
      await answerService.createAnswer({
        questionHash,
        content: answerText,
      });

      setAnswerText("");
      setFitResult(null);

      await loadQuestion();
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to post answer");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!question) {
    return <p>Question not found.</p>;
  }

  return (
    <div>
      <h2>{question.title}</h2>

      <p>{question.content}</p>

      <hr />

      <h3>Answers ({answers.length})</h3>

      {answers.length === 0 && <p>No answers yet.</p>}

      {answers.map((answer) => (
        <div
          key={answer.id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p>{answer.content}</p>

          <small>
            {answer.author?.firstName} {answer.author?.lastName}
          </small>
        </div>
      ))}

      <hr />

      <h3>Write Answer</h3>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmitAnswer}>
        <textarea
          rows="6"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Write your answer..."
          style={{
            width: "100%",
            padding: "10px",
          }}
        />

        <div style={{ marginTop: "10px" }}>
          <button type="button" onClick={handleAnswerFit}>
            Check AI Fit
          </button>

          <button type="submit" style={{ marginLeft: "10px" }}>
            Post Answer
          </button>
        </div>
      </form>

      {fitResult && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4>AI Answer Evaluation</h4>

          <p>
            <strong>Level:</strong> {fitResult.level}
          </p>

          <p>{fitResult.note}</p>
        </div>
      )}
    </div>
  );
}
