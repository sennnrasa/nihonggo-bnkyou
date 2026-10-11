import { useState, useEffect } from "react";
import { generateQuizQuestions } from "../utils/quizGenerator";
import { playJapaneseSpeech } from "../utils/audio";
import {
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Volume2,
  Trophy,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
  ListCheck
} from "lucide-react";
import { useProgress } from "../context/ProgressContext";
import { useStudent } from "../context/StudentContext";
export const QuizModule = ({
  onNavigateTab,
  initialMode = "katakana-to-romaji"
}) => {
  const { recordDailyActivity } = useProgress();
  const { recordQuizCompleted, currentStudent } = useStudent();
  const [stage, setStage] = useState("setup");
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  useEffect(() => {
    if (initialMode) {
      setSelectedMode(initialMode);
    }
  }, [initialMode]);
  const handleStartQuiz = () => {
    const generated = generateQuizQuestions(selectedMode, questionCount);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setStreak(0);
    setHighestStreak(0);
    setStartTime(Date.now());
    setStage("playing");
    if (generated[0]?.audioPrompt) {
      setTimeout(() => {
        playJapaneseSpeech(generated[0].audioPrompt);
      }, 400);
    }
  };
  const currentQuestion = questions[currentIndex];
  const handleSelectOption = (option) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(option);
    setIsAnswered(true);
    const isCorrect = option === currentQuestion.correctAnswer;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > highestStreak) {
      setHighestStreak(newStreak);
    }
    if (currentQuestion.audioPrompt) {
      playJapaneseSpeech(currentQuestion.audioPrompt);
    }
    const answerRecord = {
      question: currentQuestion,
      selectedAnswer: option,
      isCorrect
    };
    setUserAnswers((prev) => [...prev, answerRecord]);
  };
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
      if (questions[nextIdx]?.audioPrompt) {
        setTimeout(() => {
          playJapaneseSpeech(questions[nextIdx].audioPrompt);
        }, 200);
      }
    } else {
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const score = Math.round(correctCount / questions.length * 100);
      const durationSeconds = Math.round((Date.now() - startTime) / 1e3);
      const summary = {
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        score,
        mode: selectedMode,
        durationSeconds,
        answers: userAnswers
      };
      setSummaryData(summary);
      recordDailyActivity();
      recordQuizCompleted(selectedMode, correctCount, questions.length);
      setStage("summary");
    }
  };
  const handlePlayPromptAudio = async () => {
    if (!currentQuestion?.audioPrompt) return;
    setIsAudioPlaying(true);
    await playJapaneseSpeech(currentQuestion.audioPrompt, 0.85);
    setIsAudioPlaying(false);
  };
  return <div className="space-y-6">
      {
    /* ================= STAGE 1: SETUP SCREEN ================= */
  }
      {stage === "setup" && <div className="max-w-4xl mx-auto space-y-6">
          {
    /* Hero Banner */
  }
          <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-rose-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Dynamic Quiz Generator
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Latihan Soal & Kuis Interaktif
              </h1>
              <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
                Sistem kuis dinamis yang mengacak dari ratusan kombinasi huruf dan kosakata. Uji daya ingat, kecepatan membaca, dan pemahaman bahasa Jepang Anda dengan umpan balik langsung.
              </p>
            </div>
          </div>

          {
    /* Mode Selection Cards */
  }
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-700 dark:text-rose-400" />
                1. Pilih Kategori & Materi Kuis
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Pilih kuis kosakata JLPT N5 lengkap, materi huruf Kana, partikel tata bahasa, atau kata kerja.
              </p>
            </div>

            {
    /* Sub-group 1: Kuis Kosakata JLPT N5 Lengkap */
  }
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Kuis Kosakata:</span>
              </div>
              <button
    type="button"
    onClick={() => setSelectedMode("n5-vocab")}
    className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${selectedMode === "n5-vocab" ? "border-rose-600 bg-rose-50 dark:bg-rose-950/60 shadow-xs ring-2 ring-rose-200 dark:ring-rose-900/60" : "border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-800/60"}`}
  >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-black text-xl flex items-center justify-center shrink-0">
                    🌸
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      Kosakata Lengkap JLPT N5 (200+ Kata)
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      Salam, Angka, Waktu, Makanan, Keluarga, Benda, Tempat, Kata Sifat & Kata Kerja Dasar
                    </div>
                  </div>
                </div>
                {selectedMode === "n5-vocab" && <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-200/60 dark:bg-rose-900/60 px-2.5 py-1 rounded-full">
                    Terpilih
                  </span>}
              </button>
            </div>

            {
    /* Sub-group 2: Huruf Kana & Tata Bahasa */
  }
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Kuis Huruf, Kata Kerja & Partikel:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
    {
      mode: "hiragana-to-romaji",
      title: "Hiragana \u2794 Romaji",
      desc: "Membaca karakter Hiragana & kata dasar"
    },
    {
      mode: "katakana-to-romaji",
      title: "Katakana \u2794 Romaji",
      desc: "Karakter Katakana & kata serapan"
    },
    {
      mode: "particles",
      title: "Partikel Kalimat (\u52A9\u8A5E)",
      desc: "Tebak partikel tepat pada kalimat rumpang"
    },
    {
      mode: "verbs",
      title: "Kata Kerja (\u52D5\u8A5E)",
      desc: "Bentuk kamus, masu, te & arti verba"
    }
  ].map((item) => <button
    key={item.mode}
    type="button"
    onClick={() => setSelectedMode(item.mode)}
    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${selectedMode === item.mode ? "border-rose-600 bg-rose-50 dark:bg-rose-950/60 shadow-xs ring-2 ring-rose-200 dark:ring-rose-900/60" : "border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-800/60"}`}
  >
                    <div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100">{item.title}</div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">{item.desc}</div>
                    </div>
                    {selectedMode === item.mode && <div className="mt-2 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terpilih</span>
                      </div>}
                  </button>)}
              </div>
            </div>

            {
    /* Question Count Selector */
  }
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3">
                2. Jumlah Soal per Sesi:
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {[10, 20, 30, 50].map((num) => <button
    key={num}
    onClick={() => setQuestionCount(num)}
    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${questionCount === num ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                    {num} Soal {num === 10 ? "(Cepat)" : num === 20 ? "(Rekomendasi)" : num === 50 ? "(Maraton)" : ""}
                  </button>)}
              </div>
            </div>

            {
    /* Start Button */
  }
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-600 dark:text-stone-400">
                Didukung oleh lebih dari <strong>100+ kombinasi acak</strong> soal dinamis tanpa batas pengulangan.
              </div>
              <button
    id="btn-start-quiz"
    onClick={handleStartQuiz}
    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-rose-200 dark:shadow-none transition-all cursor-pointer"
  >
                <Play className="w-4 h-4 fill-white" />
                Mulai Sesi Kuis Sekarang
              </button>
            </div>
          </div>
        </div>}

      {
    /* ================= STAGE 2: ACTIVE QUESTION SCREEN ================= */
  }
      {stage === "playing" && currentQuestion && <div className="max-w-2xl mx-auto space-y-5">
          {
    /* Top Progress Bar & Live Stats */
  }
          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2.5 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                  Soal {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">
                  Mode:{" "}
                  {selectedMode === "katakana-to-romaji" ? "Katakana \u2794 Romaji" : selectedMode === "romaji-to-katakana" ? "Romaji \u2794 Katakana" : "Hiragana \u2794 Romaji"}
                </span>
              </div>

              {
    /* Streak Badge */
  }
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                <Flame className={`w-3.5 h-3.5 ${streak > 0 ? "text-amber-500 fill-amber-500" : "text-stone-400"}`} />
                <span>Streak: {streak}x</span>
              </div>
            </div>

            {
    /* Progress Track */
  }
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
    className="bg-rose-700 h-full rounded-full transition-all duration-300"
    style={{ width: `${(currentIndex + 1) / questions.length * 100}%` }}
  />
            </div>
          </div>

          {
    /* Main Question Card */
  }
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6 text-center transition-colors">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {currentQuestion.promptType === "kana" ? "Apa Romaji dari huruf/kata ini?" : "Pilih Katakana yang tepat untuk Romaji ini:"}
              </span>

              {
    /* Big Question Prompt */
  }
              <div className="py-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700/60 relative group flex flex-col items-center justify-center">
                <div
    className={`font-black tracking-wide text-stone-900 dark:text-stone-100 select-none ${currentQuestion.promptType === "kana" ? "text-5xl sm:text-6xl font-['Noto_Sans_JP']" : "text-3xl sm:text-4xl font-mono"}`}
  >
                  {currentQuestion.prompt}
                </div>

                {
    /* Indonesian Meaning Hint if present */
  }
                {currentQuestion.meaningIndo && <div className="mt-2 text-xs font-medium text-stone-600 dark:text-stone-300">
                    Arti: <span className="font-semibold text-stone-800 dark:text-stone-100">{currentQuestion.meaningIndo}</span>
                  </div>}

                {
    /* Audio Button */
  }
                {currentQuestion.audioPrompt && <button
    onClick={handlePlayPromptAudio}
    disabled={isAudioPlaying}
    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
  >
                    <Volume2 className={`w-3.5 h-3.5 ${isAudioPlaying ? "animate-bounce text-rose-700 dark:text-rose-400" : ""}`} />
                    Dengarkan Pelafalan
                  </button>}
              </div>
            </div>

            {
    /* 4 Multiple Choice Options */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
    const label = ["A", "B", "C", "D"][idx];
    const isSelected = selectedOption === option;
    const isCorrect = option === currentQuestion.correctAnswer;
    let optionStyles = "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200";
    if (isAnswered) {
      if (isCorrect) {
        optionStyles = "border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-300 dark:ring-emerald-800 font-bold";
      } else if (isSelected) {
        optionStyles = "border-rose-500 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-300 dark:ring-rose-800";
      } else {
        optionStyles = "border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30 text-stone-500 dark:text-stone-400 opacity-60";
      }
    }
    return <button
      key={`${currentQuestion.id}-${option}-${idx}`}
      id={`quiz-option-${idx}`}
      onClick={() => handleSelectOption(option)}
      disabled={isAnswered}
      className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${optionStyles}`}
    >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300">
                        {label}
                      </span>
                      <span className={`text-base font-semibold ${selectedMode === "romaji-to-katakana" ? "font-['Noto_Sans_JP'] text-xl" : ""}`}>
                        {option}
                      </span>
                    </div>

                    {isAnswered && <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                      </div>}
                  </button>;
  })}
            </div>

            {
    /* Instant Feedback Banner */
  }
            {isAnswered && <div
    className={`p-4 rounded-2xl border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${selectedOption === currentQuestion.correctAnswer ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100" : "border-rose-200 dark:border-rose-800 bg-rose-50/90 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100"}`}
  >
                <div className="flex items-start gap-2.5">
                  {selectedOption === currentQuestion.correctAnswer ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}
                  <div>
                    <div className="font-bold text-sm">
                      {selectedOption === currentQuestion.correctAnswer ? "Benar Sekali! (\u6B63\u89E3 - Seikai)" : "Kurang Tepat"}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                      Jawaban benar:{" "}
                      <strong className="text-stone-900 dark:text-stone-100 font-bold">{currentQuestion.correctAnswer}</strong>
                      {currentQuestion.meaningIndo && ` (${currentQuestion.meaningIndo})`}
                    </div>
                  </div>
                </div>

                <button
    id="btn-next-question"
    onClick={handleNextQuestion}
    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
  >
                  {currentIndex + 1 === questions.length ? "Lihat Ringkasan Nilai" : "Lanjut ke Soal Berikutnya"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>}
          </div>
        </div>}

      {
    /* ================= STAGE 3: SUMMARY SCORECARD SCREEN ================= */
  }
      {stage === "summary" && summaryData && <div className="max-w-3xl mx-auto space-y-6">
          {
    /* Main Score Card */
  }
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-sm text-center space-y-6 transition-colors">
            <div className="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                Sesi Kuis Selesai!
              </h2>
              <p className="text-stone-700 dark:text-stone-300 text-sm">
                Mode:{" "}
                <strong>
                  {summaryData.mode === "katakana-to-romaji" ? "Katakana ke Romaji" : summaryData.mode === "romaji-to-katakana" ? "Romaji ke Katakana" : summaryData.mode === "n5-vocab" ? "Kosakata Lengkap N5" : summaryData.mode === "particles" ? "Partikel Kalimat" : summaryData.mode === "verbs" ? "Kata Kerja (Verba)" : "Hiragana ke Romaji"}
                </strong>
              </p>
            </div>

            {
    /* Score Ring / Display */
  }
            <div className="py-4">
              <div className="text-6xl sm:text-7xl font-black text-rose-700 dark:text-rose-400 tracking-tight">
                {summaryData.score}
                <span className="text-2xl text-stone-500 dark:text-stone-400 font-bold">/100</span>
              </div>
              <div className="mt-2 text-sm font-bold text-stone-800 dark:text-stone-200">
                {summaryData.score >= 90 ? "\u{1F31F} Luar Biasa! Pemahaman Sempurna (\u3059\u3070\u3089\u3057\u3044)" : summaryData.score >= 75 ? "\u{1F44D} Sangat Bagus! Tinggal sedikit latihan lagi (\u3088\u304F\u3067\u304D\u307E\u3057\u305F)" : summaryData.score >= 60 ? "\u{1F4AA} Cukup Baik! Teruslah mengasah ingatan (\u304C\u3093\u3070\u3063\u3066)" : "\u{1F4D6} Perlu lebih banyak latihan kosakata & tabel huruf (\u3082\u3046\u3044\u3061\u3069)"}
              </div>
            </div>

            {
    /* Breakdown Stats Grid */
  }
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-xs text-stone-500 dark:text-stone-400">Benar</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {summaryData.correctAnswers} Soal
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-xs text-stone-500 dark:text-stone-400">Salah</div>
                <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {summaryData.totalQuestions - summaryData.correctAnswers} Soal
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-xs text-stone-500 dark:text-stone-400">Streak Tertinggi</div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  🔥 {highestStreak}x
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-xs text-stone-500 dark:text-stone-400">Waktu Tempuh</div>
                <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1">
                  {summaryData.durationSeconds} detik
                </div>
              </div>
            </div>

            {
    /* Action Buttons */
  }
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
    id="btn-retry-quiz"
    onClick={handleStartQuiz}
    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
  >
                <RotateCcw className="w-4 h-4" />
                Ulangi Kuis (Soal Baru Acak)
              </button>

              <button
    id="btn-change-mode"
    onClick={() => setStage("setup")}
    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
  >
                Ganti Mode / Jumlah Soal
              </button>
            </div>
          </div>

          {
    /* Detailed Question Review List */
  }
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
              <ListCheck className="w-5 h-5 text-rose-700 dark:text-rose-400" />
              Tinjauan Jawaban ({summaryData.answers.length} Soal)
            </h3>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 space-y-2">
              {summaryData.answers.map((ans, idx) => <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold font-['Noto_Sans_JP'] text-base text-stone-900 dark:text-stone-100">
                        {ans.question.prompt}
                        {ans.question.meaningIndo && <span className="text-xs font-normal text-stone-500 dark:text-stone-400 ml-2">
                            ({ans.question.meaningIndo})
                          </span>}
                      </div>
                      <div className="text-xs text-stone-700 dark:text-stone-300 mt-1 flex flex-wrap items-center gap-3">
                        <span>
                          Jawaban Anda:{" "}
                          <strong className={ans.isCorrect ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-rose-700 dark:text-rose-400 font-bold"}>
                            {ans.selectedAnswer}
                          </strong>
                        </span>
                        {!ans.isCorrect && <span>
                            Jawaban Benar:{" "}
                            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                              {ans.question.correctAnswer}
                            </strong>
                          </span>}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {ans.isCorrect ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                      </span> : <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-1 rounded-md">
                        <XCircle className="w-3.5 h-3.5" /> Salah
                      </span>}
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
    </div>;
};
