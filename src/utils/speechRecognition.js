export function isSpeechRecognitionSupported() {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}
export function katakanaToHiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 96;
    return String.fromCharCode(chr);
  });
}
export function normalizeJapaneseText(text) {
  if (!text) return "";
  return text.normalize("NFKC").toLowerCase().replace(/[、。！？\s\-_.,/()（）~〜]/g, "").trim();
}
export function calculateLevenshteinDistance(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b[j - 1] === a[i - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          // deletion
          matrix[j][i - 1] + 1,
          // insertion
          matrix[j - 1][i - 1] + 1
          // substitution
        );
      }
    }
  }
  return matrix[bn][an];
}
export function calculateSimilarityScore(source, target) {
  if (!source || !target) return 0;
  if (source === target) return 100;
  const distance = calculateLevenshteinDistance(source, target);
  const maxLength = Math.max(source.length, target.length);
  if (maxLength === 0) return 100;
  const similarity = Math.max(0, 1 - distance / maxLength);
  return Math.round(similarity * 100);
}
export function evaluatePronunciation(userTranscript, targetJapanese, targetRomaji) {
  const cleanTranscript = normalizeJapaneseText(userTranscript);
  const hiraganaTranscript = katakanaToHiragana(cleanTranscript);
  const targetOptions = targetJapanese.split("/").map((opt) => opt.replace(/\([^)]*\)/g, "").trim()).filter(Boolean);
  let bestScore = 0;
  let matchedTarget = targetJapanese;
  for (const opt of targetOptions) {
    const cleanOpt = normalizeJapaneseText(opt);
    const hiraganaOpt = katakanaToHiragana(cleanOpt);
    if (cleanTranscript === cleanOpt || hiraganaTranscript === hiraganaOpt) {
      bestScore = 100;
      matchedTarget = opt;
      break;
    }
    if (cleanTranscript.includes(cleanOpt) || hiraganaTranscript.includes(hiraganaOpt)) {
      bestScore = Math.max(bestScore, 95);
      matchedTarget = opt;
      continue;
    }
    const scoreKana = calculateSimilarityScore(hiraganaTranscript, hiraganaOpt);
    const scoreRaw = calculateSimilarityScore(cleanTranscript, cleanOpt);
    const currentScore = Math.max(scoreKana, scoreRaw);
    if (currentScore > bestScore) {
      bestScore = currentScore;
      matchedTarget = opt;
    }
  }
  if (bestScore < 70 && targetRomaji) {
    const cleanRomaji = normalizeJapaneseText(targetRomaji);
    const romajiScore = calculateSimilarityScore(cleanTranscript, cleanRomaji);
    if (romajiScore > bestScore) {
      bestScore = romajiScore;
    }
  }
  if (bestScore >= 90) {
    return {
      transcript: userTranscript,
      target: matchedTarget,
      romajiTarget: targetRomaji,
      score: bestScore,
      status: "perfect",
      feedbackTitle: "Sangat Sempurna! (\u3059\u3070\u3089\u3057\u3044)",
      feedbackDescription: "Pelafalan aksara dan intonasi Anda tepat seperti penutur asli Jepang.",
      isCorrect: true
    };
  } else if (bestScore >= 75) {
    return {
      transcript: userTranscript,
      target: matchedTarget,
      romajiTarget: targetRomaji,
      score: bestScore,
      status: "great",
      feedbackTitle: "Bagus Sekali! (\u3088\u304F\u3067\u304D\u307E\u3057\u305F)",
      feedbackDescription: "Pelafalan sudah sangat jelas dan mudah dipahami, hampir mendekati sempurna.",
      isCorrect: true
    };
  } else if (bestScore >= 50) {
    return {
      transcript: userTranscript,
      target: matchedTarget,
      romajiTarget: targetRomaji,
      score: bestScore,
      status: "partial",
      feedbackTitle: "Cukup Bagus! (\u3082\u3046\u3059\u3053\u3057)",
      feedbackDescription: "Bunyi konsonan atau panjang vokal sedikit berbeda. Dengarkan audio dan coba lagi.",
      isCorrect: false
    };
  } else {
    return {
      transcript: userTranscript,
      target: matchedTarget,
      romajiTarget: targetRomaji,
      score: bestScore,
      status: "retry",
      feedbackTitle: "Belum Tepat (\u304C\u3093\u3070\u3063\u3066)",
      feedbackDescription: "Kata yang terdengar belum sesuai dengan target. Klik tombol audio untuk menyimak pelafalan asli.",
      isCorrect: false
    };
  }
}
