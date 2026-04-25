import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", total_marks: "", answer_key: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchExams = () => {
    fetch("http://localhost:5000/api/exams/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
        return res.json();
      })
      .then((data) => { if (data && Array.isArray(data)) setExams(data); })
      .catch((err) => console.error("Failed to fetch exams:", err));
  };

  useEffect(() => { fetchExams(); }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfile && !e.target.closest(".profile-area")) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const answer_key = {};
      form.answer_key.split(",").forEach((pair) => {
        const [q, a] = pair.trim().split(":");
        if (q && a) answer_key[q.trim()] = a.trim().toUpperCase();
      });

      if (Object.keys(answer_key).length === 0) {
        throw new Error("Answer key is empty. Format: 1:A, 2:B, 3:C ...");
      }

      const res = await fetch("http://localhost:5000/api/exams/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          total_marks: parseInt(form.total_marks),
          answer_key,
        }),
      });

      const data = await res.json();
      if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
      if (!res.ok) throw new Error(data.error || "Failed to create exam");

      setForm({ title: "", description: "", total_marks: "", answer_key: "" });
      setShowCreateModal(false);
      fetchExams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    const res = await fetch(`http://localhost:5000/api/exams/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
    fetchExams();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-[#050816] text-white min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          Eval<span className="text-indigo-500">Tron</span>
        </h1>
        <div className="flex gap-8 text-gray-300">
          <button onClick={() => navigate("/")} className="hover:text-white transition">Home</button>
          <button onClick={() => navigate("/upload")} className="hover:text-white transition">Upload OMR</button>
          <button onClick={() => navigate("/results/all")} className="hover:text-white transition">Results</button>
          <button onClick={() => navigate("/history")} className="hover:text-white transition">History</button>
          <button onClick={() => navigate("/settings")} className="hover:text-white transition">Settings</button>
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-4 relative profile-area">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-indigo-700 transition">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-gray-400 text-sm">{user.name}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 bg-[#0f172a] border border-gray-700 rounded-xl shadow-lg w-48 z-50">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#1e293b] transition"
              >
                Settings
              </button>
              <button
                onClick={() => { navigate("/history"); setShowProfile(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#1e293b] transition"
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1e293b] transition rounded-b-xl"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center py-24">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to <span className="text-indigo-500">EvalTron</span> 🚀
        </h1>
        <p className="text-gray-400 mb-10">
          Automatic OMR answer sheet evaluation using image processing.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/upload")}
            className="bg-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Upload OMR →
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 px-8 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            + Create Exam
          </button>
        </div>
      </section>

      {/* EXAMS SECTION */}
      {exams.length > 0 && (
        <section className="py-10 px-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              Your <span className="text-indigo-500">Exams</span>
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              + New Exam
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-[#0f172a] p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition">
                <h3 className="text-xl font-semibold mb-1">{exam.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{exam.description}</p>
                <p className="text-gray-500 text-sm mb-4">Total Marks: {exam.total_marks}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/upload?exam_id=${exam.id}`)}
                    className="bg-indigo-600 px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition"
                  >
                    Upload Sheet
                  </button>
                  <button
                    onClick={() => navigate(`/results/${exam.id}`)}
                    className="bg-purple-600 px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                  >
                    View Results
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="bg-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HOW EVALTRON WORKS */}
      <section className="py-24 px-10 text-center">
        <h2 className="text-4xl font-bold mb-4">
          How <span className="text-indigo-500">EvalTron</span> Works
        </h2>
        <p className="text-gray-400 mb-14">A simple automated OMR evaluation process</p>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <h3 className="text-xl mb-3">Upload Answer Key</h3>
            <p className="text-gray-400 text-sm">Upload the correct answers for comparison.</p>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <h3 className="text-xl mb-3">Upload OMR Sheet</h3>
            <p className="text-gray-400 text-sm">Upload scanned OMR PDF or image.</p>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <h3 className="text-xl mb-3">Bubble Detection</h3>
            <p className="text-gray-400 text-sm">System detects filled bubbles automatically.</p>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <h3 className="text-xl mb-3">View Results</h3>
            <p className="text-gray-400 text-sm">Instant score and evaluation report.</p>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES USED */}
      <section className="py-24 px-10 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Technologies Used in <span className="text-indigo-500">EvalTron</span>
        </h2>
        <p className="text-gray-400 mb-14">Tools and technologies powering our OMR evaluation system</p>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-[#0f172a] p-6 rounded-xl">
            <h3 className="text-indigo-400 text-xl mb-2">React JS</h3>
            <p className="text-gray-400 text-sm">Frontend UI development</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl">
            <h3 className="text-indigo-400 text-xl mb-2">Tailwind CSS</h3>
            <p className="text-gray-400 text-sm">Modern responsive UI styling</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl">
            <h3 className="text-indigo-400 text-xl mb-2">Python + OpenCV</h3>
            <p className="text-gray-400 text-sm">OMR bubble detection algorithm</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl">
            <h3 className="text-indigo-400 text-xl mb-2">Node.js</h3>
            <p className="text-gray-400 text-sm">Backend API for evaluation</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-10 text-center">
        <h2 className="text-4xl font-bold mb-10">Trusted by Students</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-300 mb-4">"EvalTron reduced manual correction time drastically."</p>
            <p className="text-indigo-400">Anil Kumar</p>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-300 mb-4">"Very accurate OMR detection."</p>
            <p className="text-indigo-400">Sneha Reddy</p>
          </div>
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <p className="text-gray-300 mb-4">"Perfect tool for college exams."</p>
            <p className="text-indigo-400">Rahul Prasad</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-center py-20">
        <h2 className="text-4xl font-bold mb-6">Start Evaluating OMR Sheets Instantly</h2>
        <button
          onClick={() => navigate("/upload")}
          className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Upload OMR →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-10 text-center text-gray-500">
        <p>© 2026 EvalTron. All rights reserved.</p>
        <p>viit</p>
      </footer>

      {/* CREATE EXAM MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowCreateModal(false); setError(""); } }}
        >
          <div className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Exam</h3>
              <button
                onClick={() => { setShowCreateModal(false); setError(""); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Math Mid Term"
                  className="w-full bg-[#1e293b] border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 1-5"
                  className="w-full bg-[#1e293b] border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Total Marks</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  className="w-full bg-[#1e293b] border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  value={form.total_marks}
                  onChange={(e) => setForm({ ...form, total_marks: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Answer Key</label>
                <input
                  type="text"
                  placeholder="1:A, 2:B, 3:C, 4:D, 5:A"
                  className="w-full bg-[#1e293b] border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  value={form.answer_key}
                  onChange={(e) => setForm({ ...form, answer_key: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: 1:A, 2:B, 3:C ...</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold disabled:opacity-50 transition"
              >
                {loading ? "Creating..." : "Create Exam"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}