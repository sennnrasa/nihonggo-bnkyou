let cachedVoice = null;
let isVoicesInitialized = false;
export function isSpeechSynthesisSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}
export function cleanJapaneseForSpeech(text) {
  if (!text) return "";
  let cleaned = text.split("/")[0].trim();
  cleaned = cleaned.replace(/\([^)]*\)/g, "").replace(/（[^）]*）/g, "").trim();
  return cleaned || text.trim();
}
function findBestJapaneseVoice() {
  if (!isSpeechSynthesisSupported()) {
    return null;
  }
  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      return null;
    }
    const premiumJaVoice = voices.find(
      (v) => (v.lang.toLowerCase() === "ja-jp" || v.lang.toLowerCase() === "ja_jp") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium") || v.name.includes("Kyoko") || v.name.includes("Otoya") || v.name.includes("Nanami") || v.name.includes("Sayaka"))
    );
    if (premiumJaVoice) return premiumJaVoice;
    const exactJaVoice = voices.find(
      (v) => v.lang.toLowerCase() === "ja-jp" || v.lang.toLowerCase() === "ja_jp"
    );
    if (exactJaVoice) return exactJaVoice;
    const anyJaVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ja"));
    if (anyJaVoice) return anyJaVoice;
    return null;
  } catch {
    return null;
  }
}
export function getJapaneseVoice() {
  if (cachedVoice) return cachedVoice;
  cachedVoice = findBestJapaneseVoice();
  return cachedVoice;
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = findBestJapaneseVoice();
      isVoicesInitialized = true;
    };
    if (!isVoicesInitialized) {
      cachedVoice = findBestJapaneseVoice();
    }
  } catch {
  }
}
export function stopJapaneseSpeech() {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
    }
  }
}
export function playJapaneseSpeech(text, rate = 0.85, pitch = 1) {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const speechText = cleanJapaneseForSpeech(text);
      if (!speechText) {
        resolve(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "ja-JP";
      utterance.rate = rate;
      utterance.pitch = pitch;
      const voice = getJapaneseVoice();
      if (voice) {
        utterance.voice = voice;
      }
      let hasFinished = false;
      const safetyTimer = setTimeout(() => {
        if (!hasFinished) {
          hasFinished = true;
          resolve(true);
        }
      }, 6e3);
      utterance.onend = () => {
        clearTimeout(safetyTimer);
        if (!hasFinished) {
          hasFinished = true;
          resolve(true);
        }
      };
      utterance.onerror = (event) => {
        clearTimeout(safetyTimer);
        if (!hasFinished) {
          hasFinished = true;
          const isNormalCancel = event.error === "canceled" || event.error === "interrupted";
          resolve(isNormalCancel);
        }
      };
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      resolve(false);
    }
  });
}
