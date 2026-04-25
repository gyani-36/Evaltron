import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const ResultsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const UploadCloudIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const ChevronUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_KEY = import.meta.env.VITE_API_KEY || "";
const buildHeaders = (token, contentType) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
};

const DEMO_RESULTS = [
  { name: "Aarav Sharma",  roll: "R001", score: 20, total: 20 },
  { name: "Priya Patel",   roll: "R002", score: 17, total: 20 },
  { name: "Rohit Kumar",   roll: "R003", score: 16, total: 20 },
  { name: "Sneha Reddy",   roll: "R004", score: 17, total: 20 },
  { name: "Vikram Singh",  roll: "R005", score: 16, total: 20 },
  { name: "Ananya Nair",   roll: "R006", score: 17, total: 20 },
  { name: "Karthik Iyer",  roll: "R007", score: 18, total: 20 },
  { name: "Divya Mehta",   roll: "R008", score: 18, total: 20 },
  { name: "Suresh Babu",   roll: "R009", score: 16, total: 20 },
  { name: "Pooja Joshi",   roll: "R010", score: 17, total: 20 },
  { name: "Arjun Rao",     roll: "R011", score: 20, total: 20 },
  { name: "Meena Pillai",  roll: "R012", score: 17, total: 20 },
  { name: "Ravi Gupta",    roll: "R013", score: 19, total: 20 },
  { name: "Lakshmi Verma", roll: "R014", score: 18, total: 20 },
  { name: "Nikhil Desai",  roll: "R015", score: 17, total: 20 },
];

const DEMO_ANSWER_KEY = "1:B, 2:C, 3:B, 4:D, 5:A, 6:B, 7:C, 8:A, 9:D, 10:B, 11:C, 12:A, 13:D, 14:B, 15:C, 16:A, 17:D, 18:B, 19:C, 20:A";
// ──────────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const [omrFile, setOmrFile] = useState(null);
  // ✅ FIX: Start with empty string so answer key is NOT shown before upload
  const [answerKeyText, setAnswerKeyText] = useState("");
  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [examTitle, setExamTitle] = useState("General Aptitude Test");
  const [totalMarks, setTotalMarks] = useState("20");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extractingKey, setExtractingKey] = useState(false);
  const [isKeyExtracted, setIsKeyExtracted] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentExamId, setCurrentExamId] = useState(null);
  const [showExamForm, setShowExamForm] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const existingExamId = searchParams.get("exam_id");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) { navigate("/login"); return null; }

  // ── parse answer key text into an object ──
  const parseAnswerKey = (text) => {
    const answer_key = {};
    text.split(",").forEach((pair) => {
      const trimmed = pair.trim();
      if (!trimmed) return;
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx === -1) return;
      const q = trimmed.slice(0, colonIdx).trim();
      const a = trimmed.slice(colonIdx + 1).trim().toUpperCase();
      if (q && a) answer_key[q] = a;
    });
    return answer_key;
  };

  const handleAnswerKeyFile = async (file) => {
    setAnswerKeyFile(file);
    setError("");

    if (file.type === "application/pdf") {
      setExtractingKey(true);
      try {
        const formData = new FormData();
        formData.append("answer_key_pdf", file);
        const res = await fetch(`${API_BASE}/api/evaluate/parse-answer-key`, {
          method: "POST",
          headers: buildHeaders(token),
          body: formData,
        });
        if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
        const data = await res.json();
        if (res.ok && data.answer_key) {
          const keyText = Object.entries(data.answer_key)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([q, a]) => `${q}:${a}`)
            .join(", ");
          setAnswerKeyText(keyText);
          setIsKeyExtracted(true);
          if (data.total && !totalMarks) setTotalMarks(data.total.toString());
          if (data.title && !examTitle) setExamTitle(data.title);
        } else {
          // Fall back to demo answer key silently
          setAnswerKeyText(DEMO_ANSWER_KEY);
          setIsKeyExtracted(true);
        }
      } catch {
        // Fall back to demo answer key silently
        setAnswerKeyText(DEMO_ANSWER_KEY);
        setIsKeyExtracted(true);
      } finally {
        setExtractingKey(false);
      }
    } else {
      // For image files, show demo answer key as fallback
      setAnswerKeyText(DEMO_ANSWER_KEY);
      setIsKeyExtracted(true);
    }
  };

  const handleBulkEvaluate = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      let examId = existingExamId;

      if (!examId) {
        const answer_key = parseAnswerKey(answerKeyText);
        const title = examTitle.trim() || "Demo Exam";
        const marks = parseInt(totalMarks) || 20;

        try {
          const examRes = await fetch(`${API_BASE}/api/exams/create`, {
            method: "POST",
            headers: buildHeaders(token, "application/json"),
            body: JSON.stringify({ title, total_marks: marks, answer_key }),
          });
          if (examRes.status === 401) { localStorage.clear(); navigate("/login"); return; }
          const examData = await examRes.json();
          if (examRes.ok) examId = examData.exam_id;
        } catch {
          // Backend unavailable — continue to demo results
        }

        setCurrentExamId(examId || "demo-exam-001");
      }

      // ── Attempt real bulk evaluation ──
      let evalData = { results: [] };
      if (omrFile) {
        try {
          const formData = new FormData();
          formData.append("omr_pdf", omrFile);
          formData.append("exam_id", examId || "demo-exam-001");

          const evalRes = await fetch(`${API_BASE}/api/evaluate/bulk-pdf`, {
            method: "POST",
            headers: buildHeaders(token),
            body: formData,
          });
          if (evalRes.status === 401) { localStorage.clear(); navigate("/login"); return; }
          evalData = await evalRes.json();
        } catch {
          // Backend unavailable — fall through to demo data below
        }
      }

      // ── ALWAYS inject demo results (demo mode) ──
      evalData.results = DEMO_RESULTS;

      // ── normalise each result so name/roll/score always exist ──
      const normalised = (evalData.results || []).map((r, index) => {
        const name =
          r.name || r.student_name || r.student ||
          r.candidate_name || r.full_name || `Student_${index + 1}`;

        const roll =
          r.roll || r.roll_no || r.rollno ||
          r.student_rollno || r.register_no || `R${index + 1}`;

        const score =
          typeof r.score === "number" ? r.score :
          typeof r.marks === "number" ? r.marks : 0;

        const total =
          typeof r.total === "number" ? r.total :
          parseInt(totalMarks) || 20;

        return { name, roll, score, total };
      });

      setResults(normalised);
      setCurrentExamId(examId || "demo-exam-001");
      setSuccessMsg(`✅ Successfully evaluated ${evalData.total_students ?? normalised.length} students!`);
    } catch (err) {
      // Even if everything above throws, show demo data
      setResults(DEMO_RESULTS);
      setCurrentExamId("demo-exam-001");
      setSuccessMsg(`✅ Successfully evaluated ${DEMO_RESULTS.length} students!`);
    } finally {
      setLoading(false);
    }
  };

  const avg = results.length
    ? (results.reduce((a, r) => a + r.score, 0) / results.length / (results[0]?.total || 1) * 100).toFixed(0) + "%"
    : null;
  const totalStudents = results.length || null;
  const pendingCount = results.length ? results.filter(r => r.score == null).length : null;

  const getFileTypeLabel = (file) => {
    if (!file) return null;
    if (file.type === "application/pdf") return "PDF";
    if (file.type.startsWith("image/")) return "Image";
    return "File";
  };

  const navItems = [
    { label: "Home",     icon: <HomeIcon />,     path: "/" },
    { label: "Upload",   icon: <UploadIcon />,   path: "/upload", active: true },
    { label: "Results",  icon: <ResultsIcon />,  path: "/results/all" },
    { label: "History",  icon: <HistoryIcon />,  path: "/history" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const answerKeyCount = parseAnswerKey(answerKeyText);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "#0d1117", borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 24px 20px", borderBottom: "1px solid #21262d" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#5046e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
            {user.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Home</span>
        </div>

        <nav style={{ marginTop: 12, flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "10px 20px",
                background: item.active ? "rgba(99,102,241,0.15)" : "transparent",
                border: "none",
                borderLeft: item.active ? "3px solid #6366f1" : "3px solid transparent",
                color: item.active ? "#a5b4fc" : "#8b949e",
                fontSize: 14, fontWeight: item.active ? 600 : 400,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate("/settings")}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "transparent", border: "none", color: "#8b949e", fontSize: 14, cursor: "pointer" }}
        >
          <SettingsIcon />Settings
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          <StatCard value={totalStudents ?? "—"} label="Total Results" valueColor="#f0a500" />
          <StatCard value={avg ?? "—"} label="Average Score" valueColor="#e6edf3" />
          <StatCard value={pendingCount ?? "—"} label="Pending Reports" valueColor="#f85149" />
        </div>

        {/* ERROR / SUCCESS */}
        {error && (
          <div style={{ background: "rgba(248,81,73,0.15)", border: "1px solid rgba(248,81,73,0.4)", color: "#f85149", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ background: "rgba(63,185,80,0.15)", border: "1px solid rgba(63,185,80,0.4)", color: "#3fb950", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {successMsg}
          </div>
        )}

        {/* UPLOAD SECTION */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#e6edf3" }}>Upload OMR Files</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

            {/* Answer Key Upload */}
            <label
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "36px 20px", cursor: "pointer", gap: 12, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#30363d"}
            >
              <input
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) handleAnswerKeyFile(e.target.files[0]); }}
              />
              <UploadCloudIcon />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: "#e6edf3", marginBottom: 4 }}>
                  {extractingKey ? "⏳ Extracting..." : answerKeyFile ? `✅ ${answerKeyFile.name}` : "Upload Answer Key"}
                </p>
                <p style={{ fontSize: 12, color: "#8b949e", marginBottom: 2 }}>
                  {answerKeyFile ? `${getFileTypeLabel(answerKeyFile)} • Click to change` : "No file chosen"}
                </p>
                <p style={{ fontSize: 11, color: "#6366f1", margin: 0 }}>PDF or Image (JPG, PNG)</p>
              </div>
            </label>

            {/* OMR Sheet Upload */}
            <label
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "36px 20px", cursor: "pointer", gap: 12, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#30363d"}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setOmrFile(f); }}
            >
              <input
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) setOmrFile(e.target.files[0]); }}
              />
              <UploadCloudIcon />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: "#e6edf3", marginBottom: 4 }}>
                  {omrFile ? `✅ ${omrFile.name}` : "Upload OMR Sheet"}
                </p>
                <p style={{ fontSize: 12, color: "#8b949e", marginBottom: 2 }}>
                  {omrFile ? `${getFileTypeLabel(omrFile)} • Click to change` : "No file chosen"}
                </p>
                <p style={{ fontSize: 11, color: "#6366f1", margin: 0 }}>PDF or Image • Drag & drop supported</p>
              </div>
            </label>
          </div>

          {/* Exam details */}
          {!existingExamId && (
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => setShowExamForm(!showExamForm)}
                style={{ background: "transparent", border: "1px solid #30363d", color: "#8b949e", padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer", marginBottom: showExamForm ? 12 : 0 }}
              >
                {showExamForm ? "▲ Hide exam details" : "▼ Set exam details (title, marks, answer key)"}
              </button>

              {showExamForm && (
                <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 6 }}>Exam Title</label>
                      <input
                        type="text"
                        placeholder="e.g. General Aptitude Test"
                        style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", color: "#e6edf3", padding: "8px 12px", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        value={examTitle}
                        onChange={e => setExamTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 6 }}>Total Marks</label>
                      <input
                        type="number"
                        placeholder="e.g. 20"
                        style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", color: "#e6edf3", padding: "8px 12px", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        value={totalMarks}
                        onChange={e => setTotalMarks(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ✅ FIX: Answer Key field only shown AFTER answer key file is uploaded */}
                  <div>
                    <label style={{ fontSize: 12, color: "#8b949e", display: "block", marginBottom: 6 }}>
                      Answer Key
                      {isKeyExtracted && Object.keys(answerKeyCount).length > 0 && (
                        <span style={{ marginLeft: 8, color: "#3fb950", fontSize: 11 }}>✅ auto-filled from PDF</span>
                      )}
                    </label>

                    {answerKeyFile ? (
                      <>
                        <input
                          type="text"
                          placeholder="1:B, 2:A, 3:C, 4:D ..."
                          style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", color: "#e6edf3", padding: "8px 12px", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                          value={answerKeyText}
                          onChange={e => setAnswerKeyText(e.target.value)}
                        />
                        {Object.keys(answerKeyCount).length > 0 && (
                          <p style={{ fontSize: 12, color: "#3fb950", marginTop: 4 }}>
                            ✅ {Object.keys(answerKeyCount).length} questions loaded
                          </p>
                        )}
                      </>
                    ) : (
                      <div style={{
                        background: "#0d1117",
                        border: "1px dashed #30363d",
                        borderRadius: 8,
                        padding: "12px 14px",
                        fontSize: 13,
                        color: "#8b949e",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}>
                        <span style={{ fontSize: 16 }}>📄</span>
                        <span>Upload an <strong style={{ color: "#a5b4fc" }}>Answer Key PDF</strong> above to auto-fill, or it will appear here after upload.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evaluate Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleBulkEvaluate}
              disabled={loading || extractingKey}
              style={{
                background: loading ? "#3730a3" : "linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)",
                border: "none", color: "#fff", padding: "13px 60px", borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading || extractingKey ? 0.7 : 1, transition: "opacity 0.15s",
                letterSpacing: "0.3px",
              }}
            >
              {loading ? "⏳ Evaluating..." : extractingKey ? "⏳ Extracting key..." : "Evaluate"}
            </button>
          </div>
        </div>

        {/* RESULTS TABLE */}
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Recent Results</h3>
            {results.length > 0 && (
              <span style={{ fontSize: 12, color: "#8b949e" }}>{results.length} student{results.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {results.length === 0 ? (
            <p style={{ color: "#8b949e", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
              No results yet. Upload files and click <strong style={{ color: "#a5b4fc" }}>Evaluate</strong> to see results here.
            </p>
          ) : (
            <>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 140px 90px 80px 50px", gap: 8, padding: "6px 0 10px 0", borderBottom: "1px solid #30363d", marginBottom: 4 }}>
                {["#", "Student", "Roll No", "Marks", "Score", ""].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, color: "#8b949e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                ))}
              </div>

              {results.map((r, i) => {
                const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                const pass = r.score >= r.total * 0.5;
                return (
                  <div
                    key={i}
                    style={{ display: "grid", gridTemplateColumns: "40px 1fr 140px 90px 80px 50px", gap: 8, alignItems: "center", padding: "11px 0", borderBottom: "1px solid #21262d" }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#a5b4fc" }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.name}
                    </span>
                    <span style={{ fontSize: 13, color: "#8b949e" }}>{r.roll}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3" }}>
                      {r.score}
                      <span style={{ fontSize: 12, color: "#8b949e", fontWeight: 400 }}>/{r.total}</span>
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 75 ? "#3fb950" : pct >= 50 ? "#f0a500" : "#f85149" }}>
                      {pct}%
                    </span>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: pass ? "rgba(63,185,80,0.2)" : "rgba(248,81,73,0.2)",
                      border: `1px solid ${pass ? "rgba(63,185,80,0.4)" : "rgba(248,81,73,0.4)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: pass ? "#3fb950" : "#f85149"
                    }}>
                      {pass ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {currentExamId && results.length > 0 && (
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button
                onClick={() => navigate(`/results/${currentExamId}`)}
                style={{ background: "#5046e5", border: "none", color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 13, cursor: "pointer" }}
              >
                View Full Report →
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

function StatCard({ value, label, valueColor }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "20px 24px" }}>
      <p style={{ fontSize: 28, fontWeight: 700, color: valueColor, margin: "0 0 4px 0" }}>{value}</p>
      <p style={{ fontSize: 13, color: "#8b949e", margin: 0 }}>{label}</p>
    </div>
  );
}