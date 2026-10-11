import { createContext, useContext, useState, useEffect } from 'react';

const STUDENT_STORAGE_KEY = 'nihongo_student_user';

const StudentContext = createContext(undefined);

export const StudentProvider = ({ children }) => {
  const [currentStudent, setCurrentStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse student data from localStorage:', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentStudent) {
      try {
        localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(currentStudent));
      } catch (e) {
        console.error('Failed to save student to localStorage:', e);
      }
    } else {
      localStorage.removeItem(STUDENT_STORAGE_KEY);
    }
  }, [currentStudent]);

  const login = async (name, className, level = 'N5') => {
    if (!name.trim() || !className.trim()) return false;
    setIsLoading(true);
    try {
      const response = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          className: className.trim(),
          currentLevel: level,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal login ke server');
      }

      const data = await response.json();
      if (data.student) {
        setCurrentStudent(data.student);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (error) {
      console.warn('Backend login fallback to local session:', error);
      const localStudent = {
        id: 'std-' + Date.now(),
        name: name.trim(),
        className: className.trim(),
        currentLevel: level,
        quizzesTaken: 0,
        quizAvgScore: 0,
        wordsMastered: 0,
        grammarLearned: 0,
        flashcardsReviewed: 0,
        streakDays: 1,
        lastActive: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        quizHistory: [],
      };
      setCurrentStudent(localStudent);
      setIsAuthModalOpen(false);
      return true;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const logout = () => {
    setCurrentStudent(null);
    localStorage.removeItem(STUDENT_STORAGE_KEY);
  };

  const refreshStudent = async () => {
    if (!currentStudent) return;
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        const found = data.students?.find((s) => s.id === currentStudent.id);
        if (found) {
          setCurrentStudent(found);
        }
      }
    } catch (e) {
      console.warn('Could not refresh student from server:', e);
    }
  };

  const recordQuizCompleted = async (mode, score, total) => {
    if (!currentStudent) return;

    const percentage = Math.round((score / Math.max(1, total)) * 100);
    const newQuiz = {
      id: 'q-' + Date.now(),
      date: new Date().toISOString(),
      mode,
      score,
      total,
      percentage,
    };

    const updatedHistory = [newQuiz, ...(currentStudent.quizHistory || [])].slice(0, 20);
    const totalScore = updatedHistory.reduce((acc, q) => acc + q.percentage, 0);
    const avg = Math.round(totalScore / updatedHistory.length);

    const updatedStudent = {
      ...currentStudent,
      quizzesTaken: (currentStudent.quizzesTaken || 0) + 1,
      quizAvgScore: avg,
      quizHistory: updatedHistory,
      lastActive: new Date().toISOString(),
    };

    setCurrentStudent(updatedStudent);

    try {
      await fetch('/api/students/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          name: currentStudent.name,
          className: currentStudent.className,
          quizResult: { mode, score, total },
        }),
      });
    } catch (e) {
      console.warn('Could not sync quiz progress to server:', e);
    }
  };

  const recordProgressSync = async (stats) => {
    if (!currentStudent) return;

    const updatedStudent = {
      ...currentStudent,
      ...(stats.wordsMastered !== undefined && { wordsMastered: stats.wordsMastered }),
      ...(stats.grammarLearned !== undefined && { grammarLearned: stats.grammarLearned }),
      ...(stats.flashcardsReviewed !== undefined && { flashcardsReviewed: stats.flashcardsReviewed }),
      ...(stats.streakDays !== undefined && { streakDays: stats.streakDays }),
      ...(stats.currentLevel !== undefined && { currentLevel: stats.currentLevel }),
      lastActive: new Date().toISOString(),
    };

    setCurrentStudent(updatedStudent);

    try {
      await fetch('/api/students/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          name: currentStudent.name,
          className: currentStudent.className,
          ...stats,
        }),
      });
    } catch (e) {
      console.warn('Could not sync progress to server:', e);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        currentStudent,
        isLoggedIn: !!currentStudent,
        login,
        logout,
        recordQuizCompleted,
        recordProgressSync,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLoading,
        refreshStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
