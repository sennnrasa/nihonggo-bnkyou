import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Check,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Layers,
  ArrowRight,
  Flame,
  VolumeX,
  Keyboard,
  Mic,
  Star
} from "lucide-react";
import { VOCAB_N5, VOCAB_N4, VOCAB_N3, VOCAB_N2, VOCAB_N1 } from "../data/vocabData";
import { playJapaneseSpeech } from "../utils/audio";
import { useProgress } from "../context/ProgressContext";
import { PronunciationTrainer } from "./PronunciationTrainer";
export const FlashcardMode = ({
  initialDeck = "n5",
  onNavigateTab
}) => {
  const [selectedDeck, setSelectedDeck] = useState(initialDeck);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showRomajiFront, setShowRomajiFront] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [autoAdvanceSpeed] = useState(4);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reviewedIds, setReviewedIds] = useState(/* @__PURE__ */ new Set());
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showPronunciationTrainer, setShowPronunciationTrainer] = useState(false);
  const { isMastered, toggleMastered, recordDailyActivity, currentStreak, isVocabFavorite, toggleVocabFavorite, favoriteVocabList, favoriteVocabCount } = useProgress();
  const autoAdvanceTimerRef = useRef(null);
  const rawDataset = useMemo(() => {
    switch (selectedDeck) {
      case "favorites":
        return favoriteVocabList.length > 0 ? favoriteVocabList : VOCAB_N5;
      case "n5":
      case "hiragana-n5":
        return VOCAB_N5;
      case "n4":
        return VOCAB_N4;
      case "n3":
        return VOCAB_N3;
      case "n2":
        return VOCAB_N2;
      case "n1":
        return VOCAB_N1;
      case "katakana":
        return VOCAB_N5.filter((v) => v.isLoanword);
      default:
        return VOCAB_N5;
    }
  }, [selectedDeck, favoriteVocabList]);
  const progressCategory = useMemo(() => {
    return "hiraganaVocab";
  }, []);
  const categories = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    rawDataset.forEach((item) => set.add(item.category));
    return ["Semua", ...Array.from(set)];
  }, [rawDataset]);
  const filteredDataset = useMemo(() => {
    let items = rawDataset.filter((item) => {
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) {
        return false;
      }
      const mastered = isMastered(progressCategory, item.id);
      if (masteryFilter === "mastered" && !mastered) return false;
      if (masteryFilter === "unmastered" && mastered) return false;
      return true;
    });
    if (isShuffled) {
      items = [...items].sort(() => Math.random() - 0.5);
    }
    return items;
  }, [rawDataset, selectedCategory, masteryFilter, progressCategory, isMastered, isShuffled]);
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckCompleted(false);
  }, [selectedDeck, selectedCategory, masteryFilter, isShuffled]);
  const currentCard = filteredDataset[currentIndex];
  const isCurrentMastered = currentCard ? isMastered(progressCategory, currentCard.id) : false;
  useEffect(() => {
    if (currentCard) {
      setReviewedIds((prev) => {
        const next = new Set(prev);
        next.add(currentCard.id);
        return next;
      });
    }
  }, [currentCard]);
  const handlePlayAudio = useCallback(async (text, e) => {
    if (e) e.stopPropagation();
    setIsPlayingAudio(true);
    const cleanWord = text.includes("(") ? text.split("(")[0].trim() : text;
    await playJapaneseSpeech(cleanWord, 0.85);
    setIsPlayingAudio(false);
  }, []);
  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      recordDailyActivity();
      if (next && autoPlayAudio && currentCard) {
        handlePlayAudio(currentCard.japanese);
      }
      return next;
    });
  }, [autoPlayAudio, currentCard, handlePlayAudio, recordDailyActivity]);
  const handleNextCard = useCallback(() => {
    if (currentIndex < filteredDataset.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsDeckCompleted(true);
      setIsAutoAdvancing(false);
    }
  }, [currentIndex, filteredDataset.length]);
  const handlePrevCard = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
      setIsDeckCompleted(false);
    }
  }, [currentIndex]);
  const handleToggleCurrentMastered = useCallback(() => {
    if (!currentCard) return;
    toggleMastered(progressCategory, currentCard.id);
    recordDailyActivity();
  }, [currentCard, progressCategory, toggleMastered, recordDailyActivity]);
  const handleMarkMasteredAndAdvance = useCallback(() => {
    if (!currentCard) return;
    if (!isCurrentMastered) {
      toggleMastered(progressCategory, currentCard.id);
      recordDailyActivity();
    }
    handleNextCard();
  }, [currentCard, isCurrentMastered, progressCategory, toggleMastered, recordDailyActivity, handleNextCard]);
  const handleMarkNeedPracticeAndAdvance = useCallback(() => {
    if (!currentCard) return;
    if (isCurrentMastered) {
      toggleMastered(progressCategory, currentCard.id);
    }
    handleNextCard();
  }, [currentCard, isCurrentMastered, progressCategory, toggleMastered, handleNextCard]);
  const handleRestartDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckCompleted(false);
  };
  const handleToggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };
  useEffect(() => {
    if (isAutoAdvancing && !isDeckCompleted && filteredDataset.length > 0) {
      autoAdvanceTimerRef.current = setInterval(() => {
        setIsFlipped((flipped) => {
          if (!flipped) {
            return true;
          } else {
            handleNextCard();
            return false;
          }
        });
      }, autoAdvanceSpeed * 1e3);
    } else {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    }
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, [isAutoAdvancing, isDeckCompleted, filteredDataset.length, autoAdvanceSpeed, handleNextCard]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        handleFlipCard();
      } else if (e.code === "ArrowRight" || e.key === "l" || e.key === "L") {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === "ArrowLeft" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        handleToggleCurrentMastered();
      } else if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (currentCard) {
          handlePlayAudio(currentCard.japanese);
        }
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleToggleShuffle();
      } else if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        setShowPronunciationTrainer((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlipCard, handleNextCard, handlePrevCard, handleToggleCurrentMastered, currentCard, handlePlayAudio]);
  const totalDeckMasteredCount = useMemo(() => {
    return filteredDataset.filter((item) => isMastered(progressCategory, item.id)).length;
  }, [filteredDataset, isMastered, progressCategory]);
  const deckProgressPercent = filteredDataset.length > 0 ? Math.round((currentIndex + 1) / filteredDataset.length * 100) : 0;
  return <div className="space-y-6 max-w-5xl mx-auto">
      {
    /* Top Banner / Hero */
  }
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Metode Hafalan Spaced Repetition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mode Flashcard Interaktif
            </h1>
            <p className="text-stone-300 text-sm max-w-xl leading-relaxed">
              Latih daya ingat kosakata bahasa Jepang dengan kartu bolak-balik interaktif.
              Uji pemahaman Anda dari aksara Jepang ke arti bahasa Indonesia.
            </p>
          </div>

          {
    /* Quick Metrics & Streak Badge */
  }
          <div className="flex items-center gap-3 shrink-0">
            {currentStreak > 0 && <div className="bg-amber-500/20 border border-amber-400/30 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-amber-200 text-xs">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Streak {currentStreak} Hari</span>
              </div>}
            <button
    onClick={() => setShowKeyboardHelp((prev) => !prev)}
    className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs text-stone-200 transition-colors"
    title="Shortcut Keyboard"
  >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pintasan</span>
            </button>
          </div>
        </div>

        {
    /* Keyboard Legend Drawer */
  }
        {showKeyboardHelp && <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono text-white">Spasi</kbd>
              <span>Balik kartu</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono text-white">→</kbd>
              <span>Berikutnya</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono text-white">←</kbd>
              <span>Sebelumnya</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono text-white">A</kbd>
              <span>Audio Jepang</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono text-white">V</kbd>
              <span>Tes Suara (Mic)</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono text-white">M</kbd>
              <span>Tandai Dikuasai</span>
            </div>
          </div>}
      </div>

      {
    /* Control Panel: Deck Choice, Category Filter, and Study Modes */
  }
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
        {
    /* Row 1: Deck Selection (N5 Hiragana vs Katakana Loanwords) */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            <span>Pilih Set Kosakata:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
    { id: "favorites", label: "⭐ Favorit", count: favoriteVocabCount, color: "text-amber-500" },
    { id: "n5", label: "JLPT N5", count: VOCAB_N5.length, color: "text-rose-700" },
    { id: "n4", label: "JLPT N4", count: VOCAB_N4.length, color: "text-emerald-800" },
    { id: "n3", label: "JLPT N3", count: VOCAB_N3.length, color: "text-sky-800" },
    { id: "n2", label: "JLPT N2", count: VOCAB_N2.length, color: "text-amber-800" },
    { id: "n1", label: "JLPT N1", count: VOCAB_N1.length, color: "text-purple-800" }
  ].map((deck) => {
    const isSelected = selectedDeck === deck.id || deck.id === "n5" && selectedDeck === "hiragana-n5";
    return <button
      key={deck.id}
      onClick={() => {
        setSelectedDeck(deck.id);
        setSelectedCategory("Semua");
        setCurrentIndex(0);
        setIsFlipped(false);
      }}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected ? deck.id === 'favorites' ? 'bg-amber-500 text-white shadow-xs' : 'bg-rose-700 text-white shadow-xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
    >
                  <span>{deck.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"}`}>
                    {deck.count}
                  </span>
                </button>;
  })}
          </div>
        </div>

        {
    /* Row 2: Category Filter & Mastery Filter */
  }
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {
    /* Category Dropdown */
  }
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="select-flashcard-category" className="text-stone-700 dark:text-stone-300 font-medium">Kategori:</label>
              <select
    id="select-flashcard-category"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
  >
                {categories.map((cat) => <option key={cat} value={cat} className="bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100">
                    {cat}
                  </option>)}
              </select>
            </div>

            {
    /* Mastery Filter Segmented Control */
  }
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              <button
    onClick={() => setMasteryFilter("all")}
    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${masteryFilter === "all" ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold" : "text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"}`}
  >
                Semua ({rawDataset.length})
              </button>
              <button
    onClick={() => setMasteryFilter("unmastered")}
    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${masteryFilter === "unmastered" ? "bg-white dark:bg-stone-700 text-rose-700 dark:text-rose-400 font-bold shadow-xs" : "text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"}`}
  >
                Belum Dikuasai
              </button>
              <button
    onClick={() => setMasteryFilter("mastered")}
    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${masteryFilter === "mastered" ? "bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs" : "text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"}`}
  >
                Sudah Dikuasai
              </button>
            </div>
          </div>

          {
    /* Row 3: Study Options & Toggles */
  }
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {
    /* Shuffle Button */
  }
            <button
    onClick={handleToggleShuffle}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${isShuffled ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"}`}
    title="Acak urutan kartu"
  >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffled ? "text-amber-600 dark:text-amber-400" : "text-stone-500 dark:text-stone-400"}`} />
              <span>{isShuffled ? "Acak Aktif" : "Acak Kartu"}</span>
            </button>

            {
    /* Romaji Hint Toggle */
  }
            <button
    onClick={() => setShowRomajiFront((prev) => !prev)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${showRomajiFront ? "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300" : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 font-semibold"}`}
    title="Sembunyikan Romaji di sisi depan kartu untuk latihan membaca aksara murni"
  >
              {showRomajiFront ? <Eye className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" /> : <EyeOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
              <span>{showRomajiFront ? "Romaji On" : "Romaji Off (Tantangan)"}</span>
            </button>

            {
    /* Auto Play Audio Toggle */
  }
            <button
    onClick={() => setAutoPlayAudio((prev) => !prev)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${autoPlayAudio ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"}`}
    title="Putar suara pelafalan otomatis saat membuka kartu"
  >
              {autoPlayAudio ? <Volume2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />}
              <span className="hidden sm:inline">Suara Otomatis</span>
            </button>

            {
    /* Auto Advance Slideshow */
  }
            <button
    onClick={() => setIsAutoAdvancing((prev) => !prev)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${isAutoAdvancing ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"}`}
    title="Putar otomatis kartu seperti presentasi"
  >
              {isAutoAdvancing ? <Pause className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />}
              <span>{isAutoAdvancing ? "Jeda Otomatis" : "Auto Play"}</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Main Flashcard Arena */
  }
      {filteredDataset.length === 0 ? <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-700">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">
            Tidak ada kartu yang cocok
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            {masteryFilter === "unmastered" ? "Selamat! Semua kosakata pada kategori ini telah Anda kuasai." : "Tidak ada data kosakata yang sesuai dengan kombinasi filter yang dipilih."}
          </p>
          <button
    onClick={() => {
      setMasteryFilter("all");
      setSelectedCategory("Semua");
    }}
    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
  >
            Reset Filter
          </button>
        </div> : isDeckCompleted ? (
    /* End of Deck Celebratory Screen */
    <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Deck Selesai Dilatih!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Kerja Bagus! Anda Menyelesaikan Semua Kartu
            </h2>
            <p className="text-sm text-stone-500 max-w-lg mx-auto">
              Anda telah me-review <strong>{filteredDataset.length} kata</strong> dalam sesi latihan flashcard ini.
              Konsistensi adalah kunci menguasai bahasa Jepang!
            </p>
          </div>

          {
      /* Stats Bar */
    }
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto text-left">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="text-[11px] text-stone-700 uppercase font-semibold">Total Kartu</div>
              <div className="text-xl font-bold text-stone-900">{filteredDataset.length}</div>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <div className="text-[11px] text-emerald-800 uppercase font-semibold">Sudah Dikuasai</div>
              <div className="text-xl font-bold text-emerald-700">
                {totalDeckMasteredCount} ({Math.round(totalDeckMasteredCount / filteredDataset.length * 100)}%)
              </div>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-amber-800 uppercase font-semibold">Perlu Latihan</div>
              <div className="text-xl font-bold text-amber-700">
                {filteredDataset.length - totalDeckMasteredCount}
              </div>
            </div>
          </div>

          {
      /* Next Actions */
    }
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
      onClick={handleRestartDeck}
      className="flex items-center gap-2 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
    >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Deck dari Awal</span>
            </button>

            {filteredDataset.length - totalDeckMasteredCount > 0 && <button
      onClick={() => {
        setMasteryFilter("unmastered");
        handleRestartDeck();
      }}
      className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
    >
                <Layers className="w-4 h-4" />
                <span>Latih Hanya yang Belum Dikuasai</span>
              </button>}

            <button
      onClick={() => {
        setSelectedDeck((prev) => prev === "hiragana-n5" ? "katakana" : "hiragana-n5");
        setSelectedCategory("Semua");
      }}
      className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
    >
              <span>Ganti ke Set {selectedDeck === "hiragana-n5" ? "Katakana" : "Hiragana N5"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
  ) : (
    /* The Active Flashcard */
    <div className="space-y-4">
          {
      /* Deck Progress Bar & Header Counters */
    }
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-800">
                Kartu {currentIndex + 1} dari {filteredDataset.length}
              </span>
              <span className="text-stone-300">·</span>
              <span>{currentCard?.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{totalDeckMasteredCount} Dikuasai</span>
              </span>
              <span className="text-stone-700 font-semibold">{deckProgressPercent}% Selesai</span>
            </div>
          </div>

          {
      /* Progress Indicator Line */
    }
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
      className="h-full bg-rose-600 rounded-full transition-all duration-300"
      style={{ width: `${deckProgressPercent}%` }}
    />
          </div>

          {
      /* 3D Interactive Card Flip Container */
    }
          <div className="perspective-1000 w-full flex justify-center py-2">
            <div
      onClick={handleFlipCard}
      className={`relative w-full max-w-xl h-80 sm:h-96 rounded-3xl cursor-pointer select-none transition-transform duration-500 transform-style-preserve-3d shadow-md hover:shadow-xl border border-stone-200/90 dark:border-stone-800 ${isFlipped ? "rotate-y-180" : ""}`}
    >
              {
      /* FRONT OF CARD (Japanese Word) */
    }
              <div
      className={`absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-8 flex flex-col justify-between backface-hidden transition-all ${isCurrentMastered ? "ring-2 ring-emerald-400/80 bg-emerald-50/15 dark:bg-emerald-950/20" : ""}`}
    >
                {
      /* Front Card Header */
    }
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      {currentCard?.category}
                    </span>
                    {isCurrentMastered && <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Dikuasai</span>
                      </span>}
                    {currentCard && isVocabFavorite(currentCard.id) && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>Favorit</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCard) toggleVocabFavorite(currentCard.id);
                      }}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        currentCard && isVocabFavorite(currentCard.id)
                          ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-500 shadow-2xs"
                          : "bg-stone-50 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-amber-500"
                      }`}
                      title={currentCard && isVocabFavorite(currentCard.id) ? "Hapus dari Favorit" : "Bintang / Simpan ke Favorit"}
                    >
                      <Star className={`w-4 h-4 ${currentCard && isVocabFavorite(currentCard.id) ? "fill-amber-400 text-amber-500" : ""}`} />
                    </button>
                    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShowPronunciationTrainer((prev) => !prev);
      }}
      className={`p-2 rounded-xl border transition-colors cursor-pointer ${showPronunciationTrainer ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400"}`}
      title="Tes pelafalan suara Anda dengan mikrofon (Shortcut: V)"
    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
      onClick={(e) => {
        e.stopPropagation();
        if (currentCard) handlePlayAudio(currentCard.japanese, e);
      }}
      className={`p-2 rounded-xl border transition-colors cursor-pointer ${isPlayingAudio ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300" : "bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"}`}
      title="Dengarkan pelafalan bahasa Jepang"
    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
      onClick={(e) => {
        e.stopPropagation();
        handleToggleCurrentMastered();
      }}
      className={`p-2 rounded-xl border transition-colors cursor-pointer ${isCurrentMastered ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400"}`}
      title={isCurrentMastered ? "Batalkan tanda dikuasai" : "Tandai sudah dikuasai"}
    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {
      /* Front Card Body (Japanese Main Script & Pronunciation Audio Button) */
    }
                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto space-y-3">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 dark:text-stone-100 tracking-wide font-['Noto_Sans_JP'] drop-shadow-xs">
                      {currentCard?.japanese}
                    </div>
                    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (currentCard) handlePlayAudio(currentCard.japanese, e);
      }}
      className={`p-3 rounded-2xl border transition-all cursor-pointer ${isPlayingAudio ? "bg-rose-600 text-white scale-110 shadow-md ring-4 ring-rose-200 dark:ring-rose-900/60 animate-pulse" : "bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border-rose-200 dark:border-rose-900/80 text-rose-700 dark:text-rose-300 hover:scale-105 active:scale-95"}`}
      title="Klik untuk mendengarkan pengucapan kata Jepang (Web Speech API)"
    >
                      <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  {
      /* Romaji Hint (Toggleable) */
    }
                  <div className="flex flex-col items-center gap-2">
                    {showRomajiFront ? <div className="text-sm sm:text-base font-semibold text-rose-700 dark:text-rose-400 tracking-wider">
                        {currentCard?.romaji}
                      </div> : <button
      onClick={(e) => {
        e.stopPropagation();
        setShowRomajiFront(true);
      }}
      className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
    >
                        👁️ Intip Romaji
                      </button>}

                    {
      /* Quick Voice Pronunciation Test Button */
    }
                    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShowPronunciationTrainer((prev) => !prev);
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${showPronunciationTrainer ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400 border-stone-200 dark:border-stone-700"}`}
    >
                      <Mic className="w-3.5 h-3.5 text-rose-500" />
                      <span>{showPronunciationTrainer ? "Tutup Tes Suara" : "Tes Pelafalan Suara"}</span>
                    </button>
                  </div>
                </div>

                {
      /* Front Card Footer Prompt */
    }
                <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Ketuk kartu atau tekan <strong>Spasi</strong> untuk melihat arti</span>
                </div>
              </div>

              {
      /* BACK OF CARD (Meaning, Example & Translation) */
    }
              <div
      className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 transition-all border border-stone-700 shadow-xl"
    >
                {
      /* Back Card Header */
    }
                <div className="flex items-center justify-between border-b border-stone-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-semibold text-stone-300 tracking-wider">
                      Arti & Terjemahan
                    </span>
                    {currentCard?.origin && <span className="text-xs text-rose-300 font-mono">
                        (kata asal: {currentCard.origin})
                      </span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCard) toggleVocabFavorite(currentCard.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        currentCard && isVocabFavorite(currentCard.id)
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-white/10 hover:bg-white/20 text-stone-200"
                      }`}
                      title={currentCard && isVocabFavorite(currentCard.id) ? "Hapus dari Favorit" : "Bintang / Simpan ke Favorit"}
                    >
                      <Star className={`w-3.5 h-3.5 ${currentCard && isVocabFavorite(currentCard.id) ? "fill-white" : ""}`} />
                    </button>
                    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShowPronunciationTrainer((prev) => !prev);
      }}
      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showPronunciationTrainer ? "bg-rose-600 text-white shadow-xs" : "bg-white/10 hover:bg-white/20 text-stone-200"}`}
      title="Tes pelafalan suara Anda dengan mikrofon (Shortcut: V)"
    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (currentCard) handlePlayAudio(currentCard.japanese, e);
      }}
      className={`p-1.5 rounded-lg text-stone-200 transition-colors ${isPlayingAudio ? "bg-rose-600 text-white animate-pulse" : "bg-white/10 hover:bg-white/20"}`}
      title="Dengarkan pelafalan kata"
    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
      onClick={(e) => {
        e.stopPropagation();
        handleToggleCurrentMastered();
      }}
      className={`p-1.5 rounded-lg transition-colors ${isCurrentMastered ? "bg-emerald-500 text-white" : "bg-white/10 hover:bg-white/20 text-stone-200"}`}
      title={isCurrentMastered ? "Batalkan tanda dikuasai" : "Tandai sudah dikuasai"}
    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {
      /* Back Card Body: Meaning & Details */
    }
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-auto py-2">
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {currentCard?.indonesian}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-rose-300">
                      {currentCard?.japanese} · {currentCard?.romaji}
                    </div>
                  </div>

                  {
      /* Example Sentence if available */
    }
                  {currentCard?.example && <div className="bg-white/10 border border-white/15 rounded-2xl p-3 sm:p-4 text-left w-full max-w-md mx-auto text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-stone-300 font-semibold text-[11px]">
                        <span>Contoh Kalimat:</span>
                        <button
      onClick={(e) => {
        e.stopPropagation();
        if (currentCard.example) handlePlayAudio(currentCard.example, e);
      }}
      className="hover:text-white flex items-center gap-1 transition-colors"
    >
                          <Volume2 className="w-3 h-3" />
                          <span>Dengar</span>
                        </button>
                      </div>
                      <div className="font-bold text-stone-100 text-xs sm:text-sm font-['Noto_Sans_JP']">
                        {currentCard.example}
                      </div>
                      {currentCard.exampleRomaji && <div className="text-stone-300 text-[11px] italic">
                          {currentCard.exampleRomaji}
                        </div>}
                      {currentCard.exampleIndo && <div className="text-rose-200 text-xs pt-0.5 font-medium">
                          {currentCard.exampleIndo}
                        </div>}
                    </div>}
                </div>

                {
      /* Back Card Footer Prompt */
    }
                <div className="flex items-center justify-center gap-1.5 text-xs text-stone-300 pt-3 border-t border-stone-700/80">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ketuk kartu untuk kembali ke aksara Jepang</span>
                </div>
              </div>
            </div>
          </div>

          {
      /* Card Control & Action Buttons */
    }
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {
      /* Previous Button */
    }
            <button
      onClick={handlePrevCard}
      disabled={currentIndex === 0}
      className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${currentIndex === 0 ? "border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600 bg-stone-50 dark:bg-stone-800/40 cursor-not-allowed" : "border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 shadow-xs"}`}
    >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya (←)</span>
            </button>

            {
      /* Central Actions: Leitner / Anki style quick grading */
    }
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center flex-wrap">
              <button
      onClick={handleMarkNeedPracticeAndAdvance}
      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
      title="Tandai belum hafal dan lanjut ke kartu berikutnya"
    >
                <span>Perlu Latihan Lagi</span>
              </button>

              <button
      onClick={handleFlipCard}
      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
    >
                <RotateCw className="w-4 h-4" />
                <span>{isFlipped ? "Lihat Depan" : "Balik Kartu (Spasi)"}</span>
              </button>

              <button
      type="button"
      onClick={() => {
        if (currentCard) handlePlayAudio(currentCard.japanese);
      }}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${isPlayingAudio ? "bg-rose-700 text-white border-rose-700 animate-pulse" : "bg-white dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400"}`}
      title="Dengarkan pelafalan bahasa Jepang (Shortcut: A)"
    >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? "Memutar..." : "Suara (A)"}</span>
              </button>

              <button
      type="button"
      onClick={() => setShowPronunciationTrainer((prev) => !prev)}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${showPronunciationTrainer ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-200 dark:ring-rose-900/60" : "bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300"}`}
      title="Rekam dan uji ketepatan pelafalan suara Anda (Shortcut: V)"
    >
                <Mic className="w-4 h-4" />
                <span>{showPronunciationTrainer ? "Tutup Tes" : "Tes Suara (V)"}</span>
              </button>

              <button
      onClick={handleMarkMasteredAndAdvance}
      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
      title="Tandai sudah hafal dan lanjut ke kartu berikutnya"
    >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Hafal & Lanjut</span>
              </button>
            </div>

            {
      /* Next Button */
    }
            <button
      onClick={handleNextCard}
      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
    >
              <span>Selanjutnya (→)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {
      /* Pronunciation Trainer & Voice Evaluation Feedback Panel */
    }
          {showPronunciationTrainer && currentCard && <div className="pt-2 max-w-xl mx-auto w-full">
              <PronunciationTrainer
      targetJapanese={currentCard.japanese}
      targetRomaji={currentCard.romaji}
      targetMeaning={currentCard.indonesian}
      onSuccessMastered={handleMarkMasteredAndAdvance}
      onClose={() => setShowPronunciationTrainer(false)}
    />
            </div>}

          {
      /* Quick Slider to jump to any card */
    }
          <div className="pt-4 flex items-center gap-3 max-w-md mx-auto text-xs text-stone-500">
            <span className="font-mono text-[11px] shrink-0">1</span>
            <input
      type="range"
      min={0}
      max={filteredDataset.length - 1}
      value={currentIndex}
      onChange={(e) => {
        setIsFlipped(false);
        setCurrentIndex(Number(e.target.value));
      }}
      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
    />
            <span className="font-mono text-[11px] shrink-0">{filteredDataset.length}</span>
          </div>
        </div>
  )}
    </div>;
};
