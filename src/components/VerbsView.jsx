import { useState, useMemo } from "react";
import { VERBS_DATA } from "../data/verbsData";
import { playJapaneseSpeech } from "../utils/audio";
import { useProgress } from "../context/ProgressContext";
import {
  Search,
  Volume2,
  Filter,
  Info,
  Bookmark,
  BookmarkCheck,
  Eye,
  EyeOff,
  Layers,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
export const VerbsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [activeTabForm, setActiveTabForm] = useState("all");
  const [hideForms, setHideForms] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedVerbId, setExpandedVerbId] = useState(null);
  const { isMastered, toggleMastered, verbsCount } = useProgress();
  const masteredPercent = Math.round(verbsCount / VERBS_DATA.length * 100);
  const filteredVerbs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VERBS_DATA.filter((v) => {
      const isVerbMastered = isMastered("verbs", v.id);
      if (masteryFilter === "mastered" && !isVerbMastered) return false;
      if (masteryFilter === "unmastered" && isVerbMastered) return false;
      const matchesGroup = selectedGroup === "all" || v.group === selectedGroup;
      const matchesFav = !onlyFavorites || favorites[v.id];
      const matchesSearch = !q || v.dictionary.toLowerCase().includes(q) || v.masu.toLowerCase().includes(q) || v.te.toLowerCase().includes(q) || v.nai.toLowerCase().includes(q) || v.ta.toLowerCase().includes(q) || v.romaji.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q);
      return matchesGroup && matchesFav && matchesSearch;
    });
  }, [searchQuery, selectedGroup, masteryFilter, onlyFavorites, favorites, isMastered]);
  const handlePlayAudio = async (text, id) => {
    setActiveAudioId(id);
    await playJapaneseSpeech(text, 0.85);
    setActiveAudioId(null);
  };
  const handleCopy = (verb, id) => {
    navigator.clipboard.writeText(
      `${verb.dictionary} | ${verb.masu} | ${verb.te} | ${verb.nai} | ${verb.ta} - ${verb.meaning}`
    );
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return <div className="space-y-6">
      {
    /* Hero Banner */
  }
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-rose-500/30">
            <Layers className="w-3.5 h-3.5" />
            Doushi (動詞) - Kata Kerja & Konjugasi Bentuk
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Kamus Kata Kerja & Konjugasi Bentuk
          </h1>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            Daftar lengkap kata kerja dasar JLPT N5 terbagi dalam <span className="font-bold text-white">3 Golongan (Godan, Ichidan, Fukisoku)</span> beserta 5 perubahan bentuk utama: Kamus (Jisho), Masu (Sopan), Te (Menyambung), Nai (Negatif), dan Ta (Lampau).
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Progres: <strong className="text-white font-bold">{verbsCount}</strong>/{VERBS_DATA.length} ({masteredPercent}%) Dikuasai
              </span>
              <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden ml-1">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${masteredPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Educational Guide Card */
  }
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm mb-3">
          <Info className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          Panduan Ringkas 3 Golongan Kata Kerja Bahasa Jepang
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1">
            <div className="font-bold text-stone-900 dark:text-stone-100">1. Golongan 1 (Godan 動詞)</div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Berakhiran huruf vokal <strong>~u</strong> (ku, su, tsu, nu, bu, mu, ru, u). Berubah vokal saat dikonjugasikan (contoh: iku ➔ ikimasu).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1">
            <div className="font-bold text-stone-900 dark:text-stone-100">2. Golongan 2 (Ichidan 動詞)</div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Berakhiran <strong>~iru</strong> atau <strong>~eru</strong>. Konjugasi sangat mudah: cukup hilangkan "ru" dan ganti dengan masu/te/nai/ta (contoh: taberu ➔ tabemasu).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1">
            <div className="font-bold text-stone-900 dark:text-stone-100">3. Golongan 3 (Irregular / Tidak Beraturan)</div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Hanya ada 2 kata dasar: <strong>する (suru - melakukan)</strong> dan <strong>くる (kuru - datang)</strong>, serta kata majemuknya (benkyou suru, sanpo suru).
            </p>
          </div>
        </div>
      </div>

      {
    /* Controls: Search & Group Filter */
  }
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {
    /* Search Input */
  }
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
            <input
    id="input-search-verbs"
    type="text"
    placeholder="Cari kata kerja (misal: taberu, makan, iku, nomimasu, suru)..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-11 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-rose-600 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400"
  />
          </div>

          {
    /* Quick Buttons */
  }
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {
    /* Mastery Filter Buttons */
  }
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              <button
    onClick={() => setMasteryFilter("all")}
    className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${masteryFilter === "all" ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold" : "text-stone-700 dark:text-stone-300"}`}
  >
                Semua
              </button>
              <button
    onClick={() => setMasteryFilter("unmastered")}
    className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${masteryFilter === "unmastered" ? "bg-amber-600 text-white shadow-xs font-bold" : "text-stone-700 dark:text-stone-300"}`}
  >
                Belum
              </button>
              <button
    onClick={() => setMasteryFilter("mastered")}
    className={`px-2.5 py-1 font-semibold rounded-lg flex items-center gap-1 transition-all ${masteryFilter === "mastered" ? "bg-emerald-600 text-white shadow-xs font-bold" : "text-stone-700 dark:text-stone-300"}`}
  >
                <Check className="w-3 h-3" />
                Hafal ({verbsCount})
              </button>
            </div>

            <button
    id="btn-toggle-verb-test"
    onClick={() => setHideForms(!hideForms)}
    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${hideForms ? "border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold" : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"}`}
  >
              {hideForms ? <Eye className="w-4 h-4 text-rose-700 dark:text-rose-400" /> : <EyeOff className="w-4 h-4 text-stone-500 dark:text-stone-400" />}
              {hideForms ? "Tampilkan" : "Uji Ingatan"}
            </button>

            <button
    onClick={() => setOnlyFavorites(!onlyFavorites)}
    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${onlyFavorites ? "border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold" : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"}`}
  >
              {onlyFavorites ? <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <Bookmark className="w-4 h-4 text-stone-500 dark:text-stone-400" />}
              ({Object.values(favorites).filter(Boolean).length})
            </button>
          </div>
        </div>

        {
    /* Group Selector Chips */
  }
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Golongan:
          </span>
          {[
    { id: "all", label: "Semua Golongan" },
    { id: "group1", label: "Golongan 1 (Godan)" },
    { id: "group2", label: "Golongan 2 (Ichidan)" },
    { id: "group3", label: "Golongan 3 (Irregular)" }
  ].map((grp) => <button
    key={grp.id}
    onClick={() => setSelectedGroup(grp.id)}
    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${selectedGroup === grp.id ? "bg-rose-700 text-white font-bold shadow-xs" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
              {grp.label}
            </button>)}
        </div>
      </div>

      {
    /* Count Info */
  }
      <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 px-1 font-medium">
        <span>
          Menampilkan <strong className="text-stone-900 dark:text-stone-100">{filteredVerbs.length}</strong> kata kerja
        </span>
      </div>

      {
    /* Verbs List */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVerbs.map((verb) => {
    const isFav = favorites[verb.id];
    const isExpanded = expandedVerbId === verb.id;
    const isCopied = copiedId === verb.id;
    const isVerbMastered = isMastered("verbs", verb.id);
    return <div
      key={verb.id}
      className={`bg-white dark:bg-stone-900 rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group ${isVerbMastered ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20" : "border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-700"}`}
    >
              <div>
                {
      /* Header */
    }
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {verb.groupName}
                      </span>
                      <span className="text-xs font-mono text-rose-700 dark:text-rose-400 font-semibold">
                        {verb.romaji}
                      </span>
                    </div>

                    <div className="text-2xl font-black font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100 mt-1">
                      {verb.dictionary}
                    </div>
                    <div className="text-sm font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                      Arti: {verb.meaning}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    <button
      onClick={() => toggleMastered("verbs", verb.id)}
      className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${isVerbMastered ? "bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700" : "bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400"}`}
      title={isVerbMastered ? "Klik untuk batal status kuasai" : "Tandai sudah dikuasai"}
    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isVerbMastered ? "Dikuasai" : "Hafal"}
                    </button>
                    <button
      onClick={() => handleCopy(verb, verb.id)}
      title="Salin perubahan kata kerja"
      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
      onClick={(e) => toggleFavorite(verb.id, e)}
      className="p-1.5 rounded-lg transition-colors cursor-pointer"
      title={isFav ? "Hapus bookmark" : "Tandai kata"}
    >
                      {isFav ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200" />}
                    </button>
                    <button
      onClick={() => handlePlayAudio(verb.dictionary, `v-audio-${verb.id}`)}
      className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400 transition-colors cursor-pointer"
      title="Dengarkan pengucapan"
    >
                      <Volume2 className={`w-4 h-4 ${activeAudioId === `v-audio-${verb.id}` ? "text-rose-700 dark:text-rose-400 animate-bounce" : ""}`} />
                    </button>
                  </div>
                </div>

                {
      /* 5 Forms Grid */
    }
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {
      /* Kamus */
    }
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-150 dark:border-stone-700/60">
                    <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">Kamus (Jisho)</div>
                    <div className={`font-bold font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100 mt-0.5 ${hideForms ? "blur-xs select-none hover:blur-none cursor-pointer" : ""}`}>
                      {verb.dictionary.split(" ")[0]}
                    </div>
                  </div>

                  {
      /* Masu */
    }
                  <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
                    <div className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300">Masu (Sopan)</div>
                    <div className={`font-bold font-['Noto_Sans_JP'] text-rose-950 dark:text-rose-200 mt-0.5 ${hideForms ? "blur-xs select-none hover:blur-none cursor-pointer" : ""}`}>
                      {verb.masu}
                    </div>
                  </div>

                  {
      /* Te */
    }
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-150 dark:border-stone-700/60">
                    <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">Te (Sambung)</div>
                    <div className={`font-bold font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100 mt-0.5 ${hideForms ? "blur-xs select-none hover:blur-none cursor-pointer" : ""}`}>
                      {verb.te}
                    </div>
                  </div>

                  {
      /* Nai */
    }
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-150 dark:border-stone-700/60">
                    <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">Nai (Negatif)</div>
                    <div className={`font-bold font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100 mt-0.5 ${hideForms ? "blur-xs select-none hover:blur-none cursor-pointer" : ""}`}>
                      {verb.nai}
                    </div>
                  </div>

                  {
      /* Ta */
    }
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-150 dark:border-stone-700/60 col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">Ta (Lampau)</div>
                    <div className={`font-bold font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100 mt-0.5 ${hideForms ? "blur-xs select-none hover:blur-none cursor-pointer" : ""}`}>
                      {verb.ta}
                    </div>
                  </div>
                </div>

                {
      /* Example sentence */
    }
                <div className="mt-3 p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-700 dark:text-stone-300 font-semibold">
                    <span>Contoh Kalimat:</span>
                    <button
      onClick={() => handlePlayAudio(verb.example, `ex-${verb.id}`)}
      className="text-stone-600 dark:text-stone-400 hover:text-rose-700 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
    >
                      <Volume2 className={`w-3 h-3 ${activeAudioId === `ex-${verb.id}` ? "text-rose-700 dark:text-rose-400 animate-bounce" : ""}`} />
                      Audio
                    </button>
                  </div>
                  <div className="text-stone-900 dark:text-stone-100 font-bold font-['Noto_Sans_JP'] text-sm">
                    {verb.example}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                    {verb.exampleRomaji}
                  </div>
                  <div className="text-stone-800 dark:text-stone-200 font-medium pt-0.5">
                    Arti: {verb.exampleMeaning}
                  </div>
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
