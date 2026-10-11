import { useState } from "react";
import {
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  X,
  Compass,
  FileText,
  TrendingUp,
  Home,
  Bot,
  Menu,
  ChevronRight,
  GraduationCap,
  User,
  Lock,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import defaultAppLogo from "../assets/images/nihongo_app_logo_1789736949080.jpg";
import { useProgress } from "../context/ProgressContext";
import { useStudent } from "../context/StudentContext";
import { useTheme } from "../context/ThemeContext";

const DEFAULT_LOGO = defaultAppLogo;

const TAB_SECTION_TITLES = {
  home: { title: "Beranda Utama", badge: "Home", badgeColor: "bg-rose-100 text-rose-800 border-rose-300" },
  n5: { title: "Kosakata JLPT N5", badge: "Lengkap", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  grammar: { title: "Pola Kalimat (文法)", badge: "Bunpou N5", badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  kana: { title: "Tabel Huruf Kana", badge: "Hiragana & Katakana", badgeColor: "bg-stone-200 text-stone-800 border-stone-400" },
  particles: { title: "Partikel Tata Bahasa", badge: "18 Materi", badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  verbs: { title: "Kata Kerja & Konjugasi", badge: "47 Verba", badgeColor: "bg-teal-100 text-teal-800 border-teal-300" },
  quiz: { title: "Kuis Interaktif", badge: "Latihan Soal", badgeColor: "bg-amber-100 text-amber-800 border-amber-300" },
  flashcards: { title: "Flashcard 3D & Suara", badge: "Hafalan N5", badgeColor: "bg-rose-100 text-rose-800 border-rose-300" },
  chat: { title: "Nihongo Sensei AI", badge: "Tutor Cerdas", badgeColor: "bg-purple-100 text-purple-800 border-purple-300" },
  progress: { title: "Dasbor Progres & Analitik", badge: "Recharts", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  admin: { title: "Dashboard Guru & Admin", badge: "Khusus Guru", badgeColor: "bg-rose-100 text-rose-800 border-rose-300" }
};

export const Navbar = ({
  activeTab,
  setActiveTab,
  n5Count = 200,
  grammarCount = 24,
  verbsCount = 47,
  particlesCount = 18,
  onOpenStudentModal
}) => {
  const { totalPercentage } = useProgress();
  const { currentStudent, setIsAuthModalOpen, logout } = useStudent();
  const { isDark, toggleTheme } = useTheme();
  const [isQuickNavDrawerOpen, setIsQuickNavDrawerOpen] = useState(false);

  const handleOpenStudentLogin = () => {
    if (onOpenStudentModal) {
      onOpenStudentModal();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const navMenuItems = [
    {
      tab: "home",
      label: "Beranda Utama",
      sublabel: "Target harian, pencapaian lencana & ringkasan",
      icon: <Home className="w-4 h-4 text-stone-700" />
    },
    {
      tab: "n5",
      label: "Kosakata Lengkap JLPT N5",
      sublabel: "Salam, Angka, Waktu, Makanan & Kata Kerja",
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      badge: `${n5Count} Kata`
    },
    {
      tab: "grammar",
      label: "Pola Kalimat (文法)",
      sublabel: "Rumus tata bahasa N5 & contoh audio",
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      badge: `${grammarCount} Pola`
    },
    {
      tab: "kana",
      label: "Tabel Huruf Kana",
      sublabel: "Hiragana & Katakana lengkap bersuara",
      icon: <Layers className="w-4 h-4 text-rose-700" />,
      badge: "92 Huruf"
    },
    {
      tab: "particles",
      label: "Partikel Tata Bahasa (助詞)",
      sublabel: "は, が, を, に, で, へ & aturan penggunaannya",
      icon: <Compass className="w-4 h-4 text-indigo-700" />,
      badge: `${particlesCount} Materi`
    },
    {
      tab: "verbs",
      label: "Kata Kerja & Konjugasi",
      sublabel: "Golongan 1, 2, 3 & bentuk perubahan",
      icon: <FileText className="w-4 h-4 text-teal-800" />,
      badge: `${verbsCount} Verba`
    },
    {
      tab: "flashcards",
      label: "Flashcard 3D & Suara",
      sublabel: "Kartu hafalan interaktif kosakata N5",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: "Flashcard N5"
    },
    {
      tab: "quiz",
      label: "Kuis Interaktif",
      sublabel: "Latihan soal acak N5, Kana & partikel",
      icon: <HelpCircle className="w-4 h-4 text-rose-600" />
    },
    {
      tab: "chat",
      label: "Nihongo Sensei (AI Chat)",
      sublabel: "Tutor cerdas tanya jawab & latihan percakapan",
      icon: <Bot className="w-4 h-4 text-purple-700" />,
      badge: "Gemini AI"
    },
    {
      tab: "progress",
      label: "Dasbor Progres & Analitik",
      sublabel: "Grafik batang 7 hari Recharts & analitik",
      icon: <TrendingUp className="w-4 h-4 text-emerald-800" />,
      badge: `${totalPercentage}%`
    }
  ];

  const isLearningView = activeTab !== "home";

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#faf8f0]/95 dark:bg-[#12131a]/95 backdrop-blur-md border-b-2 border-stone-800 dark:border-stone-700 shadow-[0_2px_0_0_#1c1917] transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Pixel Hamburger Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsQuickNavDrawerOpen(true)}
                className="pixel-btn p-2 sm:px-2.5 sm:py-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
                title="Buka Menu Navigasi"
                aria-label="Buka Menu"
              >
                <Menu className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline">MENU</span>
              </button>

              {/* Title / Current Section */}
              {isLearningView ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="pixel-btn p-1.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer"
                    title="Kembali ke Beranda"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="font-pixel text-xs text-stone-900 dark:text-stone-100 truncate max-w-[170px] sm:max-w-xs">
                      {TAB_SECTION_TITLES[activeTab]?.title}
                    </span>
                    <span
                      className={`font-pixel text-[9px] px-2 py-0.5 border hidden sm:inline-block ${
                        TAB_SECTION_TITLES[activeTab]?.badgeColor || "bg-stone-100 text-stone-800 border-stone-300"
                      }`}
                    >
                      {TAB_SECTION_TITLES[activeTab]?.badge}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2.5 cursor-pointer ml-1"
                  onClick={() => setActiveTab("home")}
                >
                  <img
                    src={DEFAULT_LOGO}
                    alt="Logo"
                    className="w-8 h-8 sm:w-9 sm:h-9 pixel-box-sm object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-pixel text-sm sm:text-base text-stone-900 dark:text-[#faf8f0] tracking-tight">
                        NIHONGOQUEST
                      </span>
                      <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-[#fbbf24] text-stone-950 border border-stone-800">
                        N5
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Theme Toggle (Pixel Button) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="pixel-btn p-2 sm:px-3 sm:py-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-pixel text-[10px] cursor-pointer flex items-center gap-1.5"
                title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
                aria-label={isDark ? "Mode Terang" : "Mode Gelap"}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">TERANG</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">GELAP</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Retro Pixel Drawer */}
      {isQuickNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsQuickNavDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-[#faf8f0] dark:bg-[#12131a] border-r-4 border-stone-900 dark:border-stone-700 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b-2 border-stone-800 bg-[#1c1917] text-[#faf8f0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={DEFAULT_LOGO}
                    alt="Logo"
                    className="w-8 h-8 pixel-box-sm object-cover"
                  />
                  <div>
                    <h3 className="font-pixel text-xs text-[#fbbf24]">MENU NAVIGASI</h3>
                    <p className="font-pixel text-[9px] text-stone-400">NIHONGOQUEST JLPT N5</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQuickNavDrawerOpen(false)}
                  className="pixel-btn p-1 bg-stone-800 text-white cursor-pointer"
                  title="Tutup Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation List Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              <div className="font-pixel text-[9px] text-stone-500 uppercase tracking-wider px-2 py-1">
                PILIH MODUL BELAJAR:
              </div>

              {navMenuItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setIsQuickNavDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 text-left transition-all cursor-pointer border-2 ${
                      isActive
                        ? "bg-[#1c1917] text-[#fbbf24] border-[#fbbf24] shadow-[2px_2px_0_0_#000]"
                        : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-pixel text-[11px] leading-tight">
                          {item.label}
                        </div>
                        {/* Sublabel explanation in clear readable font */}
                        <div className="font-explanation text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {item.sublabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className="font-pixel text-[8px] px-1.5 py-0.5 border border-stone-400">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Drawer Section: Teacher & Profile */}
            <div className="p-3 border-t-2 border-stone-800 bg-[#fffdf5] dark:bg-[#181926] space-y-2">
              {/* Teacher Dashboard */}
              <button
                onClick={() => {
                  setActiveTab("admin");
                  setIsQuickNavDrawerOpen(false);
                }}
                className="w-full pixel-btn p-2.5 bg-stone-900 text-white flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-rose-600 text-white">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-pixel text-[10px] text-white flex items-center gap-1.5">
                      <span>DASHBOARD GURU</span>
                      <Lock className="w-3 h-3 text-rose-300" />
                    </div>
                    {/* Explanation in readable font */}
                    <p className="font-explanation text-[10px] text-stone-300">
                      Rekap nilai & pemantauan kelas siswa
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Student Profile Card */}
              <div className="pixel-box-sm p-2.5 bg-white dark:bg-stone-900 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-amber-400 text-stone-950 font-pixel text-[10px] flex items-center justify-center shrink-0 border border-stone-800">
                    {currentStudent ? currentStudent.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-pixel text-[10px] text-stone-900 dark:text-stone-100 truncate">
                      {currentStudent ? currentStudent.name : "TAMU (GUEST)"}
                    </div>
                    {/* Explanation in readable font */}
                    <div className="font-explanation text-[10px] text-stone-500 truncate">
                      {currentStudent ? `Kelas: ${currentStudent.className}` : "Belum masuk akun"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setIsQuickNavDrawerOpen(false);
                      handleOpenStudentLogin();
                    }}
                    className="pixel-btn px-2 py-1 bg-stone-100 text-stone-800 font-pixel text-[9px] cursor-pointer"
                  >
                    {currentStudent ? "GANTI" : "MASUK"}
                  </button>
                  {currentStudent && (
                    <button
                      onClick={() => {
                        logout();
                        setIsQuickNavDrawerOpen(false);
                      }}
                      className="pixel-btn p-1 text-rose-600 cursor-pointer"
                      title="Keluar"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
