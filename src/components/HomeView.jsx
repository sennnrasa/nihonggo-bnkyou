import React, { useState } from "react";
import {
  Flame,
  Target,
  Sparkles,
  Trophy,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Bot,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Volume2,
  Star,
  Layers,
  Compass,
  FileText,
  TrendingUp
} from "lucide-react";
import { useProgress } from "../context/ProgressContext";
import { useStudent } from "../context/StudentContext";
import { VOCAB_N5 } from "../data/vocabData";
import { PARTICLES_DATA } from "../data/particlesData";
import { VERBS_DATA } from "../data/verbsData";
import { HIRAGANA_DATA, KATAKANA_DATA } from "../data/kanaData";
import { GRAMMAR_PATTERNS } from "../data/grammarData";
import { playJapaneseSpeech } from "../utils/audio";

export const HomeView = ({ onNavigateTab, onOpenStudentModal }) => {
  const { currentStudent, setIsAuthModalOpen } = useStudent();
  const {
    currentStreak,
    longestStreak,
    isTodayPracticed,
    recordDailyActivity,
    weeklyStreakDays,
    totalMastered,
    totalItems,
    totalPercentage,
    rankTitle,
    rankBadgeEmoji,
    dailyVocabGoal,
    setDailyVocabGoal,
    dailyVocabLearnedCount,
    dailyVocabGoalProgressPercent,
    isDailyVocabGoalAchieved,
    favoriteVocabCount,
    favoriteGrammarCount,
    favoriteTotalCount,
    favoriteVocabList,
    favoriteGrammarList,
    toggleVocabFavorite,
    toggleGrammarFavorite
  } = useProgress();

  const [savedFilterTab, setSavedFilterTab] = useState("all");
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const handlePlaySavedVocabAudio = async (text, id) => {
    setPlayingAudioId(id);
    await playJapaneseSpeech(text, 0.85);
    setPlayingAudioId(null);
  };

  const handlePlaySavedGrammarAudio = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleManualCheckIn = () => {
    recordDailyActivity();
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HERO BANNER: RETRO PIXEL RPG ADVENTURE STYLE
      ========================================================================= */}
      <div className="pixel-box bg-[#1c1917] dark:bg-[#12131a] text-[#faf8f0] p-5 sm:p-7 relative overflow-hidden">
        {/* Retro scanline accent */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#292524] border-2 border-[#78350f] text-[#fbbf24] text-[10px] font-pixel">
              <span>{rankBadgeEmoji}</span>
              <span>{rankTitle.toUpperCase()}</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-pixel text-[#fbbf24] tracking-tight leading-tight">
              KONNICHIWA! NIHONGOQUEST N5 🌸
            </h1>

            {/* Explanation strictly in readable clean font */}
            <p className="font-explanation text-xs sm:text-sm text-stone-300 leading-relaxed">
              Selamat datang di petualangan belajar bahasa Jepang JLPT N5 gaya retro pixel. Kuasai huruf Kana, kosakata esensial, partikel, konjugasi verba, serta tata bahasa dengan bimbingan audio penutur asli dan tutor AI Sensei.
            </p>
          </div>

          {/* Quick Mastery Stat Block */}
          <div className="bg-[#292524] border-2 border-stone-600 p-4 sm:p-5 min-w-[170px] text-center shrink-0 shadow-[2px_2px_0_0_#000]">
            <div className="text-3xl sm:text-4xl font-pixel text-rose-400">
              {totalPercentage}%
            </div>
            <div className="font-pixel text-[10px] text-stone-300 uppercase tracking-wider mt-1">
              {totalMastered} / {totalItems}
            </div>
            <div className="font-explanation text-[11px] text-stone-400 mt-0.5">
              Materi Dikuasai
            </div>
            <div className="w-full bg-[#1c1917] border border-stone-600 h-2 mt-3 p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-[#fbbf24] h-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, totalPercentage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STUDENT CONNECTION / PROFILE BAR: PIXEL STYLE
      ========================================================================= */}
      <div className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-600 flex items-center justify-center font-pixel text-amber-700 dark:text-amber-300 text-xs shrink-0">
            {currentStudent ? currentStudent.name.charAt(0).toUpperCase() : "P1"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                {currentStudent ? currentStudent.name : "PEMAIN TAMU (GUEST)"}
              </span>
              {currentStudent && (
                <span className="font-pixel text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 border border-emerald-400">
                  {currentStudent.className}
                </span>
              )}
            </div>
            <div className="font-explanation text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {currentStudent
                ? `Tersinkronisasi • ${currentStudent.quizzesTaken || 0} kuis selesai (Rata-rata: ${currentStudent.quizAvgScore || 0}%)`
                : "Masuk akun siswa agar riwayat belajar dan kuis tersimpan di rekap nilai kelas."}
            </div>
          </div>
        </div>

        <div>
          {currentStudent ? (
            <button
              onClick={() => onNavigateTab("progress")}
              className="pixel-btn px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-pixel text-[10px] cursor-pointer"
            >
              LIHAT PROGRES SAYA
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenStudentModal) onOpenStudentModal();
                else setIsAuthModalOpen(true);
              }}
              className="pixel-btn px-3.5 py-1.5 bg-amber-400 text-stone-950 font-pixel text-[10px] cursor-pointer shadow-[2px_2px_0_0_#000]"
            >
              MASUK AKUN SISWA
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          DAILY TARGET & STREAK SECTION (2-COL)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Vocab Target Card */}
        <div className="pixel-box bg-[#ffffff] dark:bg-[#1a1b26] p-5 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 pixel-box-sm bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                  TARGET KOSAKATA HARIAN
                </h3>
                <span className="font-pixel text-[9px] text-stone-500">
                  {dailyVocabLearnedCount} / {dailyVocabGoal} KATA
                </span>
              </div>
            </div>
            {isDailyVocabGoalAchieved ? (
              <span className="font-pixel text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-400">
                ★ TERCAPAI
              </span>
            ) : (
              <span className="font-pixel text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-400">
                ○ BERJALAN
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600 p-0.5">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, dailyVocabGoalProgressPercent)}%` }}
              />
            </div>
            <div className="flex justify-between font-pixel text-[9px] text-stone-500">
              <span>PROGRES: {dailyVocabGoalProgressPercent}%</span>
              <span>SISA: {Math.max(0, dailyVocabGoal - dailyVocabLearnedCount)} KATA</span>
            </div>
          </div>

          {/* Explanation in clear readable font */}
          <p className="font-explanation text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Hafalkan kosakata baru setiap hari untuk mempertahankan ritme belajar. Klik kartu kosakata N5 untuk langsung mulai belajar.
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab("n5")}
              className="pixel-btn px-3 py-1.5 bg-rose-600 text-white font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              BUKA KOSAKATA N5
            </button>
            <button
              onClick={() => onNavigateTab("flashcards")}
              className="pixel-btn px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-pixel text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              FLASHCARD
            </button>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="pixel-box bg-[#ffffff] dark:bg-[#1a1b26] p-5 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 pixel-box-sm bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <div>
                <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                  DAILY STREAK PEKAN INI
                </h3>
                <span className="font-pixel text-[9px] text-stone-500">
                  REKOR: {longestStreak} HARI
                </span>
              </div>
            </div>
            {isTodayPracticed ? (
              <span className="font-pixel text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-400">
                ★ HARI INI AMAN
              </span>
            ) : (
              <span className="font-pixel text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-400">
                ○ MENUNGGU
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-2xl text-amber-600 dark:text-amber-400">
              {currentStreak} HARI
            </span>
            <span className="font-pixel text-[10px] text-stone-500">BERTURUT-TURUT</span>
          </div>

          {/* Explanation in clear readable font */}
          <p className="font-explanation text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {isTodayPracticed
              ? "Hebat! Anda telah mencatat aktivitas belajar hari ini. Streak Anda aman untuk melanjutkan petualangan besok."
              : "Lakukan 1 aktivitas belajar, kuis, atau check-in sekarang untuk menyalakan api konsistensi belajar Anda!"}
          </p>

          <div className="pt-1 flex items-center gap-2">
            {!isTodayPracticed ? (
              <button
                onClick={handleManualCheckIn}
                className="pixel-btn px-3 py-1.5 bg-amber-400 text-stone-950 font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_#000]"
              >
                <Flame className="w-3.5 h-3.5 fill-stone-950" />
                {justCheckedIn ? "✓ TERCATAT!" : "CHECK-IN HARI INI"}
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab("progress")}
                className="pixel-btn px-3 py-1.5 bg-emerald-600 text-white font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                LIHAT GRAFIK 7 HARI
              </button>
            )}
            <button
              onClick={() => onNavigateTab("quiz")}
              className="pixel-btn px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-pixel text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              LATIHAN KUIS
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SAVED & FAVORITES SECTION (⭐ STARRED ITEMS)
      ========================================================================= */}
      <div className="pixel-box bg-[#ffffff] dark:bg-[#1a1b26] p-5 sm:p-7 space-y-6 transition-colors">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-stone-200 dark:border-stone-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 pixel-box-sm bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <h2 className="font-pixel text-sm sm:text-base text-stone-900 dark:text-[#faf8f0]">
                MATERI TERSIMPAN &amp; FAVORIT
              </h2>
            </div>
            {/* Explanation strictly in readable clean font */}
            <p className="font-explanation text-xs text-stone-600 dark:text-stone-400">
              Koleksi kosakata dan pola tata bahasa yang Anda tandai dengan bintang (⭐) untuk memudahkan pengulangan mandiri.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-pixel text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-1 border border-amber-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{favoriteTotalCount} TERSIMPAN</span>
            </span>

            {favoriteVocabCount > 0 && (
              <button
                onClick={() => onNavigateTab("flashcards")}
                className="pixel-btn px-3 py-1 bg-rose-600 text-white font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_0_#000]"
                title="Latih materi favorit Anda dengan kartu Flashcard 3D"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>LATIHAN FLASHCARD</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSavedFilterTab("all")}
            className={`pixel-btn px-3 py-1.5 text-[10px] font-pixel transition-all cursor-pointer ${
              savedFilterTab === "all"
                ? "bg-amber-500 text-stone-950 shadow-[2px_2px_0_0_#000]"
                : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
            }`}
          >
            SEMUA ({favoriteTotalCount})
          </button>

          <button
            onClick={() => setSavedFilterTab("vocab")}
            className={`pixel-btn px-3 py-1.5 text-[10px] font-pixel transition-all cursor-pointer flex items-center gap-1.5 ${
              savedFilterTab === "vocab"
                ? "bg-rose-600 text-white shadow-[2px_2px_0_0_#000]"
                : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>KOSAKATA ({favoriteVocabCount})</span>
          </button>

          <button
            onClick={() => setSavedFilterTab("grammar")}
            className={`pixel-btn px-3 py-1.5 text-[10px] font-pixel transition-all cursor-pointer flex items-center gap-1.5 ${
              savedFilterTab === "grammar"
                ? "bg-indigo-600 text-white shadow-[2px_2px_0_0_#000]"
                : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>POLA KALIMAT ({favoriteGrammarCount})</span>
          </button>
        </div>

        {/* Display Items or Empty State */}
        {favoriteTotalCount === 0 ? (
          <div className="text-center py-10 px-4 bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700 space-y-3">
            <div className="w-12 h-12 pixel-box bg-amber-100 dark:bg-amber-950 mx-auto flex items-center justify-center text-amber-500">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div className="font-pixel text-xs text-stone-900 dark:text-stone-100">
              BELUM ADA KOSAKATA ATAU POLA KALIMAT YANG DISIMPAN
            </div>
            {/* Explanation strictly in readable clean font */}
            <p className="font-explanation text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
              Tandai materi yang dirasa menantang dengan ikon bintang (⭐) pada modul Kosakata atau Pola Kalimat agar tersimpan otomatis di sini.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => onNavigateTab("n5")}
                className="pixel-btn px-3 py-1.5 bg-rose-600 text-white font-pixel text-[10px] cursor-pointer"
              >
                BUKA KOSAKATA N5
              </button>
              <button
                onClick={() => onNavigateTab("grammar")}
                className="pixel-btn px-3 py-1.5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-pixel text-[10px] cursor-pointer"
              >
                BUKA TATA BAHASA
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. VOCABULARY FAVORITES GRID */}
            {(savedFilterTab === "all" || savedFilterTab === "vocab") && favoriteVocabList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[10px] text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    KOSAKATA FAVORIT ({favoriteVocabList.length} KATA)
                  </span>
                  <button
                    onClick={() => onNavigateTab("n5")}
                    className="font-pixel text-[9px] text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>MODUL KOSAKATA N5</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {favoriteVocabList.map((item) => {
                    const isPlaying = playingAudioId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="pixel-box-sm bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 p-3.5 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-pixel text-[8px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 border border-rose-300">
                            {item.category}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handlePlaySavedVocabAudio(item.japanese, item.id)}
                              className="pixel-btn p-1 bg-white dark:bg-stone-800 cursor-pointer"
                              title="Dengarkan pengucapan audio"
                            >
                              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "text-rose-600 animate-bounce" : "text-stone-600 dark:text-stone-300"}`} />
                            </button>

                            <button
                              onClick={() => toggleVocabFavorite(item.id)}
                              className="pixel-btn p-1 bg-amber-100 border-amber-400 cursor-pointer text-amber-600"
                              title="Hapus dari Favorit"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="font-pixel-jp text-xl font-bold text-stone-900 dark:text-stone-100">
                            {item.japanese}
                          </div>
                          {item.reading && item.reading !== item.japanese && (
                            <div className="font-pixel-jp text-[11px] text-stone-500">
                              ({item.reading})
                            </div>
                          )}
                          <div className="font-pixel text-[9px] text-rose-600 dark:text-rose-400 mt-0.5">
                            {item.romaji}
                          </div>
                          {/* Explanation in clear readable font */}
                          <div className="font-explanation text-xs font-semibold text-stone-800 dark:text-stone-200 pt-1">
                            {item.indonesian}
                          </div>
                        </div>

                        {item.example && (
                          <div className="pt-1.5 border-t border-stone-200 dark:border-stone-800 space-y-0.5">
                            <div className="font-pixel-jp text-xs font-medium text-stone-800 dark:text-stone-200">
                              {item.example}
                            </div>
                            {/* Explanation translation in clear readable font */}
                            {item.exampleIndo && (
                              <div className="font-explanation text-[11px] text-stone-500 dark:text-stone-400 italic">
                                "{item.exampleIndo}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. GRAMMAR FAVORITES GRID */}
            {(savedFilterTab === "all" || savedFilterTab === "grammar") && favoriteGrammarList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[10px] text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    POLA KALIMAT FAVORIT ({favoriteGrammarList.length} POLA)
                  </span>
                  <button
                    onClick={() => onNavigateTab("grammar")}
                    className="font-pixel text-[9px] text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>MODUL POLA KALIMAT</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {favoriteGrammarList.map((item) => (
                    <div
                      key={item.id}
                      className="pixel-box-sm bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 p-3.5 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-pixel text-[8px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 border border-indigo-300">
                            {item.level || "N5"}
                          </span>
                          <span className="font-explanation text-[10px] text-stone-500">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePlaySavedGrammarAudio(item.pattern.replace(/～/g, ""))}
                            className="pixel-btn p-1 bg-white dark:bg-stone-800 cursor-pointer text-stone-600"
                            title="Dengarkan pengucapan pola"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => toggleGrammarFavorite(item.id)}
                            className="pixel-btn p-1 bg-amber-100 border-amber-400 cursor-pointer text-amber-600"
                            title="Hapus dari Favorit"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="font-pixel-jp text-base font-bold text-stone-900 dark:text-stone-100">
                          {item.pattern}
                        </div>
                        <div className="font-pixel text-[9px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.romaji}
                        </div>
                        {/* Explanation in clear readable font */}
                        <div className="font-explanation text-xs font-semibold text-stone-800 dark:text-stone-200 pt-1">
                          {item.meaning}
                        </div>
                      </div>

                      {item.explanation && (
                        <div className="font-explanation text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed bg-white dark:bg-stone-800 p-2 border border-stone-200 dark:border-stone-700">
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODULES NAVIGATION HUB: 9 RETRO PIXEL QUEST MODULES
      ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="font-pixel text-sm sm:text-base text-stone-900 dark:text-[#faf8f0]">
              PILIH MODUL PETUALANGAN BELAJAR (QUEST MODULES)
            </h2>
            <p className="font-explanation text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              Klik salah satu modul di bawah untuk memulai pembelajaran bahasa Jepang secara terstruktur.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Kana Table */}
          <div
            onClick={() => onNavigateTab("kana")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 border border-rose-300">
                  あ / ア (KANA)
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  {HIRAGANA_DATA.length + KATAKANA_DATA.length} HURUF
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                TABEL HURUF KANA (仮名)
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Bagan aksara Hiragana & Katakana lengkap: Gojuon dasar, Dakuon, Handakuon, Yoon, serta audio pengucapan.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-rose-600">
              <span>BUKA TABEL KANA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Vocabulary N5 */}
          <div
            onClick={() => onNavigateTab("n5")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 border border-emerald-300">
                  単語 (VOCAB)
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  {VOCAB_N5.length} KATA
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                KOSAKATA LENGKAP JLPT N5
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Koleksi kosakata N5 terorganisir per kategori: Salam, Angka, Waktu, Makanan, Keluarga, dengan audio suara.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-emerald-600">
              <span>HAFALKAN KOSAKATA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Grammar Patterns */}
          <div
            onClick={() => onNavigateTab("grammar")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 border border-indigo-300">
                  文法 (BUNPOU)
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  {GRAMMAR_PATTERNS.length} POLA
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                POLA KALIMAT TATA BAHASA
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Rumus tata bahasa N5 esensial dengan rumus pembentukan, makna, dan contoh kalimat aplikatif.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-indigo-600">
              <span>PELAJARI POLA KALIMAT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Particles */}
          <div
            onClick={() => onNavigateTab("particles")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 border border-indigo-300">
                  は / が / を
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  {PARTICLES_DATA.length} PARTIKEL
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                PARTIKEL TATA BAHASA (助詞)
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Panduan komparasi partikel Jepang: wa vs ga, ni vs de, o vs e, beserta aturan gramatikalnya.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-indigo-600">
              <span>BUKA PARTIKEL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 5. Verbs */}
          <div
            onClick={() => onNavigateTab("verbs")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 border border-teal-300">
                  動詞 (VERBA)
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  {VERBS_DATA.length} KATA KERJA
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                KATA KERJA &amp; KONJUGASI
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Klasifikasi kata kerja golongan 1, 2, 3 beserta tabel perubahan bentuk Masu, Te, Nai, dan Ta.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-teal-700">
              <span>TABEL KONJUGASI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 6. Flashcard 3D */}
          <div
            onClick={() => onNavigateTab("flashcards")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 border border-amber-300">
                  3D FLIP + VOICE
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  HAFALAN
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                FLASHCARD 3D &amp; SUARA
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Kartu hafalan bolak-balik dengan audio penutur asli dan uji ketepatan pelafalan mikrofon langsung.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-amber-600">
              <span>LATIHAN FLASHCARD</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 7. Quiz Module */}
          <div
            onClick={() => onNavigateTab("quiz")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 border border-rose-300">
                  🎯 KUIS
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  SOAL ACAK
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                KUIS INTERAKTIF JLPT N5
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Uji daya ingat huruf Kana, kosakata, partikel, dan makna kata dengan sistem scoring otomatis.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-rose-600">
              <span>MULAI KUIS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 8. AI Sensei */}
          <div
            onClick={() => onNavigateTab("chat")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 border border-purple-300">
                  GEMINI AI
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  TUTOR 24/7
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                NIHONGO SENSEI (AI TUTOR)
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Tanyakan pertanyaan bahasa Jepang apa saja, minta contoh kalimat, analisis kanji, atau simulasi percakapan.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-purple-600">
              <span>TANYA SENSEI AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 9. Progress Dashboard */}
          <div
            onClick={() => onNavigateTab("progress")}
            className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 border border-emerald-300">
                  RECHARTS
                </span>
                <span className="font-pixel text-[9px] text-stone-500">
                  {totalPercentage}%
                </span>
              </div>
              <h3 className="font-pixel text-xs text-stone-900 dark:text-stone-100">
                DASBOR PROGRES &amp; ANALITIK
              </h3>
              {/* Explanation in clear readable font */}
              <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Pantau grafik batang 7 hari konsistensi Recharts, target harian, status streak, serta daftar materi yang dikuasai.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-pixel text-[9px] text-emerald-600">
              <span>BUKA GRAFIK &amp; ANALITIK</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
