import { useState, useMemo } from "react";
import { HIRAGANA_N5_VOCAB } from "../data/hiraganaN5Data";
import { playJapaneseSpeech } from "../utils/audio";
import { useProgress } from "../context/ProgressContext";
import { Search, Volume2, Bookmark, BookmarkCheck, Eye, EyeOff, X, Sparkles, Filter, Copy, Check, CheckCircle2, Layers } from "lucide-react";
export const HiraganaVocabView = ({ onOpenFlashcards }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [showRomaji, setShowRomaji] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [viewLayout, setViewLayout] = useState("grid");
  const { isMastered, toggleMastered, hiraganaVocabCount } = useProgress();
  const masteredPercent = Math.round(hiraganaVocabCount / HIRAGANA_N5_VOCAB.length * 100);
  const categories = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    HIRAGANA_N5_VOCAB.forEach((item) => set.add(item.category));
    return ["Semua", ...Array.from(set)];
  }, []);
  const filteredVocab = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return HIRAGANA_N5_VOCAB.filter((item) => {
      const isWordMastered = isMastered("hiraganaVocab", item.id);
      if (masteryFilter === "mastered" && !isWordMastered) return false;
      if (masteryFilter === "unmastered" && isWordMastered) return false;
      const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      const matchesFavorite = !onlyFavorites || favorites[item.id];
      const matchesSearch = !q || item.japanese.toLowerCase().includes(q) || item.romaji.toLowerCase().includes(q) || item.indonesian.toLowerCase().includes(q);
      return matchesCategory && matchesFavorite && matchesSearch;
    });
  }, [searchQuery, selectedCategory, masteryFilter, onlyFavorites, favorites, isMastered]);
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handlePlayAudio = async (text, id, e) => {
    if (e) e.stopPropagation();
    setActiveAudioId(id);
    await playJapaneseSpeech(text, 0.85);
    setActiveAudioId(null);
  };
  const handleCopy = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.japanese} (${item.romaji}) - ${item.indonesian}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };
  return <div className="space-y-6">
      {
    /* Header Banner */
  }
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            JLPT N5 Core Vocabulary Library
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Library Kosakata Hiragana N5
          </h1>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            Daftar lengkap <span className="font-bold text-white">{HIRAGANA_N5_VOCAB.length} kosakata dasar N5</span> beserta Romaji, arti Bahasa Indonesia resmi, contoh kalimat, dan audio pelafalan asli.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Progres: <strong className="text-white font-bold">{hiraganaVocabCount}</strong>/{HIRAGANA_N5_VOCAB.length} ({masteredPercent}%) Dikuasai
              </span>
              <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden ml-1">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${masteredPercent}%` }} />
              </div>
            </div>

            {onOpenFlashcards && <button
    onClick={onOpenFlashcards}
    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
  >
                <Layers className="w-4 h-4" />
                <span>Latihan dengan Flashcard</span>
              </button>}
          </div>
        </div>
      </div>

      {
    /* Control Bar: Search + Category Filters + Mastery Filter */
  }
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {
    /* Search Bar */
  }
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
            <input
    id="input-search-hiragana-n5"
    type="text"
    placeholder="Cari dalam Hiragana, Romaji, atau Bahasa Indonesia (misal: salam, arigatou, terima kasih)..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-11 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-rose-600 focus:bg-white transition-all text-stone-900 placeholder:text-stone-600"
  />
            {searchQuery && <button
    onClick={() => setSearchQuery("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-600 hover:text-stone-800"
  >
                <X className="w-4 h-4" />
              </button>}
          </div>

          {
    /* Quick Action Toggles */
  }
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {
    /* Mastery Filter Buttons */
  }
            <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
              <button
    onClick={() => setMasteryFilter("all")}
    className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${masteryFilter === "all" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-700"}`}
  >
                Semua
              </button>
              <button
    onClick={() => setMasteryFilter("unmastered")}
    className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${masteryFilter === "unmastered" ? "bg-amber-600 text-white shadow-xs font-bold" : "text-stone-700"}`}
  >
                Belum
              </button>
              <button
    onClick={() => setMasteryFilter("mastered")}
    className={`px-2.5 py-1 font-semibold rounded-lg flex items-center gap-1 transition-all ${masteryFilter === "mastered" ? "bg-emerald-600 text-white shadow-xs font-bold" : "text-stone-700"}`}
  >
                <Check className="w-3 h-3" />
                Hafal ({hiraganaVocabCount})
              </button>
            </div>

            <button
    id="btn-toggle-vocab-romaji"
    onClick={() => setShowRomaji(!showRomaji)}
    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${showRomaji ? "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100" : "border-rose-300 bg-rose-50 text-rose-700"}`}
  >
              {showRomaji ? <EyeOff className="w-4 h-4 text-stone-700" /> : <Eye className="w-4 h-4 text-rose-700" />}
              {showRomaji ? "Romaji" : "Tutup Romaji"}
            </button>

            <button
    id="btn-filter-favorites"
    onClick={() => setOnlyFavorites(!onlyFavorites)}
    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${onlyFavorites ? "border-amber-400 bg-amber-50 text-amber-800 font-bold" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"}`}
  >
              {onlyFavorites ? <BookmarkCheck className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4 text-stone-600" />}
              ({Object.values(favorites).filter(Boolean).length})
            </button>

            {
    /* Layout Toggle */
  }
            <div className="hidden sm:flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
    onClick={() => setViewLayout("grid")}
    className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${viewLayout === "grid" ? "bg-white text-stone-900 shadow-xs" : "text-stone-700"}`}
  >
                Grid
              </button>
              <button
    onClick={() => setViewLayout("table")}
    className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${viewLayout === "table" ? "bg-white text-stone-900 shadow-xs" : "text-stone-700"}`}
  >
                Tabel
              </button>
            </div>
          </div>
        </div>

        {
    /* Category Filter Chips */
  }
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-stone-700 font-medium flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Kategori:
          </span>
          {categories.map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${selectedCategory === cat ? "bg-rose-700 text-white font-semibold shadow-xs" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
  >
              {cat}
            </button>)}
        </div>
      </div>

      {
    /* Counter Banner */
  }
      <div className="flex items-center justify-between text-xs text-stone-700 px-1 font-medium">
        <span>
          Menampilkan <strong className="text-stone-900">{filteredVocab.length}</strong> dari{" "}
          <strong className="text-stone-900">{HIRAGANA_N5_VOCAB.length}</strong> kosakata
        </span>
        {searchQuery && <span className="text-rose-700 font-semibold">
            Hasil untuk "{searchQuery}"
          </span>}
      </div>

      {
    /* Vocab Container */
  }
      {filteredVocab.length === 0 ? <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-700 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-600">
            <Search className="w-6 h-6" />
          </div>
          <p className="font-semibold text-stone-800">Tidak ada kosakata yang cocok</p>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Coba gunakan kata kunci lain atau hapus filter kategori untuk melihat seluruh daftar kosakata.
          </p>
          <button
    onClick={() => {
      setSearchQuery("");
      setSelectedCategory("Semua");
      setOnlyFavorites(false);
    }}
    className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-all cursor-pointer"
  >
            Reset Semua Filter
          </button>
        </div> : viewLayout === "grid" ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVocab.map((item) => {
    const isFav = favorites[item.id];
    const isSpeaking = activeAudioId === item.id;
    const isCopied = copiedId === item.id;
    const isWordMastered = isMastered("hiraganaVocab", item.id);
    return <div
      key={item.id}
      className={`bg-white rounded-2xl border p-4 transition-all flex flex-col justify-between group relative ${isWordMastered ? "border-emerald-300 bg-emerald-50/20 shadow-2xs" : "border-stone-200 hover:border-rose-300 hover:shadow-xs"}`}
    >
                <div>
                  {
      /* Category Pill & Action Buttons */
    }
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
      onClick={(e) => handleCopy(item, e)}
      title="Salin teks"
      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-colors"
    >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
      onClick={(e) => handleToggleFavorite(item.id, e)}
      title={isFav ? "Hapus bookmark" : "Simpan kata"}
      className="p-1.5 rounded-lg transition-colors"
    >
                        {isFav ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4 text-stone-600 hover:text-stone-800" />}
                      </button>
                    </div>
                  </div>

                  {
      /* Japanese Word */
    }
                  <div className="mt-1 flex items-start justify-between gap-2">
                    <div
      onClick={(e) => handlePlayAudio(item.japanese, item.id, e)}
      className="cursor-pointer group-hover:text-rose-700 transition-colors"
      title="Klik untuk mendengarkan pengucapan"
    >
                      <div className="text-xl sm:text-2xl font-bold font-['Noto_Sans_JP'] text-stone-900 leading-snug">
                        {item.japanese}
                      </div>
                      {
      /* Romaji */
    }
                      <div
      className={`text-xs font-semibold text-rose-700 tracking-wide mt-0.5 transition-all ${showRomaji ? "" : "blur-[4px] select-none hover:blur-none cursor-pointer"}`}
      title={showRomaji ? "" : "Arahkan kursor untuk melihat Romaji"}
    >
                        {item.romaji}
                      </div>
                    </div>
                    <button
      type="button"
      onClick={(e) => handlePlayAudio(item.japanese, item.id, e)}
      className={`p-1.5 rounded-lg border transition-all ${isSpeaking ? "bg-rose-700 text-white border-rose-700 animate-pulse" : "bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-600 hover:text-rose-700"}`}
      title="Dengarkan pengucapan (Web Speech API)"
    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-bounce" : ""}`} />
                    </button>
                  </div>

                  {
      /* Meaning Indonesia */
    }
                  <div className="mt-2.5 text-sm font-semibold text-stone-800">
                    {item.indonesian}
                  </div>

                  {
      /* Example sentence if present */
    }
                  {item.example && <div className="mt-3 pt-2.5 border-t border-stone-100 text-xs space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-['Noto_Sans_JP'] text-stone-800 font-medium">{item.example}</p>
                        <button
      type="button"
      onClick={(e) => handlePlayAudio(item.example, `ex-${item.id}`, e)}
      className={`p-1 rounded-md transition-colors shrink-0 ${activeAudioId === `ex-${item.id}` ? "text-rose-700 bg-rose-100 animate-pulse" : "text-stone-500 hover:text-rose-700 hover:bg-rose-50"}`}
      title="Dengarkan contoh kalimat"
    >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showRomaji && item.exampleRomaji && <p className="text-[11px] text-stone-600 italic">{item.exampleRomaji}</p>}
                      <p className="text-[11px] text-stone-700">{item.exampleIndo}</p>
                    </div>}
                </div>

                {
      /* Footer: Mastery Toggle & Audio Button */
    }
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
      onClick={() => toggleMastered("hiraganaVocab", item.id)}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isWordMastered ? "bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700" : "bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800"}`}
      title={isWordMastered ? "Klik untuk batal status kuasai" : "Tandai sebagai dikuasai"}
    >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isWordMastered ? "Dikuasai" : "Tandai Hafal"}
                  </button>

                  <button
      onClick={(e) => handlePlayAudio(item.japanese, item.id, e)}
      disabled={isSpeaking}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSpeaking ? "bg-rose-700 text-white animate-pulse" : "bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700"}`}
    >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-bounce" : ""}`} />
                    {isSpeaking ? "Memutar..." : "Dengarkan"}
                  </button>
                </div>
              </div>;
  })}
        </div> : (
    /* Detailed Table View */
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">Hiragana (Kata)</th>
                  <th className="px-4 py-3">Romaji</th>
                  <th className="px-4 py-3">Arti Bahasa Indonesia</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVocab.map((item, idx) => {
      const isSpeaking = activeAudioId === item.id;
      const isFav = favorites[item.id];
      const isWordMastered = isMastered("hiraganaVocab", item.id);
      return <tr
        key={item.id}
        className={`hover:bg-stone-50/70 transition-colors ${isWordMastered ? "bg-emerald-50/30" : ""}`}
      >
                      <td className="px-4 py-3 text-xs text-stone-600 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold font-['Noto_Sans_JP'] text-base text-stone-900">
                        {item.japanese}
                      </td>
                      <td className="px-4 py-3 text-rose-700 font-semibold text-xs">
                        <span className={showRomaji ? "" : "blur-[3px] select-none hover:blur-none"}>
                          {item.romaji}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-800 font-medium">{item.indonesian}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
        onClick={() => toggleMastered("hiraganaVocab", item.id)}
        className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${isWordMastered ? "bg-emerald-600 text-white" : "bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800"}`}
        title={isWordMastered ? "Klik untuk batal status kuasai" : "Tandai dikuasai"}
      >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isWordMastered ? "Dikuasai" : "Hafal"}
                          </button>
                          <button
        onClick={(e) => handlePlayAudio(item.japanese, item.id, e)}
        className={`p-2 rounded-lg transition-colors ${isSpeaking ? "bg-rose-700 text-white" : "bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700"}`}
        title="Putar Audio (Web Speech API)"
      >
                            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-bounce" : ""}`} />
                          </button>
                          <button
        onClick={(e) => handleToggleFavorite(item.id, e)}
        className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
        title="Tandai"
      >
                            {isFav ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> : <Bookmark className="w-3.5 h-3.5 text-stone-600" />}
                          </button>
                        </div>
                      </td>
                    </tr>;
    })}
              </tbody>
            </table>
          </div>
        </div>
  )}
    </div>;
};
