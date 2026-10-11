import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  RotateCcw,
  Zap,
  Copy,
  Check
} from "lucide-react";
import { playJapaneseSpeech } from "../utils/audio";
const SUGGESTED_PROMPTS = [
  "Jelaskan perbedaan partikel \u306F (wa) dan \u304C (ga) dengan contoh mudah",
  "Beri 3 contoh kalimat kosakata JLPT N3 beserta artinya",
  "Bagaimana cara membedakan kata kerja transitif (\u4ED6\u52D5\u8A5E) dan intransitif (\u81EA\u52D5\u8A5E)?",
  "Yuk latihan percakapan sederhana memesan makanan di restoran Jepang!",
  "Tips menghafal kanji N2 dan N1 agar tidak mudah lupa"
];
export const SenseiChatView = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Konnichiwa! (\u3053\u3093\u306B\u3061\u306F\uFF01) Saya **Nihongo Sensei** (\u65E5\u672C\u8A9E\u5148\u751F), tutor bahasa Jepang AI pribadi Anda. \u{1F338}\n\nAnda bisa bertanya apa saja mengenai:\n- Kosakata & Kanji (N5 hingga N1)\n- Tata Bahasa & Partikel (\u306F, \u304C, \u306B, \u3067, dll.)\n- Konjugasi Kata Kerja (Bentuk Te, Nai, Potensial, Pasif)\n- Latihan percakapan (Kaiwa) atau persiapan ujian JLPT.\n\nApa yang ingin kita pelajari hari ini? *Ganbarimashou!*",
      timestamp: /* @__PURE__ */ new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelSpeed, setModelSpeed] = useState("fast");
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: /* @__PURE__ */ new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    try {
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          message: messageText,
          model: modelSpeed === "fast" ? "gemini-3.1-flash-lite" : "gemini-3.8-flash"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghubungi AI Sensei");
      }
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Maaf, Sensei tidak dapat memproses jawaban.",
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: err.message
          ? `Gomen nasai (ごめんなさい), terjadi kendala: ${err.message}`
          : "Gomen nasai (ごめんなさい), terjadi sedikit kendala koneksi dengan server AI. Silakan coba kirim ulang pertanyaan Anda.",
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const handleSpeak = (text) => {
    playJapaneseSpeech(text);
  };
  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sesi percakapan baru telah dimulai! Silakan tanyakan materi bahasa Jepang apa pun yang ingin Anda pelajari.",
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  };
  return <div className="space-y-4 max-w-4xl mx-auto">
      {
    /* Header Banner */
  }
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30 text-xl font-bold">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                Nihongo Sensei (日本語先生)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Online & Siap Membantu
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Tutor AI Percakapan & Konsultasi Bahasa Jepang N5 – N1 (Powered by Gemini)
            </p>
          </div>
        </div>

        {
    /* Action Controls: Model Switcher & Reset */
  }
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/10 text-xs">
            <button
    onClick={() => setModelSpeed("standard")}
    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${modelSpeed === "standard" ? "bg-rose-600 text-white shadow-xs" : "text-stone-300 hover:text-white"}`}
    title="Menggunakan gemini-3.8-flash untuk respon komprehensif"
  >
              Standar
            </button>
            <button
    onClick={() => setModelSpeed("fast")}
    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${modelSpeed === "fast" ? "bg-amber-600 text-white shadow-xs" : "text-stone-300 hover:text-white"}`}
    title="Menggunakan gemini-3.1-flash-lite untuk respon ultra cepat"
  >
              <Zap className="w-3 h-3" />
              Cepat
            </button>
          </div>

          <button
    onClick={handleResetChat}
    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 border border-white/10 transition-colors cursor-pointer"
    title="Mulai Sesi Chat Baru"
  >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {
    /* Suggested Prompts Pills */
  }
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Ide Pertanyaan:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => <button
    key={idx}
    onClick={() => handleSendMessage(prompt)}
    className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-stone-200 dark:border-stone-700 hover:border-rose-200 dark:hover:border-rose-800 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-medium shrink-0 transition-all shadow-2xs cursor-pointer"
  >
            {prompt}
          </button>)}
      </div>

      {
    /* Chat Thread Container */
  }
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col h-[520px] transition-colors">
        {
    /* Messages List */
  }
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => <div
    key={msg.id}
    className={`flex gap-3 max-w-[88%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
  >
              {
    /* Avatar */
  }
              <div
    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${msg.role === "user" ? "bg-rose-600 text-white" : "bg-stone-900 dark:bg-stone-800 text-amber-300 border border-stone-800 dark:border-stone-700"}`}
  >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {
    /* Message Bubble */
  }
              <div
    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${msg.role === "user" ? "bg-rose-600 text-white rounded-tr-none shadow-xs" : "bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-tl-none shadow-2xs"}`}
  >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {
    /* Assistant Bubble Actions */
  }
                {msg.role === "assistant" && <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => handleSpeak(msg.content)}
    className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
    title="Dengarkan pengucapan (Web Speech API)"
  >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan</span>
                      </button>
                      <button
    onClick={() => handleCopy(msg.id, msg.content)}
    className="hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
    title="Salin pesan"
  >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === msg.id ? "Tersalin" : "Salin"}</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>}
              </div>
            </div>)}

          {
    /* Loading Indicator */
  }
          {isLoading && <div className="flex gap-3 mr-auto max-w-[80%] items-center">
              <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-stone-800 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 animate-pulse border border-stone-800 dark:border-stone-700">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-200" />
                </div>
                <span>Sensei sedang menyusun penjelasan untuk Anda...</span>
              </div>
            </div>}

          <div ref={messagesEndRef} />
        </div>

        {
    /* Input Form */
  }
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 rounded-b-3xl">
          <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSendMessage();
    }}
    className="flex items-center gap-2"
  >
            <textarea
    ref={inputRef}
    rows={1}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }}
    placeholder="Tanya arti kosakata, partikel, kanji, atau minta contoh kalimat..."
    className="flex-1 resize-none bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-stone-500 dark:placeholder:text-stone-400"
  />
            <button
    type="submit"
    disabled={!input.trim() || isLoading}
    className={`p-3 rounded-2xl font-bold transition-all shrink-0 cursor-pointer ${input.trim() && !isLoading ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30" : "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed"}`}
  >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 mt-2 px-1">
            <span>Tekan <strong>Enter</strong> untuk mengirim pesan</span>
            <span>Didukung model AI Gemini</span>
          </div>
        </div>
      </div>
    </div>;
};
