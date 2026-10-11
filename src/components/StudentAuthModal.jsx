import { useState } from "react";
import { X, UserCheck, GraduationCap } from "lucide-react";
import { useStudent } from "../context/StudentContext";
const COMMON_CLASSES = [
  "X MIPA 1",
  "X IPS 1",
  "XI MIPA 2",
  "XI IPS 1",
  "XII MIPA 1",
  "XII IPS 2",
  "Kelas Bahasa Jepang A",
  "Umum / Mandiri"
];
export const StudentAuthModal = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentStudent, login, logout, isLoading } = useStudent();
  const [name, setName] = useState(currentStudent?.name || "");
  const [className, setClassName] = useState(currentStudent?.className || "");
  const [level, setLevel] = useState(currentStudent?.currentLevel || "N5");
  const [errorMsg, setErrorMsg] = useState("");
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Silakan masukkan nama lengkap siswa.");
      return;
    }
    if (!className.trim()) {
      setErrorMsg("Silakan pilih atau masukkan kelas.");
      return;
    }
    setErrorMsg("");
    const success = await login(name.trim(), className.trim(), level);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg("Gagal menyimpan profil siswa. Coba lagi.");
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col transition-colors">
        {
    /* Modal Header */
  }
        <div className="bg-gradient-to-r from-rose-900 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-rose-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {currentStudent ? "Profil & Akun Siswa" : "Masuk Belajar Siswa"}
              </h3>
              <p className="text-xs text-rose-200">
                Masukkan Nama & Kelas untuk memantau progres belajar
              </p>
            </div>
          </div>
          {currentStudent && <button
    onClick={onClose}
    className="p-1.5 rounded-full hover:bg-white/15 text-stone-300 hover:text-white transition-colors cursor-pointer"
  >
              <X className="w-5 h-5" />
            </button>}
        </div>

        {
    /* Modal Body */
  }
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMsg && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>}

          {currentStudent && <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <div>
                <p className="font-bold">Saat ini terhubung sebagai:</p>
                <p className="text-stone-700 dark:text-stone-300 font-semibold mt-0.5">
                  👤 {currentStudent.name} ({currentStudent.className})
                </p>
              </div>
              <button
    type="button"
    onClick={() => {
      logout();
      setName("");
      setClassName("");
    }}
    className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
  >
                Ganti Siswa
              </button>
            </div>}

          {
    /* Nama Siswa */
  }
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>Nama Lengkap Siswa</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Contoh: Budi Santoso"
    required
    autoFocus
    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:border-rose-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm outline-none transition-all"
  />
          </div>

          {
    /* Kelas */
  }
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>Kelas / Rombel</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
    type="text"
    value={className}
    onChange={(e) => setClassName(e.target.value)}
    placeholder="Contoh: X MIPA 1 / XII IPS 2"
    required
    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:border-rose-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm outline-none transition-all"
  />
            {
    /* Quick Class Selection Chips */
  }
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_CLASSES.map((cls) => <button
    type="button"
    key={cls}
    onClick={() => setClassName(cls)}
    className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-colors cursor-pointer ${className === cls ? "bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold" : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"}`}
  >
                  {cls}
                </button>)}
            </div>
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            ℹ️ <strong>Tanpa kata sandi atau akun Google:</strong> Cukup masukkan Nama dan Kelas Anda. Data progres kuis dan hafalan Anda akan otomatis tercatat di dashboard pemantauan guru secara realtime.
          </div>

          {
    /* Submit Button */
  }
          <div className="pt-2 flex items-center justify-end gap-2">
            {currentStudent && <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
  >
                Tutup
              </button>}
            <button
    type="submit"
    disabled={isLoading}
    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
  >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? "Menyimpan..." : "Mulai Belajar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
