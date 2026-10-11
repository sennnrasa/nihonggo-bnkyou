import { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import { GRAMMAR_PATTERNS } from '../data/grammarData';
import { useStudent } from '../context/StudentContext';
import { useProgress } from '../context/ProgressContext';

export const GrammarView = ({ onStartQuizWithGrammar }) => {
  const { currentStudent, recordProgressSync } = useStudent();
  const { isGrammarFavorite, toggleGrammarFavorite, favoriteGrammarCount } = useProgress();
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [learnedPatterns, setLearnedPatterns] = useState(() => {
    try {
      const saved = localStorage.getItem('nihongo_learned_grammar');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleLearned = (id) => {
    setLearnedPatterns((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('nihongo_learned_grammar', JSON.stringify(next));
      } catch {}
      const count = Object.values(next).filter(Boolean).length;
      recordProgressSync({ grammarLearned: count });
      return next;
    });
  };

  const playJapaneseVoice = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredPatterns = useMemo(() => {
    return GRAMMAR_PATTERNS.filter((p) => {
      const matchLevel =
        selectedLevel === 'ALL'
          ? true
          : selectedLevel === 'FAVORITES'
          ? isGrammarFavorite(p.id)
          : p.level === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.pattern.toLowerCase().includes(q) ||
        p.romaji.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.explanation.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchLevel && matchQuery;
    });
  }, [selectedLevel, searchQuery, isGrammarFavorite]);

  const totalLearnedCount = useMemo(() => {
    return Object.values(learnedPatterns).filter(Boolean).length;
  }, [learnedPatterns]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="pixel-box bg-[#1c1917] dark:bg-[#12131a] text-[#faf8f0] p-5 sm:p-6 space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#292524] border-2 border-[#78350f] text-[#fbbf24] text-[10px] font-pixel">
              <BookOpen className="w-3.5 h-3.5" />
              <span>TATA BAHASA &amp; POLA KALIMAT (文法 - BUNPOU)</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-pixel text-[#fbbf24] tracking-tight">
              POLA KALIMAT JLPT N5 – N1 📖
            </h1>
            {/* Explanation in clear readable font */}
            <p className="font-explanation text-xs sm:text-sm text-stone-300 leading-relaxed">
              Kuasai struktur tata bahasa Jepang dari tingkat pemula hingga mahir dengan rumus pembentukan, makna, dan contoh kalimat audio penutur asli.
            </p>
          </div>

          {/* Progress Badge */}
          <div className="bg-[#292524] border-2 border-stone-600 p-4 min-w-[160px] text-center shrink-0 shadow-[2px_2px_0_0_#000]">
            <div className="font-pixel text-2xl text-indigo-400">
              {totalLearnedCount} / {GRAMMAR_PATTERNS.length}
            </div>
            <div className="font-pixel text-[9px] text-stone-400 mt-1">
              POLA DIKUASAI
            </div>
            <div className="w-full bg-[#1c1917] border border-stone-600 h-2 mt-2.5 p-0.5">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((totalLearnedCount / GRAMMAR_PATTERNS.length) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter by JLPT Level & Search */}
      <div className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Level Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`pixel-btn px-2.5 py-1 text-[10px] font-pixel whitespace-nowrap cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-[2px_2px_0_0_#000]'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {lvl === 'ALL' ? 'SEMUA' : lvl}
              </button>
            ))}
            <button
              onClick={() => setSelectedLevel(selectedLevel === 'FAVORITES' ? 'ALL' : 'FAVORITES')}
              className={`pixel-btn px-2.5 py-1 text-[10px] font-pixel whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedLevel === 'FAVORITES'
                  ? 'bg-amber-400 text-stone-950 shadow-[2px_2px_0_0_#000]'
                  : 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400'
              }`}
              title="Tampilkan hanya pola kalimat favorit"
            >
              <Star className={`w-3 h-3 ${selectedLevel === 'FAVORITES' || favoriteGrammarCount > 0 ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>★ ({favoriteGrammarCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pola, rumus, arti..."
              className="w-full pl-9 pr-3 py-1 font-explanation text-xs bg-stone-50 dark:bg-stone-900 border-2 border-stone-800 dark:border-stone-600 focus:outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Grammar Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatterns.length === 0 ? (
          <div className="col-span-full pixel-box bg-white dark:bg-stone-900 p-12 text-center text-stone-500">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <p className="font-pixel text-xs text-stone-800 dark:text-stone-200">
              {selectedLevel === 'FAVORITES'
                ? 'BELUM ADA POLA KALIMAT YANG DIBINTANGI'
                : 'TIDAK ADA POLA KALIMAT DITEMUKAN'}
            </p>
            <p className="font-explanation text-xs text-stone-500 mt-1">
              {selectedLevel === 'FAVORITES'
                ? 'Klik ikon bintang (⭐) pada pola kalimat mana saja untuk menyimpannya.'
                : 'Coba gunakan kata kunci pencarian lain.'}
            </p>
          </div>
        ) : (
          filteredPatterns.map((item) => {
            const isLearned = !!learnedPatterns[item.id];
            const isExpanded = expandedId === item.id;
            const isFav = isGrammarFavorite(item.id);

            return (
              <div
                key={item.id}
                className={`pixel-box-sm transition-all flex flex-col justify-between ${
                  isLearned
                    ? 'border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : isFav
                    ? 'border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-2 border-stone-800 dark:border-stone-700 bg-white dark:bg-[#1a1b26]'
                }`}
              >
                <div className="p-4 space-y-3">
                  {/* Top Level Badge & Category & Star */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300">
                        {item.level}
                      </span>
                      <span className="font-explanation text-[10px] text-stone-500">
                        {item.category}
                      </span>
                      {isFav && (
                        <span className="font-pixel text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 border border-amber-400 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          <span>FAV</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleGrammarFavorite(item.id)}
                        className="pixel-btn p-1 bg-white dark:bg-stone-800 cursor-pointer"
                        title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-stone-400'}`} />
                      </button>

                      <button
                        onClick={() => toggleLearned(item.id)}
                        className={`pixel-btn px-2 py-0.5 font-pixel text-[9px] flex items-center gap-1 cursor-pointer ${
                          isLearned
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isLearned ? 'OK' : 'TANDAI'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Pattern Header */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-pixel-jp text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                        {item.pattern}
                      </h3>
                      <button
                        onClick={() => playJapaneseVoice(item.pattern.replace(/～/g, ''))}
                        className="pixel-btn p-1 bg-white dark:bg-stone-800 text-stone-600 cursor-pointer"
                        title="Dengarkan pelafalan pola"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-pixel text-[9px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {item.romaji}
                    </p>
                    {/* Explanation in clear readable font */}
                    <p className="font-explanation text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1 leading-snug">
                      {item.meaning}
                    </p>
                  </div>

                  {/* Formation / Rumus */}
                  <div className="bg-stone-50 dark:bg-stone-900 p-2.5 border border-stone-300 dark:border-stone-700">
                    <span className="font-pixel text-[8px] text-stone-500 block mb-0.5">
                      📐 RUMUS PEMBENTUKAN:
                    </span>
                    <code className="font-explanation text-xs text-stone-900 dark:text-stone-100 font-semibold">
                      {item.formation}
                    </code>
                  </div>

                  {/* Explanation in clear readable font */}
                  <p className="font-explanation text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.explanation}
                  </p>

                  {/* Examples Toggle */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[9px] text-stone-700 dark:text-stone-300 uppercase">
                        CONTOH KALIMAT ({item.examples.length})
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="font-pixel text-[9px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'TUTUP' : 'LIHAT'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {(isExpanded ? item.examples : item.examples.slice(0, 1)).map((ex, idx) => (
                        <div
                          key={idx}
                          className="bg-stone-50 dark:bg-stone-900 p-2 border border-stone-200 dark:border-stone-800 space-y-0.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-pixel-jp font-bold text-stone-900 dark:text-stone-100 text-xs">{ex.japanese}</p>
                            <button
                              onClick={() => playJapaneseVoice(ex.japanese)}
                              className="text-stone-400 hover:text-indigo-600 p-0.5 cursor-pointer shrink-0"
                              title="Dengarkan audio contoh kalimat"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-pixel text-[9px] text-stone-500">{ex.romaji}</p>
                          {/* Indonesian translation in clear readable font */}
                          <p className="font-explanation text-xs text-stone-700 dark:text-stone-300">{ex.indonesian}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
