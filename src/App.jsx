import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./components/HomeView";
import { KanaTable } from "./components/KanaTable";
import { VocabListView } from "./components/VocabListView";
import { GrammarView } from "./components/GrammarView";
import { ParticlesView } from "./components/ParticlesView";
import { VerbsView } from "./components/VerbsView";
import { QuizModule } from "./components/QuizModule";
import { FlashcardMode } from "./components/FlashcardMode";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SenseiChatView } from "./components/SenseiChatView";
import { AdminDashboard } from "./components/AdminDashboard";
import { StudentAuthModal } from "./components/StudentAuthModal";
import { ProgressProvider } from "./context/ProgressContext";
import { StudentProvider, useStudent } from "./context/StudentContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { VOCAB_N5 } from "./data/vocabData";
import { GRAMMAR_PATTERNS } from "./data/grammarData";
import { PARTICLES_DATA } from "./data/particlesData";
import { VERBS_DATA } from "./data/verbsData";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [quizInitialMode, setQuizInitialMode] = useState("katakana-to-romaji");
  const [flashcardDeck, setFlashcardDeck] = useState("n5");
  const { isAuthModalOpen, setIsAuthModalOpen } = useStudent();
  const { isDark, setTheme } = useTheme();

  const handleStartQuizFromKana = (script) => {
    if (script === "hiragana") {
      setQuizInitialMode("hiragana-to-romaji");
    } else {
      setQuizInitialMode("katakana-to-romaji");
    }
    setActiveTab("quiz");
  };

  const handleOpenFlashcards = (deck) => {
    setFlashcardDeck(deck);
    setActiveTab("flashcards");
  };

  const isLearningView = activeTab !== "home";

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f0] dark:bg-[#12131a] text-[#1c1917] dark:text-[#f3f4f6] selection:bg-[#fbbf24] selection:text-[#1c1917] retro-grid-bg transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        n5Count={VOCAB_N5.length}
        grammarCount={GRAMMAR_PATTERNS.length}
        verbsCount={VERBS_DATA.length}
        particlesCount={PARTICLES_DATA.length}
        onOpenStudentModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto ${
          isLearningView
            ? "max-w-7xl px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6"
            : "max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        }`}
      >
        {/* HOME VIEW */}
        {activeTab === "home" && (
          <HomeView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenStudentModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* JLPT N5 VOCABULARY VIEW */}
        {activeTab === "n5" && (
          <VocabListView
            initialLevel="N5"
            onOpenFlashcards={(lvl) => handleOpenFlashcards(lvl.toLowerCase())}
          />
        )}

        {/* POLA KALIMAT (TATA BAHASA N5) */}
        {activeTab === "grammar" && (
          <GrammarView
            onStartQuizWithGrammar={() => {
              setQuizInitialMode("particles");
              setActiveTab("quiz");
            }}
          />
        )}

        {/* KANA ALPHABET CHART */}
        {activeTab === "kana" && (
          <KanaTable onStartQuizWithScript={handleStartQuizFromKana} />
        )}

        {/* PARTICLES & GRAMMAR */}
        {activeTab === "particles" && <ParticlesView />}

        {/* VERBS & CONJUGATIONS */}
        {activeTab === "verbs" && <VerbsView />}

        {/* INTERACTIVE QUIZ GENERATOR */}
        {activeTab === "quiz" && (
          <QuizModule
            initialMode={quizInitialMode}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* FLASHCARD 3D */}
        {activeTab === "flashcards" && (
          <FlashcardMode
            initialDeck={flashcardDeck}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* PROGRESS DASHBOARD WITH RECHARTS 7-DAY BAR CHART */}
        {activeTab === "progress" && (
          <ProgressDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* NIHONGO SENSEI AI CHAT */}
        {activeTab === "chat" && (
          <SenseiChatView
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* ADMIN & TEACHER DASHBOARD */}
        {activeTab === "admin" && (
          <AdminDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Retro Pixel Footer */}
      <footer className="mt-auto border-t-2 border-stone-800 dark:border-stone-700 bg-[#fffdf5] dark:bg-[#181926] transition-colors py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-stone-900 dark:text-[#faf8f0]">
                NIHONGOQUEST JLPT N5
              </span>
              <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-[#fbbf24] text-stone-950 border border-stone-800">
                RETRO EDITION
              </span>
            </div>

            {/* Theme Toggle in Footer */}
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 border-2 border-stone-800 dark:border-stone-600">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`pixel-btn px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1 cursor-pointer ${
                  !isDark ? "bg-white text-stone-900" : "text-stone-500 hover:text-stone-900"
                }`}
                title="Pilih Mode Terang"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>TERANG</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`pixel-btn px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1 cursor-pointer ${
                  isDark ? "bg-stone-700 text-stone-100" : "text-stone-500 hover:text-stone-900"
                }`}
                title="Pilih Mode Gelap"
              >
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>GELAP</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            {/* Explanation / copyright in readable font */}
            <div className="font-explanation text-stone-600 dark:text-stone-400">
              &copy; {new Date().getFullYear()} NihongoQuest • Belajar Bahasa Jepang JLPT N5 &amp; Analitik Progres Siswa
            </div>
            <div className="font-pixel text-[9px] text-stone-500">
              RECHARTS 7-DAY VISUALIZER READY
            </div>
          </div>
        </div>
      </footer>

      {/* Global Student Authentication / Profile Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </StudentProvider>
    </ThemeProvider>
  );
}
