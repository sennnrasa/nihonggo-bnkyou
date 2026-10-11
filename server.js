import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3e3;
app.use(express.json());
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
const SENSEI_SYSTEM_INSTRUCTION = `Anda adalah "Nihongo Sensei" (\u65E5\u672C\u8A9E\u5148\u751F), seorang guru bahasa Jepang yang ramah, sabar, cerdas, dan interaktif.
Tugas Anda:
1. Membantu pembelajar bahasa Jepang dari tingkat pemula (N5) hingga mahir (N1).
2. Menjawab pertanyaan tentang kosakata, kanji, tata bahasa (grammar/bunpou), partikel, bentuk konjugasi kata kerja, dan budaya Jepang.
3. Selalu berikan penjelasan dalam bahasa Indonesia yang mudah dipahami, disertai tulisan aksara Jepang (Kanji/Kana), cara baca Romaji, dan arti/terjemahan bahasa Indonesia.
4. Jika pengguna berlatih percakapan (kaiwa), tanggapi dengan bahasa Jepang natural sesuai level mereka dan beri koreksi sopan jika ada kesalahan tata bahasa.
5. Berikan contoh kalimat aplikatif yang relevan untuk kehidupan sehari-hari atau ujian JLPT.
6. Berikan semangat (Ganbatte / \u9811\u5F35\u3063\u3066!) kepada pembelajar.`;
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, message, model = "gemini-3.1-flash-lite" } = req.body;
    if (!message && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: "Message is required" });
    }
    const rawContents = [];
    if (Array.isArray(messages)) {
      for (const msg of messages) {
        if (!msg.content) continue;
        rawContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: String(msg.content) }]
        });
      }
    }
    if (message && (!messages || messages[messages.length - 1]?.content !== message)) {
      rawContents.push({
        role: "user",
        parts: [{ text: String(message) }]
      });
    }

    let firstUserIdx = rawContents.findIndex((c) => c.role === "user");
    let sanitizedContents = firstUserIdx >= 0 ? rawContents.slice(firstUserIdx) : rawContents;
    if (sanitizedContents.length === 0) {
      sanitizedContents = [{ role: "user", parts: [{ text: String(message || "Konnichiwa Sensei!") }] }];
    }

    const preferredModel = model === "gemini-3.8-flash" ? "gemini-3.8-flash" : "gemini-3.1-flash-lite";
    const candidateModels = [
      preferredModel,
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash"
    ];
    const uniqueModels = [...new Set(candidateModels)];

    let reply = "";
    let lastError = null;

    for (const m of uniqueModels) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: sanitizedContents,
          config: {
            systemInstruction: SENSEI_SYSTEM_INSTRUCTION,
            temperature: 0.7
          }
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model ${m} failed:`, err?.message || err);
      }
    }

    if (!reply) {
      reply = "Konnichiwa! (こんにちは！) Saat ini server AI sedang mengalami antrean trafik tinggi. Namun Sensei tetap di sini untuk Anda! Ganbatte kudasai (頑張ってください)! Silakan kirimkan pertanyaan Anda kembali dalam beberapa saat, atau jelajahi materi kosakata N5 dan pola kalimat di menu atas.";
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat berkomunikasi dengan AI Sensei."
    });
  }
});
import fs from "fs";
const DB_FILE_PATH = path.join(__dirname, "students_db.json");
function loadStudents() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error loading students database:", err);
  }
  return [];
}
function saveStudents(students) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(students, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving students database:", err);
  }
}
let studentsDatabase = loadStudents();
app.post("/api/admin/verify-pin", (req, res) => {
  const { pin } = req.body;
  if (pin === "080515") {
    res.json({ success: true, message: "Akses Admin Diterima" });
  } else {
    res.status(401).json({ success: false, error: "PIN Admin salah. Masukkan PIN yang benar." });
  }
});
app.get("/api/students", (req, res) => {
  res.json({
    success: true,
    total: studentsDatabase.length,
    students: studentsDatabase
  });
});
app.post("/api/students/login", (req, res) => {
  const { name, className, currentLevel = "N5" } = req.body;
  if (!name || !className) {
    return res.status(400).json({ error: "Nama dan Kelas wajib diisi" });
  }
  const cleanName = String(name).trim();
  const cleanClass = String(className).trim();
  let student = studentsDatabase.find(
    (s) => s.name.toLowerCase() === cleanName.toLowerCase() && s.className.toLowerCase() === cleanClass.toLowerCase()
  );
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  if (student) {
    student.lastActive = nowIso;
  } else {
    student = {
      id: "std-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      className: cleanClass,
      currentLevel,
      quizzesTaken: 0,
      quizAvgScore: 0,
      wordsMastered: 0,
      grammarLearned: 0,
      flashcardsReviewed: 0,
      streakDays: 1,
      lastActive: nowIso,
      registeredAt: nowIso,
      quizHistory: []
    };
    studentsDatabase.unshift(student);
  }
  saveStudents(studentsDatabase);
  res.json({
    success: true,
    student,
    message: `Selamat datang, ${student.name}!`
  });
});
app.post("/api/students/progress", (req, res) => {
  const {
    studentId,
    name,
    className,
    currentLevel,
    quizResult,
    // { mode, score, total }
    wordsMastered,
    grammarLearned,
    flashcardsReviewed,
    streakDays
  } = req.body;
  let student;
  if (studentId) {
    student = studentsDatabase.find((s) => s.id === studentId);
  } else if (name && className) {
    student = studentsDatabase.find(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase() && s.className.toLowerCase() === className.trim().toLowerCase()
    );
  }
  if (!student) {
    return res.status(404).json({ error: "Data siswa tidak ditemukan" });
  }
  student.lastActive = (/* @__PURE__ */ new Date()).toISOString();
  if (currentLevel) {
    student.currentLevel = currentLevel;
  }
  if (typeof wordsMastered === "number") {
    student.wordsMastered = wordsMastered;
  }
  if (typeof grammarLearned === "number") {
    student.grammarLearned = grammarLearned;
  }
  if (typeof flashcardsReviewed === "number") {
    student.flashcardsReviewed = flashcardsReviewed;
  }
  if (typeof streakDays === "number") {
    student.streakDays = streakDays;
  }
  if (quizResult && typeof quizResult.score === "number" && typeof quizResult.total === "number") {
    const percentage = Math.round(quizResult.score / Math.max(1, quizResult.total) * 100);
    const newQuizRecord = {
      id: "q-" + Date.now(),
      date: (/* @__PURE__ */ new Date()).toISOString(),
      mode: quizResult.mode || "general",
      score: quizResult.score,
      total: quizResult.total,
      percentage
    };
    student.quizHistory.unshift(newQuizRecord);
    if (student.quizHistory.length > 20) {
      student.quizHistory = student.quizHistory.slice(0, 20);
    }
    student.quizzesTaken = (student.quizzesTaken || 0) + 1;
    const totalScorePercent = student.quizHistory.reduce((acc, q) => acc + q.percentage, 0);
    student.quizAvgScore = Math.round(totalScorePercent / student.quizHistory.length);
  }
  saveStudents(studentsDatabase);
  res.json({
    success: true,
    student
  });
});
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = studentsDatabase.length;
  studentsDatabase = studentsDatabase.filter((s) => s.id !== id);
  if (studentsDatabase.length < initialLength) {
    saveStudents(studentsDatabase);
    res.json({ success: true, message: "Data siswa berhasil dihapus" });
  } else {
    res.status(404).json({ error: "Siswa tidak ditemukan" });
  }
});
app.post("/api/students/reset", (req, res) => {
  studentsDatabase = [];
  saveStudents(studentsDatabase);
  res.json({ success: true, message: "Semua data siswa berhasil dibersihkan", students: [] });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
startServer();
