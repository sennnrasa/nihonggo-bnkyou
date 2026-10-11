import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { HIRAGANA_N5_VOCAB } from '../data/hiraganaN5Data';
import { KATAKANA_LOANWORDS } from '../data/katakanaData';
import { VERBS_DATA } from '../data/verbsData';
import { ALL_VOCAB_DATA } from '../data/vocabData';
import { GRAMMAR_PATTERNS } from '../data/grammarData';

const STORAGE_KEY = 'nihongo_mastered_progress';
const STREAK_STORAGE_KEY = 'nihongo_daily_streak_tracker';
const DAILY_VOCAB_STORAGE_KEY = 'nihongo_daily_vocab_tracker';
const FAVORITE_VOCAB_STORAGE_KEY = 'nihongo_favorite_vocab';
const FAVORITE_GRAMMAR_STORAGE_KEY = 'nihongo_favorite_grammar';

export const getTodayDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDaysBetweenDates = (dateStr1, dateStr2) => {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

const DEFAULT_STATE = {
  hiraganaChars: {},
  katakanaChars: {},
  hiraganaVocab: {},
  katakanaVocab: {},
  verbs: {},
};

const DEFAULT_STREAK = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  activeDates: [],
  totalDaysActive: 0,
};

const ProgressContext = createContext(undefined);

export const ProgressProvider = ({ children }) => {
  const [progressState, setProgressState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          hiraganaChars: parsed.hiraganaChars || {},
          katakanaChars: parsed.katakanaChars || {},
          hiraganaVocab: parsed.hiraganaVocab || {},
          katakanaVocab: parsed.katakanaVocab || {},
          verbs: parsed.verbs || {},
          lastUpdated: parsed.lastUpdated || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.error('Failed to load learning progress from localStorage:', e);
    }
    return DEFAULT_STATE;
  });

  const [streakState, setStreakState] = useState(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
          longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
          lastActiveDate: parsed.lastActiveDate || null,
          activeDates: Array.isArray(parsed.activeDates) ? parsed.activeDates : [],
          totalDaysActive: typeof parsed.totalDaysActive === 'number' ? parsed.totalDaysActive : 0,
        };
      }
    } catch (e) {
      console.error('Failed to load streak from localStorage:', e);
    }
    return DEFAULT_STREAK;
  });

  const [dailyVocabState, setDailyVocabState] = useState(() => {
    try {
      const saved = localStorage.getItem(DAILY_VOCAB_STORAGE_KEY);
      const today = getTodayDateString();
      if (saved) {
        const parsed = JSON.parse(saved);
        const goal = typeof parsed.goal === 'number' && parsed.goal > 0 ? parsed.goal : 10;
        if (parsed.date === today) {
          return {
            date: today,
            goal,
            learnedWordIds: Array.isArray(parsed.learnedWordIds) ? parsed.learnedWordIds : [],
          };
        } else {
          return {
            date: today,
            goal,
            learnedWordIds: [],
          };
        }
      }
    } catch (e) {
      console.error('Failed to load daily vocab goal from localStorage:', e);
    }
    return {
      date: getTodayDateString(),
      goal: 10,
      learnedWordIds: [],
    };
  });

  // Favorite (Starred) Items State
  const [favoriteVocabIds, setFavoriteVocabIds] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITE_VOCAB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load favorite vocab from localStorage:', e);
    }
    return [];
  });

  const [favoriteGrammarIds, setFavoriteGrammarIds] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITE_GRAMMAR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load favorite grammar from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
    } catch (e) {
      console.error('Failed to save learning progress to localStorage:', e);
    }
  }, [progressState]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakState));
    } catch (e) {
      console.error('Failed to save daily streak to localStorage:', e);
    }
  }, [streakState]);

  useEffect(() => {
    try {
      localStorage.setItem(DAILY_VOCAB_STORAGE_KEY, JSON.stringify(dailyVocabState));
    } catch (e) {
      console.error('Failed to save daily vocab goal to localStorage:', e);
    }
  }, [dailyVocabState]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_VOCAB_STORAGE_KEY, JSON.stringify(favoriteVocabIds));
    } catch (e) {
      console.error('Failed to save favorite vocab to localStorage:', e);
    }
  }, [favoriteVocabIds]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_GRAMMAR_STORAGE_KEY, JSON.stringify(favoriteGrammarIds));
    } catch (e) {
      console.error('Failed to save favorite grammar to localStorage:', e);
    }
  }, [favoriteGrammarIds]);

  const { effectiveStreak, isTodayPracticed } = useMemo(() => {
    const today = getTodayDateString();
    if (!streakState.lastActiveDate) {
      return { effectiveStreak: 0, isTodayPracticed: false };
    }

    const diff = getDaysBetweenDates(streakState.lastActiveDate, today);

    if (diff === 0) {
      return {
        effectiveStreak: Math.max(1, streakState.currentStreak),
        isTodayPracticed: true,
      };
    } else if (diff === 1) {
      return {
        effectiveStreak: streakState.currentStreak,
        isTodayPracticed: false,
      };
    } else {
      return {
        effectiveStreak: 0,
        isTodayPracticed: false,
      };
    }
  }, [streakState]);

  const recordDailyActivity = () => {
    setStreakState((prev) => {
      const today = getTodayDateString();
      const activeDatesSet = new Set(prev.activeDates || []);
      const wasAlreadyInList = activeDatesSet.has(today);
      activeDatesSet.add(today);
      const newActiveDates = Array.from(activeDatesSet);

      if (prev.lastActiveDate === today) {
        return {
          ...prev,
          activeDates: newActiveDates,
        };
      }

      let newStreak = 1;
      if (prev.lastActiveDate) {
        const diff = getDaysBetweenDates(prev.lastActiveDate, today);
        if (diff === 1) {
          newStreak = (prev.currentStreak || 0) + 1;
        } else if (diff === 0) {
          newStreak = Math.max(1, prev.currentStreak || 1);
        } else {
          newStreak = 1;
        }
      }

      const newLongest = Math.max(prev.longestStreak || 0, newStreak);
      const newTotalDays = wasAlreadyInList ? (prev.totalDaysActive || 1) : ((prev.totalDaysActive || 0) + 1);

      return {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        activeDates: newActiveDates,
        totalDaysActive: newTotalDays,
      };
    });
  };

  const resetStreak = () => {
    setStreakState(DEFAULT_STREAK);
  };

  const weeklyStreakDays = useMemo(() => {
    const today = new Date();
    const days = [];
    const dayNamesIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const activeSet = new Set(streakState.activeDates || []);

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = getTodayDateString(d);
      const dayName = dayNamesIndo[d.getDay()];
      const dayNum = d.getDate();
      const isToday = i === 0;
      const isActive = activeSet.has(dateStr);

      days.push({
        dateStr,
        dayName,
        dayNum,
        isActive,
        isToday,
      });
    }
    return days;
  }, [streakState.activeDates]);

  const recordDailyVocabLearned = (wordId) => {
    recordDailyActivity();
    setDailyVocabState((prev) => {
      const today = getTodayDateString();
      const currentList = prev.date === today ? prev.learnedWordIds : [];
      if (currentList.includes(wordId)) return prev;
      return {
        ...prev,
        date: today,
        learnedWordIds: [...currentList, wordId],
      };
    });
  };

  const setDailyVocabGoal = (goal) => {
    const validGoal = Math.max(1, Math.round(goal));
    setDailyVocabState((prev) => ({
      ...prev,
      goal: validGoal,
    }));
  };

  const dailyVocabLearnedCount = useMemo(() => {
    const today = getTodayDateString();
    return dailyVocabState.date === today ? dailyVocabState.learnedWordIds.length : 0;
  }, [dailyVocabState]);

  const dailyVocabGoalProgressPercent = useMemo(() => {
    if (dailyVocabState.goal <= 0) return 0;
    return Math.min(100, Math.round((dailyVocabLearnedCount / dailyVocabState.goal) * 100));
  }, [dailyVocabLearnedCount, dailyVocabState.goal]);

  const isDailyVocabGoalAchieved = dailyVocabLearnedCount >= dailyVocabState.goal;

  const isMastered = (category, idOrChar) => {
    switch (category) {
      case 'hiraganaChar':
        return !!progressState.hiraganaChars[idOrChar];
      case 'katakanaChar':
        return !!progressState.katakanaChars[idOrChar];
      case 'hiraganaVocab':
        return !!progressState.hiraganaVocab[idOrChar];
      case 'katakanaVocab':
        return !!progressState.katakanaVocab[idOrChar];
      case 'verb':
      case 'verbs':
        return !!progressState.verbs[idOrChar];
      default:
        return false;
    }
  };

  const toggleMastered = (category, idOrChar) => {
    recordDailyActivity();
    const isVocab =
      category === 'hiraganaVocab' ||
      category === 'katakanaVocab' ||
      category === 'verb' ||
      category === 'verbs';
    const wasMastered = isMastered(category, idOrChar);
    if (isVocab && !wasMastered) {
      recordDailyVocabLearned(idOrChar);
    }

    setProgressState((prev) => {
      const now = new Date().toISOString();
      switch (category) {
        case 'hiraganaChar': {
          const next = { ...prev.hiraganaChars };
          if (next[idOrChar]) delete next[idOrChar];
          else next[idOrChar] = true;
          return { ...prev, hiraganaChars: next, lastUpdated: now };
        }
        case 'katakanaChar': {
          const next = { ...prev.katakanaChars };
          if (next[idOrChar]) delete next[idOrChar];
          else next[idOrChar] = true;
          return { ...prev, katakanaChars: next, lastUpdated: now };
        }
        case 'hiraganaVocab': {
          const next = { ...prev.hiraganaVocab };
          if (next[idOrChar]) delete next[idOrChar];
          else next[idOrChar] = true;
          return { ...prev, hiraganaVocab: next, lastUpdated: now };
        }
        case 'katakanaVocab': {
          const next = { ...prev.katakanaVocab };
          if (next[idOrChar]) delete next[idOrChar];
          else next[idOrChar] = true;
          return { ...prev, katakanaVocab: next, lastUpdated: now };
        }
        case 'verb':
        case 'verbs': {
          const next = { ...prev.verbs };
          if (next[idOrChar]) delete next[idOrChar];
          else next[idOrChar] = true;
          return { ...prev, verbs: next, lastUpdated: now };
        }
        default:
          return prev;
      }
    });
  };

  const setMasteredBatch = (category, idsOrChars, mastered) => {
    if (mastered) {
      recordDailyActivity();
      if (
        category === 'hiraganaVocab' ||
        category === 'katakanaVocab' ||
        category === 'verb' ||
        category === 'verbs'
      ) {
        idsOrChars.forEach((id) => recordDailyVocabLearned(id));
      }
    }
    setProgressState((prev) => {
      const now = new Date().toISOString();
      const targetKey =
        category === 'hiraganaChar'
          ? 'hiraganaChars'
          : category === 'katakanaChar'
          ? 'katakanaChars'
          : category === 'hiraganaVocab'
          ? 'hiraganaVocab'
          : category === 'katakanaVocab'
          ? 'katakanaVocab'
          : 'verbs';

      const currentMap = { ...(prev[targetKey] || {}) };
      idsOrChars.forEach((id) => {
        if (mastered) {
          currentMap[id] = true;
        } else {
          delete currentMap[id];
        }
      });

      return {
        ...prev,
        [targetKey]: currentMap,
        lastUpdated: now,
      };
    });
  };

  const resetCategoryProgress = (category) => {
    setProgressState((prev) => {
      const targetKey =
        category === 'hiraganaChar'
          ? 'hiraganaChars'
          : category === 'katakanaChar'
          ? 'katakanaChars'
          : category === 'hiraganaVocab'
          ? 'hiraganaVocab'
          : category === 'katakanaVocab'
          ? 'katakanaVocab'
          : 'verbs';

      return {
        ...prev,
        [targetKey]: {},
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const resetAllProgress = () => {
    setProgressState({
      hiraganaChars: {},
      katakanaChars: {},
      hiraganaVocab: {},
      katakanaVocab: {},
      verbs: {},
      lastUpdated: new Date().toISOString(),
    });
  };

  // Counts
  const hiraganaCharsCount = useMemo(
    () => Object.values(progressState.hiraganaChars).filter(Boolean).length,
    [progressState.hiraganaChars]
  );
  const katakanaCharsCount = useMemo(
    () => Object.values(progressState.katakanaChars).filter(Boolean).length,
    [progressState.katakanaChars]
  );
  const hiraganaVocabCount = useMemo(
    () => Object.values(progressState.hiraganaVocab).filter(Boolean).length,
    [progressState.hiraganaVocab]
  );
  const katakanaVocabCount = useMemo(
    () => Object.values(progressState.katakanaVocab).filter(Boolean).length,
    [progressState.katakanaVocab]
  );
  const verbsCount = useMemo(
    () => Object.values(progressState.verbs).filter(Boolean).length,
    [progressState.verbs]
  );

  const totalMastered =
    hiraganaCharsCount + katakanaCharsCount + hiraganaVocabCount + katakanaVocabCount + verbsCount;

  const totalItems =
    HIRAGANA_DATA.length +
    KATAKANA_DATA.length +
    ALL_VOCAB_DATA.length +
    VERBS_DATA.length;

  const totalPercentage = totalItems > 0 ? Math.round((totalMastered / totalItems) * 100) : 0;

  // Rank / Level computation
  const { rankTitle, rankLevel, nextRankThreshold, rankBadgeEmoji } = useMemo(() => {
    if (totalMastered >= 450) {
      return {
        rankTitle: 'Tatsujin (達人 - Master Bahasa Jepang)',
        rankLevel: 5,
        nextRankThreshold: 729,
        rankBadgeEmoji: '👑',
      };
    }
    if (totalMastered >= 250) {
      return {
        rankTitle: 'Kotoba Senshi (言葉戦士 - Pejuang Kosakata N5)',
        rankLevel: 4,
        nextRankThreshold: 450,
        rankBadgeEmoji: '⚡',
      };
    }
    if (totalMastered >= 100) {
      return {
        rankTitle: 'Kana Master (仮名マスター - Penguasa Huruf)',
        rankLevel: 3,
        nextRankThreshold: 250,
        rankBadgeEmoji: '🎌',
      };
    }
    if (totalMastered >= 30) {
      return {
        rankTitle: 'Chousensha (挑戦者 - Penjelajah Aktif)',
        rankLevel: 2,
        nextRankThreshold: 100,
        rankBadgeEmoji: '🌱',
      };
    }
    return {
      rankTitle: 'Hajimemashite (初めまして - Pemula)',
      rankLevel: 1,
      nextRankThreshold: 30,
      rankBadgeEmoji: '🌸',
    };
  }, [totalMastered]);

  // Favorite handlers
  const isVocabFavorite = (id) => {
    return favoriteVocabIds.includes(id);
  };

  const isGrammarFavorite = (id) => {
    return favoriteGrammarIds.includes(id);
  };

  const toggleVocabFavorite = (id) => {
    recordDailyActivity();
    setFavoriteVocabIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleGrammarFavorite = (id) => {
    recordDailyActivity();
    setFavoriteGrammarIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const removeFavorite = (type, id) => {
    if (type === 'vocab') {
      setFavoriteVocabIds((prev) => prev.filter((item) => item !== id));
    } else {
      setFavoriteGrammarIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const clearAllFavorites = () => {
    setFavoriteVocabIds([]);
    setFavoriteGrammarIds([]);
  };

  const favoriteVocabCount = favoriteVocabIds.length;
  const favoriteGrammarCount = favoriteGrammarIds.length;
  const favoriteTotalCount = favoriteVocabCount + favoriteGrammarCount;

  const favoriteVocabList = useMemo(() => {
    if (favoriteVocabIds.length === 0) return [];
    const idSet = new Set(favoriteVocabIds);
    return ALL_VOCAB_DATA.filter((item) => idSet.has(item.id));
  }, [favoriteVocabIds]);

  const favoriteGrammarList = useMemo(() => {
    if (favoriteGrammarIds.length === 0) return [];
    const idSet = new Set(favoriteGrammarIds);
    return GRAMMAR_PATTERNS.filter((item) => idSet.has(item.id));
  }, [favoriteGrammarIds]);

  return (
    <ProgressContext.Provider
      value={{
        isMastered,
        toggleMastered,
        setMasteredBatch,
        resetCategoryProgress,
        resetAllProgress,
        hiraganaCharsCount,
        katakanaCharsCount,
        hiraganaVocabCount,
        katakanaVocabCount,
        verbsCount,
        totalMastered,
        totalItems,
        totalPercentage,
        rankTitle,
        rankLevel,
        nextRankThreshold,
        rankBadgeEmoji,
        currentStreak: effectiveStreak,
        longestStreak: streakState.longestStreak,
        isTodayPracticed,
        lastActiveDate: streakState.lastActiveDate,
        totalDaysActive: streakState.totalDaysActive,
        weeklyStreakDays,
        recordDailyActivity,
        resetStreak,
        dailyVocabGoal: dailyVocabState.goal,
        setDailyVocabGoal,
        dailyVocabLearnedCount,
        dailyVocabLearnedIds: dailyVocabState.date === getTodayDateString() ? dailyVocabState.learnedWordIds : [],
        recordDailyVocabLearned,
        dailyVocabGoalProgressPercent,
        isDailyVocabGoalAchieved,
        favoriteVocabIds,
        favoriteGrammarIds,
        isVocabFavorite,
        isGrammarFavorite,
        toggleVocabFavorite,
        toggleGrammarFavorite,
        removeFavorite,
        clearAllFavorites,
        favoriteVocabCount,
        favoriteGrammarCount,
        favoriteTotalCount,
        favoriteVocabList,
        favoriteGrammarList,
        progressState,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
