import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResultPage() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    if (!examId || examId === "all") {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/evaluate/results/${examId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data)) setResults(data);
        else setError(data.error || "Failed to load results");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to connect to server");
        setLoading(false);
      });
  }, [examId]);

  const totalQuestions = results[0]?.total || 0;
  const avgScore = results.length
    ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1)
    : 0;
  const highest = results.length ? Math.max(...results.map((r) => r.score)) : 0;
  const lowest = results.length ? Math.min(...results.map((r) => r.score)) : 0;

  // "all" view — redirect to dashboard where exam cards have View Results buttons
  if (examId === "all") {
    return (
      <div className="bg-[#050816] text-white min-h-screen flex flex-col items-center pt-16 px-6">
        <h2 className="text-4xl font-bold mb-4">All Results</h2>
        <p className="text-gray-400 mb-8">Select an exam from your dashboard to view its results.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#050816] text-white min-h-screen flex flex-col items-center pt-16 px-6">

      <h2 className="text-4xl font-bold mb-4">Evaluation Results</h2>
      <p className="text-gray-400 mb-12">Exam ID: {examId}</p>

      {loading && <p className="text-gray-400">Loading results...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {results.length > 0 && (
        <div className="grid md:grid-cols-2 gap-10 mb-12 w-full max-w-2xl">
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Total Students</p>
            <h3 className="text-indigo-400 text-2xl font-bold">{results.length}</h3>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Average Score</p>
            <h3 className="text-green-400 text-2xl font-bold">{avgScore} / {totalQuestions}</h3>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Highest Score</p>
            <h3 className="text-green-400 text-2xl font-bold">{highest} / {totalQuestions}</h3>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Lowest Score</p>
            <h3 className="text-red-400 text-2xl font-bold">{lowest} / {totalQuestions}</h3>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="w-full max-w-4xl bg-[#0f172a] rounded-xl p-6 mb-10">
          <h3 className="text-xl font-semibold mb-4">Student-wise Results</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Student</th>
                <th className="text-left py-2">Roll No</th>
                <th className="text-left py-2">Marks Secured</th>
                <th className="text-left py-2">Percentage</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const percentage = r.total > 0
                  ? ((r.score / r.total) * 100).toFixed(1)
                  : "0.0";
                return (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-3 font-semibold">{r.student_name}</td>
                    <td className="py-3 text-gray-400">{r.student_rollno}</td>
                    <td className={`py-3 font-bold ${r.score >= r.total * 0.75 ? "text-green-400" : "text-red-400"}`}>
                      {r.score} / {r.total}
                    </td>
                    <td className="py-3 font-bold text-yellow-400">{percentage}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${r.score >= r.total * 0.5 ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                        {r.score >= r.total * 0.5 ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <p className="text-gray-400 mb-10">No results found for this exam yet.</p>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        Back to Dashboard
      </button>

    </div>
  );
}