import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch("http://localhost:5000/api/evaluate/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data)) setResults(data);
        else setError(data.error || "Failed to load history");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to connect to server");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#050816] text-white min-h-screen p-10">
      <button onClick={() => navigate("/")} className="text-indigo-400 mb-6 hover:underline">← Back</button>
      <h1 className="text-3xl font-bold mb-8">Evaluation <span className="text-indigo-500">History</span></h1>

      {loading && <p className="text-gray-400">Loading history...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-400">No evaluation history found.</p>
      )}

      {results.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {results.map((r, i) => (
            <div key={i} className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
              <p className="text-lg font-semibold">{r.student_name || "Unknown Student"}</p>
              <p className="text-gray-400 text-sm">Roll: {r.roll_number}</p>
              <p className="text-gray-400 text-sm">Score: {r.score} / {r.total_marks}</p>
              <p className="text-gray-500 text-xs mt-2">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}