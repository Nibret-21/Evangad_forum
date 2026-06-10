// /**
//  * Dashboard: default home after login; question list, quick actions, URL-driven search.
//  * Data: `questionService` (keyword `q`, semantic `semantic`, or full list).
//  */
/**
 * Dashboard: default home after login; question list, quick actions, URL-driven search.
 * Data: getQuestions for keyword search, searchQuestionsSemantic for AI similarity search.
 */
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getQuestions,
  searchQuestionsSemantic,
} from "../../services/question/question.service";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const firstName = user?.firstName?.trim();

  const welcomeLine = firstName
    ? `Good to see you, ${firstName}.`
    : "Welcome to the forum.";

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setMessage("");

      const keyword = searchParams.get("q");
      const semantic = searchParams.get("semantic");

      if (semantic) {
        setSearch(semantic);

        const result = await searchQuestionsSemantic(semantic);
        setQuestions(result.data || []);
        return;
      }

      if (keyword) {
        setSearch(keyword);

        const result = await getQuestions({
          search: keyword,
          page: 1,
          limit: 10,
        });

        setQuestions(result.data || []);
        return;
      }

      setSearch("");

      const result = await getQuestions({
        page: 1,
        limit: 10,
      });

      setQuestions(result.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      q: search.trim(),
    });
  };

  const handleAiSearch = () => {
    if (!search.trim()) {
      setMessage("Please type something before AI Search.");
      return;
    }

    setSearchParams({
      semantic: search.trim(),
    });
  };

  const handleReset = () => {
    setSearch("");
    setSearchParams({});
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.welcome}>{welcomeLine}</h2>

      <div className={styles.actions}>
        <Link to="/questions/ask">
          <button className={styles.askButton}>Ask Question</button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <button type="submit" className={styles.searchButton}>
          Search
        </button>

        <button
          type="button"
          onClick={handleAiSearch}
          className={styles.aiButton}
        >
          AI Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={{ padding: "10px", marginLeft: "8px" }}
        >
          Reset
        </button>
      </form>

      {loading && <p>Loading questions...</p>}
      {message && <p>{message}</p>}

      {!loading && questions.length === 0 && <p>No questions found.</p>}

      {questions.map((question) => (
        <div
          key={question.questionHash || question.id}
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        >
          <Link to={`/questions/${question.questionHash}`}>
            <h3>{question.title}</h3>
          </Link>

          <p>{question.content}</p>

          <small>
            Answers: {question.answerCount || 0} | By:{" "}
            {question.author?.firstName} {question.author?.lastName}
          </small>

          {question.score && (
            <p>
              <small>Similarity score: {question.score}</small>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   getQuestions,
//   searchQuestionsSemantic,
// } from "../../services/question/question.service";

// export default function Dashboard() {
//   const { user } = useAuth();

//   const [questions, setQuestions] = useState([]);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   const firstName = user?.firstName?.trim();
//   const welcomeLine = firstName
//     ? `Good to see you, ${firstName}.`
//     : "Welcome to the forum.";

//   const fetchQuestions = async () => {
//     try {
//       setLoading(true);
//       setMessage("");

//       const result = search.trim()
//         ? await questionService.searchQuestions(search)
//         : await questionService.getQuestions();

//       setQuestions(result.data || []);
//     } catch (error) {
//       setMessage(error.response?.data?.msg || "Failed to load questions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchQuestions();
//   };

//   return (
//     <div>
//       <h3>{welcomeLine}</h3>

//       <div style={{ margin: "20px 0" }}>
//         <Link to="/questions/ask">
//           <button>Ask Question</button>
//         </Link>
//       </div>

//       <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           placeholder="Search questions..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ padding: "10px", width: "70%" }}
//         />

//         <button type="submit" style={{ padding: "10px", marginLeft: "8px" }}>
//           Search
//         </button>

//         <button
//           type="button"
//           onClick={() => {
//             setSearch("");
//             fetchQuestions();
//           }}
//           style={{ padding: "10px", marginLeft: "8px" }}
//         >
//           Reset
//         </button>
//       </form>

//       {loading && <p>Loading questions...</p>}

//       {message && <p>{message}</p>}

//       {!loading && questions.length === 0 && <p>No questions found.</p>}

//       <div>
//         {questions.map((question) => (
//           <div
//             key={question.questionHash}
//             style={{
//               border: "1px solid #ddd",
//               padding: "16px",
//               borderRadius: "8px",
//               marginBottom: "12px",
//             }}
//           >
//             <Link to={`/questions/${question.questionHash}`}>
//               <h3>{question.title}</h3>
//             </Link>

//             <p>{question.content}</p>

//             <small>
//               Answers: {question.answerCount || 0} | By:{" "}
//               {question.author?.firstName} {question.author?.lastName}
//             </small>

//             {question.score && (
//               <p>
//                 <small>Similarity score: {question.score}</small>
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
