import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getQuestion } from "../../services/question/question.service";
import { answerService } from "../../services/answer/answer.service";
import styles from "./QuestionDetail.module.css";

export default function QuestionDetail() {
  const { questionHash } = useParams();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [fitResult, setFitResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await getQuestion(questionHash);

      setQuestion(result.question || result.data?.question);
      setAnswers(result.answers || result.data?.answers || []);
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Failed to load question details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [questionHash]);

  const handleAnswerFit = async () => {
    try {
      setMessage("");

      const result = await answerService.answerFit(questionHash, answerText);
      setFitResult(result.data || result);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to evaluate answer.");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!answerText.trim()) {
      setMessage("Please write an answer before posting.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await answerService.createAnswer({
        questionId: question.id,
        content: answerText,
      });

      setAnswerText("");
      setFitResult(null);

      await loadQuestion();
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Failed to post answer. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.centerState}>
        <p>Loading question details...</p>
      </section>
    );
  }

  if (!question) {
    return (
      <section className={styles.centerState}>
        <p className={styles.errorText}>Failed to load question details.</p>
        <Link to="/dashboard" className={styles.orangeBtn}>
          Return to Dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.main}>
        <Link to="/dashboard" className={styles.backLink}>
          ← Back to feed
        </Link>

        <article className={styles.questionCard}>
          <div className={styles.authorRow}>
            <div className={styles.avatar}>NU</div>
            <div>
              <h4>
                {question.author?.firstName || "New"}{" "}
                {question.author?.lastName || "User"}
              </h4>
              <p>Posted question</p>
            </div>
          </div>

          <h2>{question.title}</h2>
          <p className={styles.questionText}>{question.content}</p>

          <div className={styles.cardActions}>
            <button type="button">Share</button>
            <button type="button">{answers.length} Answers</button>
          </div>
        </article>

        <h3 className={styles.sectionTitle}>
          Community Answers ({answers.length})
        </h3>

        {answers.length === 0 ? (
          <div className={styles.emptyBox}>
            <div className={styles.emptyIcon}>▢</div>
            <h4>Be the first to help!</h4>
            <p>
              This question is waiting for an expert like you. Share your
              knowledge and earn reputation points.
            </p>
          </div>
        ) : (
          <div className={styles.answers}>
            {answers.map((answer) => (
              <article key={answer.id} className={styles.answerCard}>
                <div className={styles.authorRow}>
                  <div className={styles.avatar}>NU</div>
                  <div>
                    <h4>
                      {answer.author?.firstName || "New"}{" "}
                      {answer.author?.lastName || "User"}
                    </h4>
                    <p>Community answer</p>
                  </div>
                </div>

                <p className={styles.answerText}>{answer.content}</p>
              </article>
            ))}
          </div>
        )}

        <form className={styles.answerForm} onSubmit={handleSubmitAnswer}>
          <h3>Contribute an answer</h3>

          {message && <p className={styles.errorText}>{message}</p>}

          <div className={styles.toolbar}>
            <span>B</span>
            <span>I</span>
            <span>🔗</span>
            <span>&lt;/&gt;</span>
            <small>{answerText.length} characters</small>
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer here..."
          />

          <div className={styles.formFooter}>
            <button
              type="button"
              className={styles.fitBtn}
              onClick={handleAnswerFit}
              disabled={!answerText.trim() || submitting}
            >
              Check draft fit
            </button>

            <button
              type="submit"
              className={styles.orangeBtn}
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Your Answer"}
            </button>
          </div>

          {fitResult && (
            <div className={styles.fitBox}>
              <strong>AI Answer Evaluation</strong>
              <p>
                <b>Level:</b> {fitResult.level}
              </p>
              <p>{fitResult.note}</p>
            </div>
          )}
        </form>
      </div>

      <aside className={styles.side}>
        <h3>Related Questions</h3>

        <div className={styles.relatedCard}>
          <h4>Persisting form state between route changes in React</h4>
          <p>Bring state</p>
        </div>
      </aside>
    </section>
  );
}
