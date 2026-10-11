import { useState, useMemo } from 'react';
import {
  Volume2,
  CheckCircle2,
  Search,
  Layers,
  ArrowRight,
  BookOpen,
  Check,
  Star
} from 'lucide-react';
import {
  VOCAB_N5,
  JLPT_LEVEL_INFO
} from '../data/vocabData';
import { playJapaneseSpeech } from '../utils/audio';
import { useProgress } from '../context/ProgressContext';

export const VocabListView = ({ onOpenFlashcards }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMastery, setFilterMastery] = useState('all');
  const [playingId, setPlayingId] = useState(null);

  const { isMastered, toggleMastered, isVocabFavorite, toggleVocabFavorite, favoriteVocabCount } = useProgress();

  const currentDataset = VOCAB_N5;

  const categories = useMemo(() => {
    const set = new Set();
    currentDataset.forEach((item) => set.add(item.category));
    return ['Semua', ...Array.from(set)];
  }, [currentDataset]);

  const filteredItems = useMemo(() => {
    return currentDataset.filter((item) => {
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }

      const mastered = isMastered('hiraganaVocab', item.id);
      const isFav = isVocabFavorite(item.id);
      if (filterMastery === 'mastered' && !mastered) return false;
      if (filterMastery === 'unmastered' && mastered) return false;
      if (filterMastery === 'favorites' && !isFav) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchJapanese = item.japanese.toLowerCase().includes(query);
        const matchReading = item.reading?.toLowerCase().includes(query);
        const matchRomaji = item.romaji.toLowerCase().includes(query);
        const matchIndo = item.indonesian.toLowerCase().includes(query);
        return matchJapanese || matchReading || matchRomaji || matchIndo;
      }

      return true;
    });
  }, [currentDataset, selectedCategory, filterMastery, searchQuery, isMastered, isVocabFavorite]);

  const levelInfo = JLPT_LEVEL_INFO['N5'];

  const handlePlayAudio = async (text, id) => {
    setPlayingId(id);
    await playJapaneseSpeech(text, 0.85);
    setPlayingId(null);
  };

  const masteredCount = currentDataset.filter((item) =>
    isMastered('hiraganaVocab', item.id)
  ).length;
  const levelMasteryPercent = currentDataset.length
    ? Math.round((masteredCount / currentDataset.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Level Header: Retro Pixel RPG Banner */}
      <div className="pixel-box bg-[#ffffff] dark:bg-[#1a1b26] p-5 sm:p-6 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-sm sm:text-base text-stone-900 dark:text-[#faf8f0]">
                {levelInfo.title.toUpperCase()}
              </span>
              <span className="text-base">{levelInfo.badgeEmoji}</span>
            </div>
            {/* Explanation in clear readable font */}
            <p className="font-explanation text-xs text-stone-600 dark:text-stone-300">
              {levelInfo.description}
            </p>
          </div>

          {onOpenFlashcards && (
            <button
              onClick={() => onOpenFlashcards('n5')}
              className="pixel-btn px-3.5 py-2 bg-rose-600 text-white font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[2px_2px_0_0_#000]"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>FLASHCARD 3D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mastery Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between font-pixel text-[9px] text-stone-600 dark:text-stone-400">
            <span>
              DIKUASAI: <strong>{masteredCount}</strong> / {currentDataset.length} KATA
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{levelMasteryPercent}%</span>
          </div>
          <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600 p-0.5">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.max(2, levelMasteryPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pixel-box-sm bg-[#ffffff] dark:bg-[#1a1b26] p-4 flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kanji, romaji, atau arti..."
            className="w-full pl-9 pr-3 py-1.5 font-explanation text-xs bg-stone-50 dark:bg-stone-900 border-2 border-stone-800 dark:border-stone-600 focus:outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-500"
          />
        </div>

        {/* Categories and Mastery Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="font-explanation text-xs bg-stone-50 dark:bg-stone-900 border-2 border-stone-800 dark:border-stone-600 px-3 py-1.5 text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                {cat}
              </option>
            ))}
          </select>

          {/* Mastery status toggle */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setFilterMastery('all')}
              className={`pixel-btn px-2 py-1 font-pixel text-[9px] cursor-pointer ${
                filterMastery === 'all'
                  ? 'bg-stone-900 text-[#fbbf24]'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterMastery('unmastered')}
              className={`pixel-btn px-2 py-1 font-pixel text-[9px] cursor-pointer ${
                filterMastery === 'unmastered'
                  ? 'bg-rose-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Belum
            </button>
            <button
              onClick={() => setFilterMastery('mastered')}
              className={`pixel-btn px-2 py-1 font-pixel text-[9px] cursor-pointer ${
                filterMastery === 'mastered'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Dikuasai
            </button>
            <button
              onClick={() => setFilterMastery('favorites')}
              className={`pixel-btn px-2 py-1 font-pixel text-[9px] cursor-pointer flex items-center gap-1 ${
                filterMastery === 'favorites'
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
              title="Tampilkan hanya kosakata favorit"
            >
              <Star className={`w-3 h-3 ${filterMastery === 'favorites' || favoriteVocabCount > 0 ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>★ ({favoriteVocabCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const mastered = isMastered('hiraganaVocab', item.id);
          const isFav = isVocabFavorite(item.id);
          const isPlaying = playingId === item.id;

          return (
            <div
              key={item.id}
              className={`pixel-box-sm p-4 transition-all flex flex-col justify-between space-y-3 ${
                mastered
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-500'
                  : isFav
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-2 border-amber-400'
                  : 'bg-[#ffffff] dark:bg-[#1a1b26] border-2 border-stone-800 dark:border-stone-700'
              }`}
            >
              {/* Card Top: Category, Badges & Audio / Mastered Controls */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-pixel text-[8px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 border border-stone-300 dark:border-stone-700">
                    {item.category}
                  </span>
                  {item.isLoanword && (
                    <span className="font-pixel text-[8px] bg-amber-100 dark:bg-amber-950 text-amber-800 px-1.5 py-0.5 border border-amber-300">
                      KATAKANA
                    </span>
                  )}
                  {isFav && (
                    <span className="font-pixel text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 border border-amber-400 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      <span>FAV</span>
                    </span>
                  )}
                  {mastered && (
                    <span className="font-pixel text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-400 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>OK</span>
                    </span>
                  )}
                </div>

                {/* Audio, Star & Mastered buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleVocabFavorite(item.id)}
                    className="pixel-btn p-1 bg-white dark:bg-stone-800 cursor-pointer"
                    title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-stone-400'}`} />
                  </button>

                  <button
                    onClick={() => handlePlayAudio(item.japanese, item.id)}
                    className="pixel-btn p-1 bg-white dark:bg-stone-800 cursor-pointer text-stone-700 dark:text-stone-300"
                    title="Putar audio"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-rose-600 animate-bounce' : ''}`} />
                  </button>

                  <button
                    onClick={() => toggleMastered('hiraganaVocab', item.id)}
                    className={`pixel-btn p-1 cursor-pointer ${
                      mastered ? 'bg-emerald-200 text-emerald-900' : 'bg-white dark:bg-stone-800 text-stone-600'
                    }`}
                    title={mastered ? 'Batalkan tanda dikuasai' : 'Tandai sudah dikuasai'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Script & Indonesian Meaning */}
              <div>
                <div className="font-pixel-jp text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-wide">
                  {item.japanese}
                </div>
                {item.reading && item.reading !== item.japanese && (
                  <div className="font-pixel-jp text-xs text-stone-500 mt-0.5">
                    ({item.reading})
                  </div>
                )}
                <div className="font-pixel text-[10px] text-rose-600 dark:text-rose-400 mt-1">
                  {item.romaji}
                </div>
                {/* Indonesian Meaning in clean standard font */}
                <div className="font-explanation text-xs font-semibold text-stone-800 dark:text-stone-200 pt-1">
                  {item.indonesian}
                </div>
                {item.origin && (
                  <div className="font-explanation text-[11px] text-stone-500">
                    (asal kata: {item.origin})
                  </div>
                )}
              </div>

              {/* Example Sentence if available */}
              {item.example && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-xs space-y-1 bg-stone-50 dark:bg-stone-900/60 p-2.5">
                  <div className="font-pixel-jp font-bold text-stone-900 dark:text-stone-100 text-xs">
                    {item.example}
                  </div>
                  {item.exampleRomaji && (
                    <div className="font-pixel text-[9px] text-rose-600">
                      {item.exampleRomaji}
                    </div>
                  )}
                  {/* Explanation translation strictly in readable font */}
                  {item.exampleIndo && (
                    <div className="font-explanation text-[11px] text-stone-600 dark:text-stone-400 italic">
                      "{item.exampleIndo}"
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 pixel-box bg-white dark:bg-stone-900 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="font-pixel text-xs text-stone-800 dark:text-stone-200">
            {filterMastery === 'favorites'
              ? 'BELUM ADA KOSAKATA YANG DIBINTANGI'
              : 'TIDAK ADA KOSAKATA YANG COCOK DENGAN FILTER'}
          </h4>
          <p className="font-explanation text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
            {filterMastery === 'favorites'
              ? 'Klik ikon bintang (⭐) pada kartu kosakata mana saja untuk menyimpannya ke daftar favorit Anda.'
              : 'Coba ubah kata kunci pencarian atau ubah filter kategori dan status penguasaan.'}
          </p>
        </div>
      )}
    </div>
  );
};
