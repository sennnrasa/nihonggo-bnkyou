import { useState } from "react";
import { HIRAGANA_DATA, KATAKANA_DATA } from "../data/kanaData";
import { playJapaneseSpeech } from "../utils/audio";
import { useProgress } from "../context/ProgressContext";
import { Volume2, Search, Sparkles, Info, Eye, EyeOff, Check, ArrowRight, CheckCircle2, Filter } from "lucide-react";
export const KanaTable = ({ onStartQuizWithScript }) => {
  const [activeScript, setActiveScript] = useState("hiragana");
  const [selectedType, setSelectedType] = useState("all");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKana, setSelectedKana] = useState(HIRAGANA_DATA[0]);
  const [showAllRomaji, setShowAllRomaji] = useState(true);
  const [revealedChars, setRevealedChars] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isMastered, toggleMastered, hiraganaCharsCount, katakanaCharsCount } = useProgress();
  const currentDataset = activeScript === "hiragana" ? HIRAGANA_DATA : KATAKANA_DATA;
  const currentCategory = activeScript === "hiragana" ? "hiraganaChar" : "katakanaChar";
  const masteredCount = activeScript === "hiragana" ? hiraganaCharsCount : katakanaCharsCount;
  const masteredPercent = Math.round(masteredCount / currentDataset.length * 100);
  const filteredKana = currentDataset.filter((item) => {
    const isCharMastered = isMastered(currentCategory, item.char);
    if (masteryFilter === "mastered" && !isCharMastered) return false;
    if (masteryFilter === "unmastered" && isCharMastered) return false;
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesSearch = item.char.includes(searchQuery.trim()) || item.romaji.toLowerCase().includes(searchQuery.trim().toLowerCase()) || item.exampleMeaning && item.exampleMeaning.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesType && matchesSearch;
  });
  const handleCardClick = (item) => {
    setSelectedKana(item);
    setRevealedChars((prev) => ({ ...prev, [item.char]: true }));
    handlePlayAudio(item.char);
  };
  const handlePlayAudio = async (text) => {
    setIsSpeaking(true);
    await playJapaneseSpeech(text, 0.85);
    setIsSpeaking(false);
  };
  const isCurrentKanaMastered = selectedKana ? isMastered(currentCategory, selectedKana.char) : false;
  return <div className="space-y-6">
      {
    /* Top Banner & Script Switcher */
  }
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-black select-none pointer-events-none pr-4">
          {activeScript === "hiragana" ? "\u3042" : "\u30A2"}
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Tabel Interaktif Audio & Romaji
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Tabel Lengkap {activeScript === "hiragana" ? "Hiragana (\u3072\u3089\u304C\u306A)" : "Katakana (\u30AB\u30BF\u30AB\u30CA)"}
          </h1>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            Klik karakter apa saja untuk melihat Romaji, contoh kata, arti dalam Bahasa Indonesia, dan dengarkan pengucapan audio aslinya langsung.
          </p>

          {
    /* Script Switcher Buttons & Progress Info */
  }
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex p-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <button
    id="btn-select-hiragana"
    onClick={() => {
      setActiveScript("hiragana");
      setSelectedKana(HIRAGANA_DATA[0]);
    }}
    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeScript === "hiragana" ? "bg-rose-700 text-white shadow-md" : "text-stone-200 hover:text-white hover:bg-white/10"}`}
  >
                Hiragana (ひらがな)
              </button>
              <button
    id="btn-select-katakana"
    onClick={() => {
      setActiveScript("katakana");
      setSelectedKana(KATAKANA_DATA[0]);
    }}
    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeScript === "katakana" ? "bg-rose-700 text-white shadow-md" : "text-stone-200 hover:text-white hover:bg-white/10"}`}
  >
                Katakana (カタカナ)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Progres: <strong className="text-white font-bold">{masteredCount}</strong>/{currentDataset.length} ({masteredPercent}%)
                </span>
                <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden ml-1">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${masteredPercent}%` }} />
                </div>
              </div>

              <button
    id="btn-toggle-romaji-visibility"
    onClick={() => setShowAllRomaji(!showAllRomaji)}
    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
  >
                {showAllRomaji ? <EyeOff className="w-4 h-4 text-rose-300" /> : <Eye className="w-4 h-4 text-emerald-300" />}
                {showAllRomaji ? "Mode Latihan (Sembunyikan Romaji)" : "Tampilkan Semua Romaji"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {
    /* Main Grid & Detail Panel Layout */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left Column: Filter Controls & Kana Grid (8 cols on lg) */
  }
        <div className="lg:col-span-8 space-y-4">
          {
    /* Controls Bar: Type Filters + Mastery Filter + Search */
  }
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {
    /* Filter Tabs */
  }
              <div className="flex flex-wrap items-center gap-1.5">
                <button
    id="filter-type-all"
    onClick={() => setSelectedType("all")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedType === "all" ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                  Semua ({currentDataset.length})
                </button>
                <button
    id="filter-type-gojuon"
    onClick={() => setSelectedType("gojuon")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedType === "gojuon" ? "bg-rose-700 text-white font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                  Gojuon / Dasar (46)
                </button>
                <button
    id="filter-type-dakuon"
    onClick={() => setSelectedType("dakuon")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedType === "dakuon" ? "bg-rose-700 text-white font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                  Dakuon ゛(20)
                </button>
                <button
    id="filter-type-handakuon"
    onClick={() => setSelectedType("handakuon")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedType === "handakuon" ? "bg-rose-700 text-white font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                  Handakuon ゜(5)
                </button>
                <button
    id="filter-type-yoon"
    onClick={() => setSelectedType("yoon")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedType === "yoon" ? "bg-rose-700 text-white font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                  Yoon / Gabungan (36)
                </button>
              </div>

              {
    /* Search Box */
  }
              <div className="relative min-w-[160px] sm:w-48">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
                <input
    id="input-search-kana"
    type="text"
    placeholder="Cari huruf/romaji..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-rose-500 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-800 dark:text-stone-200 placeholder:text-stone-500 dark:placeholder:text-stone-400"
  />
              </div>
            </div>

            {
    /* Mastery Quick Filter */
  }
            <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
              <span className="text-stone-600 dark:text-stone-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status Penguasaan:
              </span>
              <button
    onClick={() => setMasteryFilter("all")}
    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${masteryFilter === "all" ? "bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                Semua
              </button>
              <button
    onClick={() => setMasteryFilter("unmastered")}
    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${masteryFilter === "unmastered" ? "bg-amber-600 text-white font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                Belum Dikuasai ({currentDataset.length - masteredCount})
              </button>
              <button
    onClick={() => setMasteryFilter("mastered")}
    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${masteryFilter === "mastered" ? "bg-emerald-600 text-white font-bold" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
                <Check className="w-3 h-3" />
                Sudah Dikuasai ({masteredCount})
              </button>
            </div>
          </div>

          {
    /* Interactive Kana Grid */
  }
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
            {filteredKana.length === 0 ? <div className="text-center py-12 text-stone-600 dark:text-stone-400">
                <Info className="w-8 h-8 mx-auto text-stone-500 mb-2" />
                <p className="text-sm font-medium">Tidak ada karakter yang cocok dengan kata kunci "{searchQuery}".</p>
              </div> : <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 xl:grid-cols-9 gap-2.5">
                {filteredKana.map((item) => {
    const isSelected = selectedKana?.char === item.char;
    const isRevealed = showAllRomaji || revealedChars[item.char];
    const isCardMastered = isMastered(currentCategory, item.char);
    return <button
      id={`kana-card-${item.char}`}
      key={item.char}
      onClick={() => handleCardClick(item)}
      className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${isSelected ? "border-rose-600 bg-rose-50/70 dark:bg-rose-950/60 shadow-xs ring-2 ring-rose-400" : isCardMastered ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/30 hover:bg-white dark:hover:bg-stone-800" : "border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800 hover:shadow-xs"}`}
    >
                      {
      /* Mastered Badge */
    }
                      {isCardMastered && <span
      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs"
      title="Karakter ini sudah dikuasai"
    >
                          ✓
                        </span>}

                      <span className="font-['Noto_Sans_JP',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
                        {item.char}
                      </span>
                      <span
      className={`text-[11px] font-semibold tracking-wider mt-1 transition-all ${isRevealed ? isSelected ? "text-rose-700 dark:text-rose-400 font-bold" : isCardMastered ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-stone-700 dark:text-stone-300" : "text-stone-500 dark:text-stone-400 blur-[3px] select-none group-hover:blur-none"}`}
    >
                        {item.romaji}
                      </span>

                      {
      /* Small speaker icon on hover */
    }
                      <Volume2 className="w-3 h-3 absolute top-1.5 right-1.5 text-stone-500 dark:text-stone-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
                    </button>;
  })}
              </div>}
          </div>
        </div>

        {
    /* Right Column: Selected Kana Active Inspector (4 cols on lg) */
  }
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6 transition-colors">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Detail Karakter Terpilih
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                {activeScript === "hiragana" ? "Hiragana" : "Katakana"}
              </span>
            </div>

            {selectedKana ? <div className="space-y-6 text-center">
                {
    /* Big Kana Display */
  }
                <div className="relative py-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700/60">
                  <div className="text-7xl sm:text-8xl font-black font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100 select-none">
                    {selectedKana.char}
                  </div>
                  <div className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-400 tracking-wide uppercase">
                    {selectedKana.romaji}
                  </div>
                  <div className="text-xs text-stone-700 dark:text-stone-300 mt-1 capitalize font-medium">
                    Tipe: {selectedKana.type}
                  </div>
                </div>

                {
    /* Action Buttons: Audio & Mastery */
  }
                <div className="space-y-2">
                  <button
    id="btn-play-selected-audio"
    onClick={() => handlePlayAudio(selectedKana.char)}
    disabled={isSpeaking}
    className="w-full py-3 px-4 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-rose-700 dark:hover:bg-rose-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
  >
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-bounce text-rose-300" : ""}`} />
                    {isSpeaking ? "Memutar Pengucapan..." : "Dengarkan Pengucapan Asli"}
                  </button>

                  <button
    id="btn-toggle-kana-mastery"
    onClick={() => toggleMastered(currentCategory, selectedKana.char)}
    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${isCurrentKanaMastered ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs" : "bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"}`}
  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCurrentKanaMastered ? "\u2713 Sudah Dikuasai (Mastered)" : "Tandai Sudah Dikuasai"}
                  </button>
                </div>

                {
    /* Example Word & Context */
  }
                {selectedKana.exampleWord && <div className="text-left bg-rose-50/60 dark:bg-rose-950/30 rounded-xl p-4 border border-rose-100 dark:border-rose-900/40 space-y-2">
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Contoh Kosakata
                    </div>
                    <div className="text-lg font-bold text-stone-900 dark:text-stone-100 font-['Noto_Sans_JP']">
                      {selectedKana.exampleWord}
                    </div>
                    <div className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                      Arti: <span className="text-stone-900 dark:text-stone-100 font-bold">{selectedKana.exampleMeaning}</span>
                    </div>
                    <button
    onClick={() => handlePlayAudio(selectedKana.exampleWord?.split(" ")[0] || selectedKana.char)}
    className="text-xs text-rose-700 dark:text-rose-400 font-bold hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
  >
                      <Volume2 className="w-3.5 h-3.5" />
                      Dengar contoh kata
                    </button>
                  </div>}

                {
    /* Quick Info Points */
  }
                <div className="text-left text-xs text-stone-700 dark:text-stone-300 space-y-1.5 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fonem vokal: Kolom {selectedKana.col.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Baris konsonan: {selectedKana.row.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Standar romaji Hepburn resmi</span>
                  </div>
                </div>

                {onStartQuizWithScript && <button
    onClick={() => onStartQuizWithScript(activeScript)}
    className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
  >
                    Uji Pemahaman Huruf di Kuis
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>}
              </div> : <div className="py-8 text-center text-stone-500 dark:text-stone-400 text-sm">
                Pilih salah satu karakter di tabel untuk melihat informasi lengkapnya.
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
