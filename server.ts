import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt for Japanese Sensei AI Tutor
const SENSEI_SYSTEM_INSTRUCTION = `Anda adalah "Nihongo Sensei" (日本語先生), seorang guru bahasa Jepang yang ramah, sabar, cerdas, dan interaktif.
Tugas Anda:
1. Membantu pembelajar bahasa Jepang dari tingkat pemula (N5) hingga mahir (N1).
2. Menjawab pertanyaan tentang kosakata, kanji, tata bahasa (grammar/bunpou), partikel, bentuk konjugasi kata kerja, dan budaya Jepang.
3. Selalu berikan penjelasan dalam bahasa Indonesia yang mudah dipahami, disertai tulisan aksara Jepang (Kanji/Kana), cara baca Romaji, dan arti/terjemahan bahasa Indonesia.
4. Jika pengguna berlatih percakapan (kaiwa), tanggapi dengan bahasa Jepang natural sesuai level mereka dan beri koreksi sopan jika ada kesalahan tata bahasa.
5. Berikan contoh kalimat aplikatif yang relevan untuk kehidupan sehari-hari atau ujian JLPT.
6. Berikan semangat (Ganbatte / 頑張って!) kepada pembelajar.`;

// API endpoint for multi-turn Gemini chat with fallback support
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message, model = 'gemini-3.1-flash-lite' } = req.body;

    if (!message && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format conversation history for @google/genai SDK
    // Convert previous user/assistant messages to contents array
    const rawContents: any[] = [];

    if (Array.isArray(messages)) {
      for (const msg of messages) {
        if (!msg.content) continue;
        rawContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(msg.content) }],
        });
      }
    }

    // Add current user message if not already included
    if (message && (!messages || messages[messages.length - 1]?.content !== message)) {
      rawContents.push({
        role: 'user',
        parts: [{ text: String(message) }],
      });
    }

    // Ensure the conversation begins with a 'user' turn as required by Gemini
    let firstUserIdx = rawContents.findIndex((c) => c.role === 'user');
    let sanitizedContents = firstUserIdx >= 0 ? rawContents.slice(firstUserIdx) : rawContents;

    if (sanitizedContents.length === 0) {
      sanitizedContents = [{ role: 'user', parts: [{ text: String(message || 'Konnichiwa Sensei!') }] }];
    }

    // Fallback waterfall: try requested model, then flash-lite, then flash-latest, then flash
    const preferredModel = model === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite';
    const candidateModels = [
      preferredModel,
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash',
    ];
    const uniqueModels = [...new Set(candidateModels)];

    let reply = '';
    let lastError: any = null;

    for (const m of uniqueModels) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: sanitizedContents,
          config: {
            systemInstruction: SENSEI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${m} failed:`, err?.message || err);
      }
    }

    if (!reply) {
      // If all live API attempts fail or model unavailable, give friendly Sensei response
      console.error('All Gemini candidate models failed. Last error:', lastError?.message);
      reply = `Konnichiwa! (こんにちは！) Saat ini server AI sedang mengalami antrean trafik tinggi. Namun Sensei tetap di sini untuk Anda! Ganbatte kudasai (頑張ってください)! Silakan kirimkan pertanyaan Anda kembali dalam beberapa saat, atau jelajahi materi kosakata N5 dan pola kalimat di menu atas.`;
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Terjadi kesalahan saat berkomunikasi dengan AI Sensei.',
    });
  }
});

import fs from 'fs';

// =========================================================================
// STUDENT TRACKING & ADMIN MONITORING REAL DATABASE
// NO DUMMY DATA - Only real students who log in with their Name & Class
// =========================================================================
interface QuizRecord {
  id: string;
  date: string;
  mode: string;
  score: number;
  total: number;
  percentage: number;
}

interface StudentRecord {
  id: string;
  name: string;
  className: string;
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  quizzesTaken: number;
  quizAvgScore: number;
  wordsMastered: number;
  grammarLearned: number;
  flashcardsReviewed: number;
  streakDays: number;
  lastActive: string;
  registeredAt: string;
  quizHistory: QuizRecord[];
}

const DB_FILE_PATH = path.join(__dirname, 'students_db.json');

function loadStudents(): StudentRecord[] {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading students database:', err);
  }
  return [];
}

function saveStudents(students: StudentRecord[]) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(students, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving students database:', err);
  }
}

let studentsDatabase: StudentRecord[] = loadStudents();

// POST /api/admin/verify-pin: Verify admin PIN (080515)
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body;
  if (pin === '080515') {
    res.json({ success: true, message: 'Akses Admin Diterima' });
  } else {
    res.status(401).json({ success: false, error: 'PIN Admin salah. Masukkan PIN yang benar.' });
  }
});

// GET /api/students: Fetch all real students for teacher / admin table
app.get('/api/students', (req, res) => {
  res.json({
    success: true,
    total: studentsDatabase.length,
    students: studentsDatabase,
  });
});

// POST /api/students/login: Student login by Name and Class only
app.post('/api/students/login', (req, res) => {
  const { name, className, currentLevel = 'N5' } = req.body;

  if (!name || !className) {
    return res.status(400).json({ error: 'Nama dan Kelas wajib diisi' });
  }

  const cleanName = String(name).trim();
  const cleanClass = String(className).trim();

  // Find existing student by exact or case-insensitive match
  let student = studentsDatabase.find(
    (s) =>
      s.name.toLowerCase() === cleanName.toLowerCase() &&
      s.className.toLowerCase() === cleanClass.toLowerCase()
  );

  const nowIso = new Date().toISOString();

  if (student) {
    student.lastActive = nowIso;
  } else {
    // Register new student
    student = {
      id: 'std-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      className: cleanClass,
      currentLevel: currentLevel as any,
      quizzesTaken: 0,
      quizAvgScore: 0,
      wordsMastered: 0,
      grammarLearned: 0,
      flashcardsReviewed: 0,
      streakDays: 1,
      lastActive: nowIso,
      registeredAt: nowIso,
      quizHistory: [],
    };
    studentsDatabase.unshift(student);
  }

  saveStudents(studentsDatabase);

  res.json({
    success: true,
    student,
    message: `Selamat datang, ${student.name}!`,
  });
});

// POST /api/students/progress: Update student progress
app.post('/api/students/progress', (req, res) => {
  const {
    studentId,
    name,
    className,
    currentLevel,
    quizResult, // { mode, score, total }
    wordsMastered,
    grammarLearned,
    flashcardsReviewed,
    streakDays,
  } = req.body;

  let student: StudentRecord | undefined;

  if (studentId) {
    student = studentsDatabase.find((s) => s.id === studentId);
  } else if (name && className) {
    student = studentsDatabase.find(
      (s) =>
        s.name.toLowerCase() === name.trim().toLowerCase() &&
        s.className.toLowerCase() === className.trim().toLowerCase()
    );
  }

  if (!student) {
    return res.status(404).json({ error: 'Data siswa tidak ditemukan' });
  }

  student.lastActive = new Date().toISOString();

  if (currentLevel) {
    student.currentLevel = currentLevel;
  }
  if (typeof wordsMastered === 'number') {
    student.wordsMastered = wordsMastered;
  }
  if (typeof grammarLearned === 'number') {
    student.grammarLearned = grammarLearned;
  }
  if (typeof flashcardsReviewed === 'number') {
    student.flashcardsReviewed = flashcardsReviewed;
  }
  if (typeof streakDays === 'number') {
    student.streakDays = streakDays;
  }

  // Handle quiz record
  if (quizResult && typeof quizResult.score === 'number' && typeof quizResult.total === 'number') {
    const percentage = Math.round((quizResult.score / Math.max(1, quizResult.total)) * 100);
    const newQuizRecord: QuizRecord = {
      id: 'q-' + Date.now(),
      date: new Date().toISOString(),
      mode: quizResult.mode || 'general',
      score: quizResult.score,
      total: quizResult.total,
      percentage,
    };

    student.quizHistory.unshift(newQuizRecord);
    // Keep max 20 history records
    if (student.quizHistory.length > 20) {
      student.quizHistory = student.quizHistory.slice(0, 20);
    }

    student.quizzesTaken = (student.quizzesTaken || 0) + 1;

    // Recalculate average score
    const totalScorePercent = student.quizHistory.reduce((acc, q) => acc + q.percentage, 0);
    student.quizAvgScore = Math.round(totalScorePercent / student.quizHistory.length);
  }

  saveStudents(studentsDatabase);

  res.json({
    success: true,
    student,
  });
});

// DELETE /api/students/:id: Delete student (admin action)
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = studentsDatabase.length;
  studentsDatabase = studentsDatabase.filter((s) => s.id !== id);

  if (studentsDatabase.length < initialLength) {
    saveStudents(studentsDatabase);
    res.json({ success: true, message: 'Data siswa berhasil dihapus' });
  } else {
    res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }
});

// POST /api/students/reset: Clear all data (Admin reset)
app.post('/api/students/reset', (req, res) => {
  studentsDatabase = [];
  saveStudents(studentsDatabase);
  res.json({ success: true, message: 'Semua data siswa berhasil dibersihkan', students: [] });
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
