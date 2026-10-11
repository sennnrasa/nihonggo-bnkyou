import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Flame,
  Clock,
  X,
  Eye,
  Trash2,
  GraduationCap,
  BookOpen,
  ArrowUpDown,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
const ADMIN_PIN = "080515";
export const AdminDashboard = ({
  onBackToHome,
  onSelectStudentAsActive
}) => {
  const { currentStudent } = useStudent();
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_pin_authenticated") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [notification, setNotification] = useState(null);
  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsPinAuthenticated(true);
      sessionStorage.setItem("admin_pin_authenticated", "true");
      setPinError("");
      fetchStudents();
    } else {
      setPinError("PIN salah! Silakan masukkan PIN pengajar yang benar.");
    }
  };
  const handleLockAdmin = () => {
    setIsPinAuthenticated(false);
    sessionStorage.removeItem("admin_pin_authenticated");
    setPinInput("");
    setPinError("");
  };
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (e) {
      console.error("Failed to fetch students:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isPinAuthenticated) {
      fetchStudents();
    }
  }, [isPinAuthenticated]);
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3e3);
  };
  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Hapus data progres siswa "${name}"?`)) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        if (selectedStudentDetail?.id === id) {
          setSelectedStudentDetail(null);
        }
        showNotification(`Data ${name} berhasil dihapus.`);
      }
    } catch (e) {
      console.error("Failed to delete student:", e);
    }
  };
  const handleResetData = async () => {
    if (!window.confirm("Bersihkan SEMUA data siswa di database? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch("/api/students/reset", { method: "POST" });
      if (res.ok) {
        setStudents([]);
        showNotification("Semua data siswa berhasil dibersihkan.");
      }
    } catch (e) {
      console.error("Failed to reset students:", e);
    }
  };
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = [
      "No",
      "Nama Siswa",
      "Kelas",
      "Level JLPT",
      "Total Kuis",
      "Rata-rata Skor (%)",
      "Kosakata Dikuasai",
      "Pola Kalimat Dipelajari",
      "Flashcard Dipelajari",
      "Streak Hari",
      "Terakhir Aktif"
    ];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.name}"`,
      `"${s.className}"`,
      s.currentLevel,
      s.quizzesTaken,
      s.quizAvgScore,
      s.wordsMastered,
      s.grammarLearned,
      s.flashcardsReviewed,
      s.streakDays,
      `"${new Date(s.lastActive).toLocaleString("id-ID")}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_progres_siswa_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("File rekap CSV berhasil diunduh.");
  };
  const classOptions = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set).sort();
  }, [students]);
  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (selectedClass !== "all") {
      list = list.filter((s) => s.className.toLowerCase() === selectedClass.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.className.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      }
      if (sortBy === "score") {
        return b.quizAvgScore - a.quizAvgScore;
      }
      if (sortBy === "words") {
        return b.wordsMastered - a.wordsMastered;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    return list;
  }, [students, selectedClass, searchQuery, sortBy]);
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) return { total: 0, avgScore: 0, totalQuizzes: 0, activeToday: 0 };
    const totalQuizzes = students.reduce((acc, s) => acc + (s.quizzesTaken || 0), 0);
    const studentsWithScore = students.filter((s) => s.quizzesTaken > 0);
    const avgScore = studentsWithScore.length > 0 ? Math.round(
      studentsWithScore.reduce((acc, s) => acc + (s.quizAvgScore || 0), 0) / studentsWithScore.length
    ) : 0;
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const activeToday = students.filter((s) => s.lastActive?.startsWith(todayStr)).length;
    return { total, avgScore, totalQuizzes, activeToday };
  }, [students]);
  const formatRelativeTime = (isoString) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      if (diffMins < 2) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return isoString;
    }
  };
  if (!isPinAuthenticated) {
    return <div className="max-w-md mx-auto my-6 sm:my-16 p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-6 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border-2 border-rose-200 dark:border-rose-900/60 shadow-xs">
          <KeyRound className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900/60">
            <Lock className="w-3.5 h-3.5" />
            <span>Area Khusus Guru & Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            Masukkan PIN Keamanan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Halaman ini khusus untuk pemantauan rekap progres siswa. Silakan masukkan PIN pengajar untuk membuka akses.
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              PIN Dashboard Guru:
            </label>
            <input
      type="password"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={10}
      value={pinInput}
      onChange={(e) => {
        setPinInput(e.target.value);
        setPinError("");
      }}
      placeholder="••••••"
      autoFocus
      className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:border-rose-500 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-950 text-center tracking-widest text-xl font-mono font-bold text-stone-900 dark:text-stone-100 outline-none transition-all shadow-inner"
    />
          </div>

          {
      /* Quick numeric buttons for phone/mobile */
    }
          <div className="grid grid-cols-3 gap-2 pt-1 max-w-[240px] mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => <button
      key={digit}
      type="button"
      onClick={() => {
        setPinInput((prev) => prev.length < 8 ? prev + digit : prev);
        setPinError("");
      }}
      className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:bg-rose-100 dark:active:bg-rose-950/60 font-bold text-stone-900 dark:text-stone-100 text-base transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
    >
                {digit}
              </button>)}
            <button
      type="button"
      onClick={() => setPinInput("")}
      className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 font-bold text-xs transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
    >
              C
            </button>
            <button
      type="button"
      onClick={() => {
        setPinInput((prev) => prev.length < 8 ? prev + "0" : prev);
        setPinError("");
      }}
      className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:bg-rose-100 dark:active:bg-rose-950/60 font-bold text-stone-900 dark:text-stone-100 text-base transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
    >
              0
            </button>
            <button
      type="button"
      onClick={() => setPinInput((prev) => prev.slice(0, -1))}
      className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 font-bold text-xs transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
    >
              ⌫
            </button>
          </div>

          {pinError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-in shake duration-200">
              {pinError}
            </div>}

          <div className="flex flex-col gap-2 pt-2">
            <button
      type="submit"
      className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
    >
              <Unlock className="w-4 h-4" />
              <span>Buka Dashboard Guru</span>
            </button>
            <button
      type="button"
      onClick={onBackToHome}
      className="w-full py-2.5 rounded-2xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
    >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Belajar</span>
            </button>
          </div>
        </form>
      </div>;
  }
  return <div className="space-y-6 animate-in fade-in duration-300">
      {
    /* Toast Notification */
  }
      {notification && <div className="fixed top-4 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-stone-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>}

      {
    /* Header Banner */
  }
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Dashboard Pengajar & Pemantau Siswa (Aktif)</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Tabel Progres Siswa Bahasa Jepang 📊
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Data murni dari siswa yang login dengan Nama & Kelas. Pantau capaian kuis, jumlah kosakata yang dikuasai,
            dan konsistensi streak tanpa data dummy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
    onClick={fetchStudents}
    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
    title="Muat ulang data siswa"
  >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
    onClick={handleExportCSV}
    disabled={students.length === 0}
    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
    title="Unduh rekap progres seluruh siswa ke format CSV / Excel"
  >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
    onClick={handleLockAdmin}
    className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-800"
    title="Kunci dashboard dan keluar sesi admin"
  >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci Admin</span>
          </button>
          <button
    onClick={onBackToHome}
    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer border border-stone-700"
  >
            Kembali
          </button>
        </div>
      </div>

      {
    /* Top 4 Summary Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {
    /* Total Siswa */
  }
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Total Siswa</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-2">
            {stats.total}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Siswa terdaftar di sistem</p>
        </div>

        {
    /* Rata-rata Skor */
  }
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Rata-rata Nilai Kuis</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 mt-2">
            {stats.avgScore}%
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Dari seluruh kuis yang diambil</p>
        </div>

        {
    /* Total Kuis Diselesaikan */
  }
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Kuis Dikerjakan</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-400 mt-2">
            {stats.totalQuizzes}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Sesi latihan interaktif</p>
        </div>

        {
    /* Siswa Aktif Hari Ini */
  }
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Aktif Hari Ini</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
            {stats.activeToday} Siswa
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Melakukan aktivitas belajar</p>
        </div>
      </div>

      {
    /* Filter & Search Bar */
  }
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {
    /* Search Input */
  }
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Cari siswa berdasarkan nama atau kelas..."
    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950 text-xs sm:text-sm outline-none transition-all"
  />
            {searchQuery && <button
    onClick={() => setSearchQuery("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs"
  >
                ✕
              </button>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {
    /* Filter by Class */
  }
            <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="bg-transparent text-stone-800 dark:text-stone-200 font-bold outline-none cursor-pointer text-xs"
  >
                <option value="all" className="dark:bg-stone-800">Semua Kelas ({students.length})</option>
                {classOptions.map((cls) => <option key={cls} value={cls} className="dark:bg-stone-800">
                    {cls}
                  </option>)}
              </select>
            </div>

            {
    /* Sort by */
  }
            <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-transparent text-stone-800 dark:text-stone-200 font-bold outline-none cursor-pointer text-xs"
  >
                <option value="recent" className="dark:bg-stone-800">Terakhir Aktif</option>
                <option value="score" className="dark:bg-stone-800">Nilai Kuis Tertinggi</option>
                <option value="words" className="dark:bg-stone-800">Kosakata Terbanyak</option>
                <option value="name" className="dark:bg-stone-800">Nama (A - Z)</option>
              </select>
            </div>

            {
    /* Reset button */
  }
            <button
    onClick={handleResetData}
    className="px-2.5 py-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
    title="Reset ke data awal"
  >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {
    /* Active Class Chips */
  }
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-stone-500 dark:text-stone-400 font-semibold text-[11px]">Filter Cepat:</span>
          <button
    onClick={() => setSelectedClass("all")}
    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${selectedClass === "all" ? "bg-rose-600 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
            Semua ({students.length})
          </button>
          {classOptions.map((cls) => <button
    key={cls}
    onClick={() => setSelectedClass(cls)}
    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${selectedClass === cls ? "bg-rose-600 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
  >
              {cls}
            </button>)}
        </div>
      </div>

      {
    /* Main Student Progress Table */
  }
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/80 text-[11px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-300">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4 text-center">Level JLPT</th>
                <th className="py-3.5 px-4 text-center">Kuis & Rata-rata</th>
                <th className="py-3.5 px-4 text-center">Kosakata</th>
                <th className="py-3.5 px-4 text-center">Pola Kalimat</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4">Terakhir Aktif</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm">
              {loading ? <tr>
                  <td colSpan={10} className="py-12 text-center text-stone-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                    <span>Memuat data siswa...</span>
                  </td>
                </tr> : filteredStudents.length === 0 ? <tr>
                  <td colSpan={10} className="py-14 text-center text-stone-500">
                    <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    {students.length === 0 ? <>
                        <p className="font-bold text-base text-stone-800">Belum Ada Siswa yang Terdaftar</p>
                        <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 leading-relaxed">
                          Database siswa masih bersih tanpa data dummy. Saat siswa membuka aplikasi dan memasukkan <strong>Nama Lengkap</strong> serta <strong>Kelas</strong> di halaman awal, profil & progres mereka akan otomatis tampil di sini secara realtime.
                        </p>
                      </> : <>
                        <p className="font-bold text-stone-700">Tidak ada siswa yang cocok</p>
                        <p className="text-xs text-stone-500 mt-1">
                          Coba ganti filter kelas atau kata kunci pencarian Anda.
                        </p>
                      </>}
                  </td>
                </tr> : filteredStudents.map((student, index) => {
    const isCurrent = currentStudent?.id === student.id;
    const scoreBadgeColor = student.quizAvgScore >= 85 ? "bg-emerald-100 text-emerald-800 border-emerald-300" : student.quizAvgScore >= 70 ? "bg-amber-100 text-amber-800 border-amber-300" : student.quizzesTaken === 0 ? "bg-stone-100 text-stone-500 border-stone-200" : "bg-rose-100 text-rose-800 border-rose-300";
    return <tr
      key={student.id}
      className={`hover:bg-rose-50/30 transition-colors ${isCurrent ? "bg-amber-50/40" : ""}`}
    >
                      {
      /* No */
    }
                      <td className="py-3.5 px-4 text-center font-bold text-stone-400 text-xs">
                        {index + 1}
                      </td>

                      {
      /* Nama Siswa */
    }
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {isCurrent && <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  Anda
                                </span>}
                            </div>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400">
                              ID: {student.id.slice(0, 10)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {
      /* Kelas */
    }
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700">
                          {student.className}
                        </span>
                      </td>

                      {
      /* Level JLPT */
    }
                      <td className="py-3.5 px-4 text-center">
                        <span
      className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black border ${student.currentLevel === "N5" ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900" : student.currentLevel === "N4" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" : student.currentLevel === "N3" ? "bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-900" : student.currentLevel === "N2" ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900" : "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900"}`}
    >
                          {student.currentLevel}
                        </span>
                      </td>

                      {
      /* Kuis & Rata-rata */
    }
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold border ${scoreBadgeColor}`}
    >
                            {student.quizzesTaken > 0 ? `${student.quizAvgScore}%` : "Belum Kuis"}
                          </span>
                          <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                            {student.quizzesTaken} Kuis Selesai
                          </span>
                        </div>
                      </td>

                      {
      /* Kosakata */
    }
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {student.wordsMastered || 0}
                        </span>
                        <span className="text-[10px] text-stone-400 block">kata</span>
                      </td>

                      {
      /* Pola Kalimat */
    }
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-indigo-700 dark:text-indigo-400">
                          {student.grammarLearned || 0}
                        </span>
                        <span className="text-[10px] text-stone-400 block">pola</span>
                      </td>

                      {
      /* Streak */
    }
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900/60 text-xs">
                          <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                          <span>{student.streakDays || 0}h</span>
                        </span>
                      </td>

                      {
      /* Terakhir Aktif */
    }
                      <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{formatRelativeTime(student.lastActive)}</span>
                        </div>
                      </td>

                      {
      /* Aksi */
    }
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
      onClick={() => setSelectedStudentDetail(student)}
      className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400 transition-colors cursor-pointer"
      title="Lihat Detail Rapor Siswa"
    >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
      onClick={() => handleDeleteStudent(student.id, student.name)}
      className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors cursor-pointer"
      title="Hapus data siswa"
    >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>;
  })}
            </tbody>
          </table>
        </div>

        {
    /* Footer of Table */
  }
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Menampilkan <strong>{filteredStudents.length}</strong> dari{" "}
            <strong>{students.length}</strong> total siswa
          </span>
          <span className="italic">
            💡 Nilai kuis dan kosakata di atas diperbarui secara otomatis setiap kali siswa belajar.
          </span>
        </div>
      </div>

      {
    /* DETAIL MODAL FOR SELECTED STUDENT */
  }
      {selectedStudentDetail && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
            {
    /* Modal Header */
  }
            <div className="bg-gradient-to-r from-stone-900 to-rose-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white font-black text-lg flex items-center justify-center border border-white/20">
                  {selectedStudentDetail.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {selectedStudentDetail.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-rose-200">
                    <span>Kelas: <strong>{selectedStudentDetail.className}</strong></span>
                    <span>•</span>
                    <span>Level: <strong>{selectedStudentDetail.currentLevel}</strong></span>
                  </div>
                </div>
              </div>
              <button
    onClick={() => setSelectedStudentDetail(null)}
    className="p-1.5 rounded-full hover:bg-white/15 text-stone-300 hover:text-white transition-colors cursor-pointer"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            {
    /* Modal Body */
  }
            <div className="p-6 overflow-y-auto space-y-5">
              {
    /* Quick Metrics */
  }
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60">
                  <div className="text-xl font-black text-amber-900 dark:text-amber-200">
                    {selectedStudentDetail.quizAvgScore}%
                  </div>
                  <div className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 mt-0.5">
                    Rata-rata Kuis
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60">
                  <div className="text-xl font-black text-rose-700 dark:text-rose-300">
                    {selectedStudentDetail.wordsMastered}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 mt-0.5">
                    Kosakata
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60">
                  <div className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                    {selectedStudentDetail.grammarLearned}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-400 mt-0.5">
                    Tata Bahasa
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60">
                  <div className="text-xl font-black text-orange-700 dark:text-orange-300">
                    {selectedStudentDetail.streakDays} Hari
                  </div>
                  <div className="text-[10px] font-bold uppercase text-orange-700 dark:text-orange-400 mt-0.5">
                    Streak
                  </div>
                </div>
              </div>

              {
    /* Riwayat Kuis Siswa */
  }
              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center justify-between">
                  <span>Riwayat Pengerjaan Kuis</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">
                    {selectedStudentDetail.quizHistory?.length || 0} riwayat tersimpan
                  </span>
                </h4>

                {!selectedStudentDetail.quizHistory || selectedStudentDetail.quizHistory.length === 0 ? <div className="p-6 text-center text-stone-400 dark:text-stone-500 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
                    Siswa belum menyelesaikan kuis atau riwayat masih kosong.
                  </div> : <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selectedStudentDetail.quizHistory.map((q) => <div
    key={q.id}
    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs"
  >
                        <div>
                          <p className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                            {q.mode.replace(/-/g, " ")}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            {new Date(q.date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
    className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs ${q.percentage >= 80 ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"}`}
  >
                            {q.percentage}%
                          </span>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                            {q.score} / {q.total} benar
                          </span>
                        </div>
                      </div>)}
                  </div>}
              </div>

              {
    /* Info Registrasi & Terakhir Aktif */
  }
              <div className="text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
                <p>
                  📅 <strong>Terdaftar sejak:</strong>{" "}
                  {new Date(selectedStudentDetail.registeredAt || selectedStudentDetail.lastActive).toLocaleDateString("id-ID", {
    dateStyle: "long"
  })}
                </p>
                <p>
                  ⏱️ <strong>Aktivitas Terakhir:</strong>{" "}
                  {new Date(selectedStudentDetail.lastActive).toLocaleString("id-ID")} (
                  {formatRelativeTime(selectedStudentDetail.lastActive)})
                </p>
              </div>
            </div>

            {
    /* Modal Footer */
  }
            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              {onSelectStudentAsActive && <button
    onClick={() => {
      onSelectStudentAsActive(selectedStudentDetail);
      setSelectedStudentDetail(null);
      showNotification(`Beralih ke akun ${selectedStudentDetail.name}`);
    }}
    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
  >
                  Masuk sebagai Siswa ini
                </button>}
              <button
    onClick={() => setSelectedStudentDetail(null)}
    className="ml-auto px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
  >
                Tutup
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
