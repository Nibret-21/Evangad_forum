import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuestions } from "../../services/question/question.service";

export default function MyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMyQuestions = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await getQuestions({
        mine: "true",
        page: 1,
        limit: 10,
      });

      setQuestions(result.data || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load my questions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyQuestions();
  }, []);

  return (
    <div>
      <h2>My Questions</h2>

      {loading && <p>Loading my questions...</p>}
      {message && <p>{message}</p>}

      {!loading && questions.length === 0 && (
        <p>You have not posted any questions yet.</p>
      )}

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

          <small>Answers: {question.answerCount || 0}</small>
        </div>
      ))}
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getQuestions } from "../../services/question/question.service";

// export default function MyQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   const loadMyQuestions = async () => {
//     try {
//       setLoading(true);
//       setMessage("");

//       const result = await getQuestions();
//       setQuestions(result.data || []);
//     } catch (error) {
//       setMessage(error.response?.data?.msg || "Failed to load my questions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMyQuestions();
//   }, []);

//   if (loading) {
//     return <p>Loading my questions...</p>;
//   }

//   return (
//     <div>
//       <h2>My Questions</h2>

//       {message && <p>{message}</p>}

//       {questions.length === 0 && <p>You have not posted any questions yet.</p>}

//       {questions.map((question) => (
//         <div
//           key={question.questionHash}
//           style={{
//             border: "1px solid #ddd",
//             padding: "16px",
//             borderRadius: "8px",
//             marginBottom: "12px",
//           }}
//         >
//           <Link to={`/questions/${question.questionHash}`}>
//             <h3>{question.title}</h3>
//           </Link>

//           <p>{question.content}</p>

//           <small>Answers: {question.answerCount || 0}</small>
//         </div>
//       ))}
//     </div>
//   );
// }
