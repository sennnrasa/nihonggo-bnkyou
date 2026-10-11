import { HIRAGANA_DATA, KATAKANA_DATA } from "../data/kanaData";
import {
  VOCAB_N5,
  VOCAB_N4,
  VOCAB_N3,
  VOCAB_N2,
  VOCAB_N1
} from "../data/vocabData";
import { VERBS_DATA } from "../data/verbsData";
import { PARTICLES_DATA } from "../data/particlesData";
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export function generateQuizQuestions(mode, count = 10) {
  const questions = [];
  if (mode === "katakana-to-romaji") {
    const pool = [
      ...KATAKANA_DATA.map((k) => ({
        prompt: k.char,
        answer: k.romaji,
        meaning: k.exampleMeaning || ""
      })),
      ...VOCAB_N5.filter((v) => v.isLoanword).map((k) => ({
        prompt: k.japanese,
        answer: k.romaji,
        meaning: `${k.indonesian} (asal: ${k.origin || ""})`
      }))
    ];
    const shuffledPool = shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
    selected.forEach((item, index) => {
      const distractorCandidates = pool.filter((p) => p.answer.toLowerCase() !== item.answer.toLowerCase()).map((p) => p.answer);
      const uniqueDistractors = Array.from(new Set(distractorCandidates));
      const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
      const options = shuffle([item.answer, ...chosenDistractors]);
      questions.push({
        id: `quiz-k2r-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
        prompt: item.prompt,
        promptType: "kana",
        correctAnswer: item.answer,
        options,
        mode,
        meaningIndo: item.meaning,
        audioPrompt: item.prompt
      });
    });
  } else if (mode === "romaji-to-katakana") {
    const pool = [
      ...KATAKANA_DATA.map((k) => ({
        prompt: k.romaji,
        answer: k.char,
        meaning: k.exampleMeaning || ""
      })),
      ...VOCAB_N5.filter((v) => v.isLoanword).map((k) => ({
        prompt: k.romaji,
        answer: k.japanese,
        meaning: `${k.indonesian} (asal: ${k.origin || ""})`
      }))
    ];
    const shuffledPool = shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
    selected.forEach((item, index) => {
      const distractorCandidates = pool.filter((p) => p.answer !== item.answer).map((p) => p.answer);
      const uniqueDistractors = Array.from(new Set(distractorCandidates));
      const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
      const options = shuffle([item.answer, ...chosenDistractors]);
      questions.push({
        id: `quiz-r2k-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
        prompt: item.prompt,
        promptType: "romaji",
        correctAnswer: item.answer,
        options,
        mode,
        meaningIndo: item.meaning,
        audioPrompt: item.answer
      });
    });
  } else if (mode === "hiragana-to-romaji") {
    const pool = [
      ...HIRAGANA_DATA.map((h) => ({
        prompt: h.char,
        answer: h.romaji,
        meaning: h.exampleMeaning || ""
      })),
      ...VOCAB_N5.map((h) => ({
        prompt: h.japanese,
        answer: h.romaji,
        meaning: h.indonesian
      }))
    ];
    const shuffledPool = shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
    selected.forEach((item, index) => {
      const distractorCandidates = pool.filter((p) => p.answer.toLowerCase() !== item.answer.toLowerCase()).map((p) => p.answer);
      const uniqueDistractors = Array.from(new Set(distractorCandidates));
      const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
      const options = shuffle([item.answer, ...chosenDistractors]);
      questions.push({
        id: `quiz-h2r-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
        prompt: item.prompt,
        promptType: "kana",
        correctAnswer: item.answer,
        options,
        mode,
        meaningIndo: item.meaning,
        audioPrompt: item.prompt
      });
    });
  } else if (mode === "n5-vocab" || mode === "n4-vocab" || mode === "n3-vocab" || mode === "n2-vocab" || mode === "n1-vocab") {
    const dataset = mode === "n5-vocab" ? VOCAB_N5 : mode === "n4-vocab" ? VOCAB_N4 : mode === "n3-vocab" ? VOCAB_N3 : mode === "n2-vocab" ? VOCAB_N2 : VOCAB_N1;
    const pool = dataset.map((v) => ({
      prompt: `${v.japanese} (${v.romaji})`,
      answer: v.indonesian,
      audio: v.japanese,
      details: v.category
    }));
    const shuffledPool = shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
    selected.forEach((item, index) => {
      const distractorCandidates = pool.filter((p) => p.answer.toLowerCase() !== item.answer.toLowerCase()).map((p) => p.answer);
      const uniqueDistractors = Array.from(new Set(distractorCandidates));
      const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
      const options = shuffle([item.answer, ...chosenDistractors]);
      questions.push({
        id: `quiz-${mode}-${Date.now()}-${index}`,
        prompt: item.prompt,
        promptType: "kana",
        correctAnswer: item.answer,
        options,
        mode,
        meaningIndo: item.details,
        audioPrompt: item.audio
      });
    });
  } else if (mode === "verbs") {
    const pool = VERBS_DATA.map((v) => ({
      prompt: `${v.dictionary} [${v.groupName}]`,
      answer: v.meaning,
      audio: v.dictionary,
      details: `Masu: ${v.masu} \xB7 Te: ${v.te}`
    }));
    const shuffledPool = shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
    selected.forEach((item, index) => {
      const distractorCandidates = pool.filter((p) => p.answer.toLowerCase() !== item.answer.toLowerCase()).map((p) => p.answer);
      const uniqueDistractors = Array.from(new Set(distractorCandidates));
      const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
      const options = shuffle([item.answer, ...chosenDistractors]);
      questions.push({
        id: `quiz-verbs-${Date.now()}-${index}`,
        prompt: item.prompt,
        promptType: "kana",
        correctAnswer: item.answer,
        options,
        mode,
        meaningIndo: item.details,
        audioPrompt: item.audio
      });
    });
  } else if (mode === "particles") {
    const questionsList = [];
    PARTICLES_DATA.forEach((p) => {
      p.examples.forEach((ex) => {
        const escaped = p.particle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\s*${escaped}\\s*`);
        if (regex.test(ex.japanese)) {
          const promptSentence = ex.japanese.replace(regex, " \u3010 ? \u3011 ");
          questionsList.push({
            sentence: `${promptSentence}
(${ex.indonesian})`,
            particle: p.particle,
            meaning: p.title
          });
        }
      });
    });
    const particleOptions = ["\u306F", "\u304C", "\u3092", "\u306B", "\u3067", "\u3078", "\u3068", "\u3082", "\u304B\u3089", "\u307E\u3067"];
    const shuffledList = shuffle(questionsList).slice(0, Math.min(count, questionsList.length));
    shuffledList.forEach((item, index) => {
      const distractors = shuffle(particleOptions.filter((po) => po !== item.particle)).slice(0, 3);
      const options = shuffle([item.particle, ...distractors]);
      questions.push({
        id: `quiz-particles-${Date.now()}-${index}`,
        prompt: item.sentence,
        promptType: "kana",
        correctAnswer: item.particle,
        options,
        mode,
        meaningIndo: item.meaning,
        audioPrompt: item.particle
      });
    });
  }
  return questions;
}
