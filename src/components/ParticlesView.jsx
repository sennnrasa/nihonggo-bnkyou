import { useState, useMemo } from "react";
import { PARTICLES_DATA } from "../data/particlesData";
import { playJapaneseSpeech } from "../utils/audio";
import {
  Search,
  Volume2,
  Sparkles,
  Info,
  Copy,
  Check
} from "lucide-react";
export const ParticlesView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticleId, setSelectedParticleId] = useState(null);
  const [activeAudioIndex, setActiveAudioIndex] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  const filteredParticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PARTICLES_DATA;
    return PARTICLES_DATA.filter(
      (p) => p.particle.includes(q) || p.romaji.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.functions.some((f) => f.toLowerCase().includes(q)) || p.examples.some(
        (ex) => ex.japanese.includes(q) || ex.romaji.toLowerCase().includes(q) || ex.indonesian.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);
  const handlePlayAudio = async (text, id) => {
    setActiveAudioIndex(id);
    await playJapaneseSpeech(text, 0.85);
    setActiveAudioIndex(null);
  };
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1800);
  };
  return <div className="space-y-6">
      {
    /* Hero Banner */
  }
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Joshi (助詞) - Tata Bahasa Esensial
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Panduan Lengkap Partikel Bahasa Jepang
          </h1>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            Pahami fungsi, aturan posisi, dan perbedaan partikel penting (seperti <span className="text-rose-300 font-bold">は vs が</span>, <span className="text-rose-300 font-bold">に vs で</span>, <span className="text-rose-300 font-bold">へ vs に</span>) dengan contoh kalimat kontekstual dan audio suara asli Jepang.
          </p>
        </div>
      </div>

      {
    /* Search & Mode Bar */
  }
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
          <input
    id="input-search-particles"
    type="text"
    placeholder="Cari partikel (misal: は, wa, ga, topik, subjek, tujuan, alat)..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-11 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-rose-600 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400"
  />
        </div>

        <div className="flex items-center gap-2">
          <button
    id="btn-toggle-particle-practice"
    onClick={() => setPracticeMode(!practiceMode)}
    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${practiceMode ? "bg-rose-700 text-white border-rose-700 shadow-xs" : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700"}`}
  >
            {practiceMode ? "Mode Belajar Aktif" : "Mode Uji Mandiri (Tutup Contoh)"}
          </button>
        </div>
      </div>

      {
    /* Quick Jump Character Pills */
  }
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-stone-700 dark:text-stone-300 font-semibold shrink-0 mr-1">Partikel:</span>
        {PARTICLES_DATA.map((p) => <a
    key={p.id}
    href={`#${p.id}`}
    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 dark:hover:text-rose-400 font-bold text-stone-800 dark:text-stone-200 transition-all shrink-0 font-['Noto_Sans_JP']"
  >
            {p.particle} <span className="text-stone-500 dark:text-stone-400 font-normal text-[11px]">({p.romaji})</span>
          </a>)}
      </div>

      {
    /* Particles Grid */
  }
      <div className="space-y-6">
        {filteredParticles.map((item) => <div
    key={item.id}
    id={item.id}
    className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 transition-all space-y-5"
  >
            {
    /* Header: Particle Badge, Romaji & Title */
  }
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-3xl font-black font-['Noto_Sans_JP'] text-rose-800 dark:text-rose-300 shadow-2xs">
                  {item.particle}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      Romaji: {item.romaji}
                    </span>
                    <button
    onClick={() => handlePlayAudio(item.particle, `particle-${item.id}`)}
    className="p-1 rounded-md text-stone-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
    title="Dengar pelafalan"
  >
                      <Volume2 className={`w-4 h-4 ${activeAudioIndex === `particle-${item.id}` ? "text-rose-700 dark:text-rose-400 animate-bounce" : ""}`} />
                    </button>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 mt-1">
                    {item.title}
                  </h2>
                </div>
              </div>

              {
    /* Formula Badge */
  }
              <div className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-mono font-semibold text-stone-800 dark:text-stone-200">
                <span className="text-stone-500 dark:text-stone-400 font-normal">Pola: </span>
                {item.rules}
              </div>
            </div>

            {
    /* Functions List */
  }
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" /> Fungsi & Penggunaan:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                {item.functions.map((func, idx) => <li key={idx} className="flex items-start gap-2 bg-stone-50/70 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                    <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{func}</span>
                  </li>)}
              </ul>
            </div>

            {
    /* Comparison Callout (if available) */
  }
            {item.comparisons && <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200 text-xs sm:text-sm space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  Perbedaan Kunci: {item.particle} vs {item.comparisons.with}
                </div>
                <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed pl-5">
                  {item.comparisons.explanation}
                </p>
              </div>}

            {
    /* Example Sentences */
  }
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                <span>Contoh Kalimat Penggunaan:</span>
                {practiceMode && <span className="text-rose-700 dark:text-rose-400 font-bold normal-case">
                    *Arahkan kursor / klik untuk melihat arti kalimat
                  </span>}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {item.examples.map((ex, exIdx) => {
    const audioKey = `${item.id}-ex-${exIdx}`;
    const isCopied = copiedText === audioKey;
    return <div
      key={exIdx}
      className="p-4 rounded-2xl bg-stone-50/90 dark:bg-stone-800/60 border border-stone-200/90 dark:border-stone-700/80 hover:bg-white dark:hover:bg-stone-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all space-y-1.5 group"
    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base sm:text-lg font-bold font-['Noto_Sans_JP'] text-stone-900 dark:text-stone-100">
                            {ex.japanese}
                          </div>
                          <div className="text-xs font-mono text-rose-700 dark:text-rose-400 font-semibold mt-0.5">
                            {ex.romaji}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
      onClick={() => handleCopy(`${ex.japanese} (${ex.romaji}) - ${ex.indonesian}`, audioKey)}
      title="Salin kalimat"
      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700 transition-colors cursor-pointer"
    >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
      onClick={() => handlePlayAudio(ex.japanese, audioKey)}
      title="Putar suara kalimat"
      className="p-1.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-500 transition-all cursor-pointer shadow-2xs"
    >
                            <Volume2 className={`w-4 h-4 ${activeAudioIndex === audioKey ? "text-rose-700 animate-bounce" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {
      /* Indonesian Meaning */
    }
                      <div
      className={`text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 pt-1 transition-all ${practiceMode ? "blur-xs select-none hover:blur-none cursor-pointer" : ""}`}
    >
                        Arti: {ex.indonesian}
                      </div>

                      {ex.note && <div className="text-[11px] text-stone-600 dark:text-stone-400 italic pt-0.5">
                          💡 Catatan: {ex.note}
                        </div>}
                    </div>;
  })}
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
