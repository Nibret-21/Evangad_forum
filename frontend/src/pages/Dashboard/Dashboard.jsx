import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getQuestions,
  searchQuestionsSemantic,
} from "../../services/question/question.service";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const firstName = user?.firstName?.trim() || "there";

  const stats = useMemo(() => {
    const total = questions.length;
    const replies = questions.reduce(
      (sum, q) => sum + Number(q.answerCount || 0),
      0,
    );
    const unanswered = questions.filter((q) => !q.answerCount).length;

    return { total, replies, unanswered };
  }, [questions]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setMessage("");

      const keyword = searchParams.get("q");
      const semantic = searchParams.get("semantic");

      if (semantic) {
        const result = await searchQuestionsSemantic(semantic);
        setQuestions(result.data || []);
        return;
      }

      if (keyword) {
        const result = await getQuestions({ search: keyword });
        setQuestions(result.data || []);
        return;
      }

      const result = await getQuestions();
      setQuestions(result.data || []);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [searchParams]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span>FORUM HOME</span>

        <h1>Good to see you, {firstName}.</h1>

        <p>Start a topic, revisit your own threads, or skim the live feed.</p>

        <div className={styles.quickActions}>
          <Link to="/questions/ask" className={styles.actionCard}>
            <strong>New question</strong>
            <small>Share context, errors, and what you already tried</small>
          </Link>

          <Link to="/my-questions" className={styles.actionCard}>
            <strong>Your topics</strong>
            <small>Filtered list of threads you authored</small>
          </Link>

          <Link to="/rag-documents" className={styles.actionCard}>
            <strong>Knowledge base</strong>
            <small>Upload docs and ask retrieval-backed questions</small>
          </Link>
        </div>

        <div className={styles.stats}>
          <div>
            <small>Questions</small>
            <strong>{stats.total}</strong>
          </div>

          <div>
            <small>Replies</small>
            <strong>{stats.replies}</strong>
          </div>

          <div>
            <small>Unanswered</small>
            <strong>{stats.unanswered}</strong>
          </div>

          <div>
            <small>Yours</small>
            <strong>
              {questions.filter((q) => q.author?.id === user?.id).length}
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.feed}>
        <div className={styles.feedHeader}>
          <div>
            <h2>Discussion feed</h2>
            <p>Your threads use a slim left accent in this list.</p>
          </div>

          <Link to="/questions/ask" className={styles.orangeButton}>
            New Question
          </Link>
        </div>

        {loading && (
          <div className={styles.loadingBox}>Loading recent questions...</div>
        )}

        {!loading && message && (
          <div className={styles.errorBox}>{message}</div>
        )}

        {!loading && !message && questions.length === 0 && (
          <div className={styles.emptyBox}>
            No questions found. Be the first to ask!
          </div>
        )}

        {!loading &&
          !message &&
          questions.map((question) => (
            <Link
              key={question.questionHash || question.id}
              to={`/questions/${question.questionHash}`}
              className={styles.thread}
            >
              <div className={styles.avatar}>
                {(question.author?.firstName || "U")[0]}
              </div>

              <div>
                <h3>{question.title}</h3>
                <p>{question.content}</p>
                <small>
                  {question.author?.firstName || "Unknown"}{" "}
                  {question.author?.lastName || ""} ·{" "}
                  {question.answerCount || 0} replies
                  {question.score ? ` · score ${question.score}` : ""}
                </small>
              </div>
            </Link>
          ))}
      </section>
    </div>
  );
}
