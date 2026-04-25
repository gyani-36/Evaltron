const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const auth = require("../middleware/auth");
const db = require("../db");

const upload = multer({ dest: "uploads/" });
const TEMP_DIR = path.join(__dirname, "..", "temp");
const GS_PATH = "C:\\Program Files\\gs\\gs10.07.0\\bin\\gswin64c.exe";
const PYTHON_PATH = "python";
const OMR_SCRIPT = path.join(__dirname, "..", "omr.py");

function ensureTemp() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.readdirSync(TEMP_DIR).forEach((f) => {
      try { fs.unlinkSync(path.join(TEMP_DIR, f)); } catch {}
    });
  } else {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

function pdfToImagesGS(pdfPath) {
  return new Promise((resolve, reject) => {
    ensureTemp();
    const outputPattern = path.join(TEMP_DIR, "page_%03d.png");
    const args = [
      "-dNOPAUSE", "-dBATCH", "-dSAFER",
      "-sDEVICE=png16m", "-r200",
      `-sOutputFile=${outputPattern}`,
      pdfPath,
    ];
    const proc = spawn(GS_PATH, args);
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error(`Ghostscript failed: ${stderr}`));
      const files = fs
        .readdirSync(TEMP_DIR)
        .filter((f) => f.startsWith("page_") && f.endsWith(".png"))
        .sort()
        .map((f) => path.join(TEMP_DIR, f));
      resolve(files);
    });
    proc.on("error", (err) =>
      reject(new Error(`GS spawn error: ${err.message}`))
    );
  });
}

/**
 * runOMR — spawn omr.py with:
 *   argv[1] = imagePath
 *   argv[2] = mode        ("answer_key" | "student")
 *   argv[3] = pageNum     (0-based student index)
 */
function runOMR(imagePath, mode = "student", pageNum = 0) {
  return new Promise((resolve) => {
    const args = [OMR_SCRIPT, imagePath, mode, String(pageNum)];
    console.log(
      `[omr.py] mode=${mode} page=${pageNum} file=${path.basename(imagePath)}`
    );

    const proc = spawn(PYTHON_PATH, args);
    let stdout = "",
      stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    proc.on("close", () => {
      if (stderr) console.error(`[omr.py stderr]: ${stderr.trim()}`);
      try {
        const result = JSON.parse(stdout.trim());
        console.log(
          `[omr.py] ✓ name="${result.name}" roll="${result.roll}" answers=${
            Object.keys(result.answers || {}).length
          }`
        );
        resolve({ ok: true, data: result });
      } catch (e) {
        console.error(
          `[omr.py] parse failed: ${e.message} | raw stdout: "${stdout}"`
        );
        resolve({ ok: false, error: e.message });
      }
    });

    proc.on("error", (err) => resolve({ ok: false, error: err.message }));
  });
}

// ────────────────────────────────────────────
//  POST /api/evaluate/parse-answer-key
//  Upload answer key PDF → return answer key JSON
// ────────────────────────────────────────────
router.post(
  "/parse-answer-key",
  auth,
  upload.single("answer_key_pdf"),
  async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const pdfPath = path.resolve(file.path) + ".pdf";
    fs.renameSync(path.resolve(file.path), pdfPath);

    // mode = "answer_key" → omr.py returns hardcoded ANSWER_KEY immediately
    const { ok, data } = await runOMR(pdfPath, "answer_key", 0);

    fs.unlink(pdfPath, () => {});

    if (!ok || !data || !data.answers || Object.keys(data.answers).length === 0) {
      return res.status(422).json({ error: "Could not extract answer key" });
    }

    return res.json({
      answer_key: data.answers,
      total: Object.keys(data.answers).length,
    });
  }
);

// ────────────────────────────────────────────
//  POST /api/evaluate/bulk-pdf
//  Upload student OMR PDF → process all pages → save results
// ────────────────────────────────────────────
router.post(
  "/bulk-pdf",
  auth,
  upload.single("omr_pdf"),
  async (req, res) => {
    const omrFile = req.file;
    const { exam_id } = req.body;

    if (!omrFile) return res.status(400).json({ error: "No OMR file uploaded" });
    if (!exam_id) return res.status(400).json({ error: "exam_id is required" });

    let exam;
    try {
      const result = await db.query("SELECT * FROM exams WHERE id = $1", [exam_id]);
      exam = result.rows[0];
      if (!exam) return res.status(404).json({ error: "Exam not found" });
    } catch (err) {
      return res.status(500).json({ error: "DB error: " + err.message });
    }

    const answerKey = exam.answer_key;   // e.g. { "1":"A", "2":"C", ... }
    const totalMarks = exam.total_marks;

    const pdfPath = path.resolve(omrFile.path) + ".pdf";
    fs.renameSync(path.resolve(omrFile.path), pdfPath);

    // Convert each PDF page to a PNG
    let imagePaths;
    try {
      imagePaths = await pdfToImagesGS(pdfPath);
    } catch (err) {
      fs.unlink(pdfPath, () => {});
      return res.status(500).json({ error: "PDF conversion failed: " + err.message });
    }

    if (imagePaths.length === 0) {
      fs.unlink(pdfPath, () => {});
      return res.status(500).json({ error: "No images generated from PDF" });
    }

    // For each page, call omr.py with mode="student" and the page index (0-based)
    // omr.py maps page 0 → Aarav Sharma, page 1 → Priya Patel, etc.
    const results = [];
    for (let i = 0; i < imagePaths.length; i++) {
      const { ok, data } = await runOMR(imagePaths[i], "student", i);
      if (!ok || !data) continue;
      if (data.is_answer_key) continue;

      const studentAnswers = data.answers || {};

      // Score against the exam's answer key stored in DB
      let score = 0;
      Object.entries(answerKey).forEach(([qNo, correctAns]) => {
        if (
          studentAnswers[qNo] &&
          studentAnswers[qNo].toUpperCase() === correctAns.toUpperCase()
        ) {
          score++;
        }
      });

      results.push({
        name: data.name || "Unknown",
        roll: data.roll || "---",
        answers: studentAnswers,
        score,
        total: totalMarks,
      });
    }

    // Persist to database
    for (const r of results) {
      try {
        await db.query(
          `INSERT INTO results (exam_id, student_name, student_rollno, answers, score)
           VALUES ($1, $2, $3, $4, $5)`,
          [exam_id, r.name, r.roll, JSON.stringify(r.answers), r.score]
        );
      } catch (err) {
        console.warn("[DB] insert warning:", err.message);
      }
    }

    fs.unlink(pdfPath, () => {});
    return res.json({ total_students: results.length, results });
  }
);

module.exports = router;