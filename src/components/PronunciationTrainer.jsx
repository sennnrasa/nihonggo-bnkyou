import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  Volume2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  X,
  ThumbsUp,
  Award,
  ArrowRight,
  Info
} from "lucide-react";
import {
  isSpeechRecognitionSupported,
  evaluatePronunciation
} from "../utils/speechRecognition";
import { playJapaneseSpeech } from "../utils/audio";
export const PronunciationTrainer = ({
  targetJapanese,
  targetRomaji,
  targetMeaning,
  onSuccessMastered,
  onClose
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userAudioUrl, setUserAudioUrl] = useState(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingNativeAudio, setIsPlayingNativeAudio] = useState(false);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const userAudioPlayerRef = useRef(null);
  const hasSpeechSupport = isSpeechRecognitionSupported();
  const stopAllAudioCapture = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
      }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {
      }
      audioContextRef.current = null;
    }
    setIsListening(false);
    setVolumeLevel(0);
  }, []);
  useEffect(() => {
    stopAllAudioCapture();
    setEvaluation(null);
    setInterimTranscript("");
    setFinalTranscript("");
    setErrorMessage(null);
    setUserAudioUrl(null);
  }, [targetJapanese, targetRomaji, stopAllAudioCapture]);
  useEffect(() => {
    return () => {
      stopAllAudioCapture();
      if (userAudioUrl) {
        URL.revokeObjectURL(userAudioUrl);
      }
    };
  }, [stopAllAudioCapture, userAudioUrl]);
  const handleStartListening = async () => {
    stopAllAudioCapture();
    setErrorMessage(null);
    setEvaluation(null);
    setInterimTranscript("");
    setFinalTranscript("");
    audioChunksRef.current = [];
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 32;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            setVolumeLevel(Math.min(100, Math.round(average / 128 * 100)));
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err) {
        console.warn("AudioContext visualization not available:", err);
      }
      if (typeof MediaRecorder !== "undefined") {
        try {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          mediaRecorder.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const mimeType = mediaRecorder.mimeType || "audio/webm";
              const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
              const url = URL.createObjectURL(audioBlob);
              setUserAudioUrl(url);
            }
          };
          mediaRecorder.start(100);
        } catch (recorderErr) {
          console.warn("MediaRecorder error:", recorderErr);
        }
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setErrorMessage(
          "Browser Anda belum mendukung Web Speech Recognition otomatis. Disarankan menggunakan Google Chrome, Microsoft Edge, atau Safari terbaru."
        );
        setIsListening(true);
        return;
      }
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "ja-JP";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      let capturedText = "";
      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            capturedText += transcript;
          } else {
            interim += transcript;
          }
        }
        setInterimTranscript(interim);
        if (capturedText) {
          setFinalTranscript(capturedText);
        }
      };
      recognition.onerror = (event) => {
        console.warn("SpeechRecognition error:", event.error);
        if (event.error === "no-speech") {
          setErrorMessage("Tidak ada suara terdeteksi. Silakan coba lagi dan ucapkan lebih dekat ke mikrofon.");
        } else if (event.error === "not-allowed") {
          setErrorMessage("Izin mikrofon ditolak. Berikan izin mikrofon pada browser Anda untuk mencoba.");
        } else {
          setErrorMessage(`Terjadi kendala pengenalan suara (${event.error}).`);
        }
        stopAllAudioCapture();
      };
      recognition.onend = () => {
        stopAllAudioCapture();
        const textToEvaluate = capturedText.trim();
        if (textToEvaluate) {
          const result = evaluatePronunciation(textToEvaluate, targetJapanese, targetRomaji);
          setEvaluation(result);
        } else {
          setErrorMessage("Suara belum tertangkap jelas. Silakan klik tombol rekam dan ucapkan kembali.");
        }
      };
      recognition.start();
    } catch (err) {
      console.error("Failed to access microphone:", err);
      setErrorMessage(
        "Tidak dapat mengakses mikrofon. Pastikan mikrofon terpasang dan izin telah diberikan di browser."
      );
      stopAllAudioCapture();
    }
  };
  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        stopAllAudioCapture();
      }
    } else {
      stopAllAudioCapture();
    }
  };
  const handlePlayNativeAudio = async () => {
    setIsPlayingNativeAudio(true);
    await playJapaneseSpeech(targetJapanese, 0.85);
    setIsPlayingNativeAudio(false);
  };
  const handlePlayUserAudio = () => {
    if (!userAudioUrl) return;
    if (!userAudioPlayerRef.current) {
      const audio = new Audio(userAudioUrl);
      userAudioPlayerRef.current = audio;
      audio.onended = () => setIsPlayingUserAudio(false);
      audio.onerror = () => setIsPlayingUserAudio(false);
    }
    if (isPlayingUserAudio) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
      setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.src = userAudioUrl;
      userAudioPlayerRef.current.play();
      setIsPlayingUserAudio(true);
    }
  };
  return <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-stone-700/80 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-5 animate-in fade-in duration-300">
      {
    /* Header */
  }
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white">
              Tes Pelafalan Suara (Pronunciation Check)
            </h4>
            <p className="text-xs text-stone-400">
              Ucapkan kata ini ke mikrofon untuk evaluasi keakuratan pelafalan
            </p>
          </div>
        </div>

        {onClose && <button
    onClick={onClose}
    className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
    title="Tutup Tes Suara"
  >
            <X className="w-4 h-4" />
          </button>}
      </div>

      {
    /* Target Word Display Card */
  }
      <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Target Kata Jepang
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-['Noto_Sans_JP'] tracking-wide">
            {targetJapanese}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-rose-300">
            {targetRomaji} · <span className="text-stone-300 font-normal">{targetMeaning}</span>
          </div>
        </div>

        {
    /* Listen Native Reference Button */
  }
        <button
    onClick={handlePlayNativeAudio}
    disabled={isPlayingNativeAudio}
    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isPlayingNativeAudio ? "bg-rose-600 text-white border-rose-500 animate-pulse" : "bg-stone-700/80 hover:bg-stone-700 text-stone-200 border-stone-600"}`}
    title="Dengarkan contoh pengucapan penutur asli Jepang"
  >
          <Volume2 className="w-4 h-4 text-rose-400" />
          <span>{isPlayingNativeAudio ? "Memutar..." : "Dengar Contoh"}</span>
        </button>
      </div>

      {
    /* Recording Area / Live Microphone State */
  }
      <div className="text-center space-y-3 py-2">
        {isListening ? <div className="space-y-4">
            <div className="relative inline-flex items-center justify-center">
              {
    /* Outer pulsing ring based on microphone volume */
  }
              <div
    className="absolute w-24 h-24 rounded-full bg-rose-500/20 transition-all duration-75"
    style={{ transform: `scale(${1 + volumeLevel / 100})` }}
  />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 ring-4 ring-rose-400/40 animate-pulse">
                <Mic className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-rose-300 animate-pulse">
                Sedang Mendengarkan...
              </div>
              <p className="text-xs text-stone-400">
                Ucapkan: <strong className="text-white">"{targetJapanese}"</strong> ({targetRomaji})
              </p>
            </div>

            {
    /* Live Waveform Indicator Bars */
  }
            <div className="flex items-center justify-center gap-1 h-6">
              {[40, 70, 90, 60, 80, 50, 85, 45].map((baseHeight, idx) => <div
    key={idx}
    className="w-1.5 bg-rose-400 rounded-full transition-all duration-75"
    style={{
      height: `${Math.max(6, baseHeight * (volumeLevel + 20) / 120)}px`
    }}
  />)}
            </div>

            {
    /* Live Interim Transcript */
  }
            {(interimTranscript || finalTranscript) && <div className="text-xs text-amber-200 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 max-w-xs mx-auto font-['Noto_Sans_JP']">
                Terdeteksi: "{interimTranscript || finalTranscript}"
              </div>}

            <button
    onClick={handleStopListening}
    className="px-5 py-2.5 rounded-2xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
  >
              Selesai Bicara
            </button>
          </div> : <div className="flex flex-col items-center gap-3">
            <button
    onClick={handleStartListening}
    className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-rose-500/20"
  >
              <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Tekan untuk Mulai Bicara</span>
            </button>
            <p className="text-[11px] text-stone-400">
              Klik tombol, izinkan mikrofon, dan lafalkan kata dalam aksara Jepang
            </p>
          </div>}
      </div>

      {
    /* Error Message if any */
  }
      {errorMessage && <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-start gap-2.5 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>}

      {
    /* Evaluation & Feedback Results Card */
  }
      {evaluation && <div
    className={`rounded-2xl p-4 sm:p-5 border transition-all space-y-4 ${evaluation.status === "perfect" ? "bg-emerald-950/40 border-emerald-500/50" : evaluation.status === "great" ? "bg-teal-950/40 border-teal-500/50" : evaluation.status === "partial" ? "bg-amber-950/40 border-amber-500/50" : "bg-rose-950/40 border-rose-500/50"}`}
  >
          {
    /* Top Score & Status Row */
  }
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${evaluation.status === "perfect" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : evaluation.status === "great" ? "bg-teal-500 text-white shadow-md shadow-teal-500/30" : evaluation.status === "partial" ? "bg-amber-500 text-white" : "bg-rose-500 text-white"}`}
  >
                {evaluation.status === "perfect" ? <Award className="w-5 h-5" /> : evaluation.status === "great" ? <ThumbsUp className="w-5 h-5" /> : evaluation.status === "partial" ? <Sparkles className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
              </div>

              <div>
                <h5 className="font-bold text-sm sm:text-base text-white">
                  {evaluation.feedbackTitle}
                </h5>
                <p className="text-xs text-stone-300">{evaluation.feedbackDescription}</p>
              </div>
            </div>

            {
    /* Score Percentage Badge */
  }
            <div
    className={`px-3 py-1.5 rounded-xl font-black text-sm sm:text-base shrink-0 border ${evaluation.status === "perfect" ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40" : evaluation.status === "great" ? "bg-teal-500/20 text-teal-300 border-teal-400/40" : evaluation.status === "partial" ? "bg-amber-500/20 text-amber-300 border-amber-400/40" : "bg-rose-500/20 text-rose-300 border-rose-400/40"}`}
  >
              {evaluation.score}% Akurat
            </div>
          </div>

          {
    /* Visual Score Bar */
  }
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5">
              <div
    className={`h-full rounded-full transition-all duration-700 ${evaluation.status === "perfect" ? "bg-gradient-to-r from-emerald-500 to-green-400" : evaluation.status === "great" ? "bg-gradient-to-r from-teal-500 to-emerald-400" : evaluation.status === "partial" ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-rose-500 to-orange-400"}`}
    style={{ width: `${Math.max(5, evaluation.score)}%` }}
  />
            </div>
          </div>

          {
    /* Transcript Comparison */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                Suara Anda Terdengar
              </div>
              <div className="text-sm font-bold text-white font-['Noto_Sans_JP'] mt-0.5">
                "{evaluation.transcript}"
              </div>
            </div>
            <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800">
              <div className="text-[11px] text-stone-400 uppercase font-semibold">
                Target Seharusnya
              </div>
              <div className="text-sm font-bold text-rose-300 font-['Noto_Sans_JP'] mt-0.5">
                "{evaluation.target}" ({evaluation.romajiTarget})
              </div>
            </div>
          </div>

          {
    /* Audio Replay & Side-by-Side Comparison */
  }
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
            <div className="flex items-center gap-2">
              {userAudioUrl && <button
    onClick={handlePlayUserAudio}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isPlayingUserAudio ? "bg-rose-600 text-white border-rose-500" : "bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700"}`}
    title="Dengarkan kembali suara rekaman Anda"
  >
                  {isPlayingUserAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-rose-400" />}
                  <span>Dengar Suara Saya</span>
                </button>}

              <button
    onClick={handlePlayNativeAudio}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
    title="Dengarkan pelafalan penutur asli"
  >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Dengar Penutur Asli</span>
              </button>
            </div>

            {
    /* Actions: Retry or Mark Mastered */
  }
            <div className="flex items-center gap-2">
              <button
    onClick={handleStartListening}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
  >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>

              {evaluation.isCorrect && onSuccessMastered && <button
    onClick={onSuccessMastered}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
  >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kuasai & Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>}
            </div>
          </div>
        </div>}

      {
    /* Browser Speech Recognition Notice / Tip */
  }
      {!hasSpeechSupport && <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 text-xs text-stone-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Browser Anda menggunakan mode perekaman mikrofon dasar. Untuk deteksi kata otomatis terbaik, gunakan browser dengan Web Speech API bawaan seperti <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong>.
          </p>
        </div>}
    </div>;
};
