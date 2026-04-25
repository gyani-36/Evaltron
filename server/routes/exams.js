const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const auth = require("../middleware/auth");
const pdfParse = require("pdf-parse");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG/PNG images or PDF files allowed"));
  },
});

async function extractAnswerKeyFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text;

  console.log("ANSWER KEY PDF TEXT:", text);

  const answer_key = {};
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);

  for (let i = 0; i < lines.length; i++) {
    const qMatch = lines[i].match(/^Q(\d+)$/i);
    if (qMatch && lines[i + 1]) {
      const answer = lines[i + 1].trim();
      if (/^[ABCD]$/i.test(answer)) {
        answer_key[qMatch[1]] = answer.toUpperCase();
      }
    }
  }

  console.log("EXTRACTED ANSWER KEY:", answer_key);
  return answer_key;
}

router.post("/create", auth, upload.single("answer_key_file"), async (req, res) => {
  const { title, description, total_marks } = req.body;
  let { answer_key } = req.body;

  if (!title || !total_marks)
    return res.status(400).json({ error: "title and total_marks are required" });

  try {
    if (req.file) {
      const filePath = req.file.path;
      try {
        const extracted = await extractAnswerKeyFromPDF(filePath);
        if (Object.keys(extracted).length > 0) {
          answer_key = extracted;
        } else {
          return res.status(400).json({
            error: "Could not extract answer key from file. Please type it manually e.g. 1:A, 2:B",
          });
        }
      } finally {
        fs.unlink(filePath, () => {});
      }

    } else if (typeof answer_key === "string" && answer_key.trim()) {
      const parsed = {};
      answer_key.split(",").forEach((pair) => {
        const [q, a] = pair.trim().split(":");
        if (q && a) parsed[q.trim()] = a.trim().toUpperCase();
      });
      if (Object.keys(parsed).length === 0)
        return res.status(400).json({ error: "Invalid answer key format. Use: 1:A, 2:B, 3:C" });
      answer_key = parsed;
    } else {
      return res.status(400).json({
        error: "Please upload an answer key file or enter it manually",
      });
    }

    db.run(
      "INSERT INTO exams (title, description, answer_key, total_marks, owner_id) VALUES (?, ?, ?, ?, ?)",
      [title, description || "", JSON.stringify(answer_key), total_marks, req.user.id],
      function (err) {
        if (err) return res.status(500).json({ error: "Failed to create exam" });
        return res.status(201).json({ message: "Exam created", exam_id: this.lastID });
      }
    );

  } catch (err) {
    console.error("Exam create error:", err.message);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
});

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM exams WHERE owner_id = ?", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const parsed = rows.map((e) => ({ ...e, answer_key: JSON.parse(e.answer_key) }));
    return res.json(parsed);
  });
});

router.get("/:id", auth, (req, res) => {
  db.get(
    "SELECT * FROM exams WHERE id = ? AND owner_id = ?",
    [req.params.id, req.user.id],
    (err, exam) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!exam) return res.status(404).json({ error: "Exam not found" });
      return res.json({ ...exam, answer_key: JSON.parse(exam.answer_key) });
    }
  );
});

router.delete("/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM exams WHERE id = ? AND owner_id = ?",
    [req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      if (this.changes === 0) return res.status(404).json({ error: "Exam not found" });
      return res.json({ message: "Exam deleted" });
    }
  );
});

module.exports = router;