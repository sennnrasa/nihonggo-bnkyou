export const GRAMMAR_PATTERNS = [
  // =========================================================================
  // JLPT N5 POLA KALIMAT (Tata Bahasa Dasar)
  // =========================================================================
  {
    id: "g-n5-1",
    level: "N5",
    pattern: "\uFF5E\u306F\uFF5E\u3067\u3059",
    romaji: "~wa ~desu",
    meaning: "A adalah B (Pola Kalimat Dasar Penegasan/Predikat Nomina)",
    formation: "KB 1 (Topik) + \u306F + KB 2 (Predikat) + \u3067\u3059",
    explanation: 'Pola paling mendasar dalam bahasa Jepang untuk menyatakan identitas, nama, kebangsaan, profesi, atau kondisi. Partikel \u306F dibaca "wa".',
    category: "Kalimat Dasar & Penegasan",
    examples: [
      { japanese: "\u308F\u305F\u3057\u306F \u304C\u304F\u305B\u3044\u3067\u3059\u3002", romaji: "Watashi wa gakusei desu.", indonesian: "Saya adalah seorang siswa." },
      { japanese: "\u304B\u308C\u306F \u306B\u307B\u3093\u3058\u3093\u3067\u3059\u3002", romaji: "Kare wa nihonjin desu.", indonesian: "Dia adalah orang Jepang." },
      { japanese: "\u3053\u308C\u306F \u306B\u307B\u3093\u3054\u306E \u307B\u3093\u3067\u3059\u3002", romaji: "Kore wa nihongo no hon desu.", indonesian: "Ini adalah buku bahasa Jepang." }
    ]
  },
  {
    id: "g-n5-2",
    level: "N5",
    pattern: "\uFF5E\u3067\u306F\u3042\u308A\u307E\u305B\u3093 / \uFF5E\u3058\u3083\u3042\u308A\u307E\u305B\u3093",
    romaji: "~dewa arimasen / ~ja arimasen",
    meaning: "A bukan B (Bentuk Negatif Lampau/Kini)",
    formation: "KB + \u3067\u306F\u3042\u308A\u307E\u305B\u3093 (formal) / \u3058\u3083\u3042\u308A\u307E\u305B\u3093 (percakapan santai)",
    explanation: 'Bentuk sangkalan atau negatif dari "\uFF5E\u3067\u3059". Digunakan untuk menyangkal identitas, status, atau sifat benda.',
    category: "Kalimat Negatif",
    examples: [
      { japanese: "\u308F\u305F\u3057\u306F \u305B\u3093\u305B\u3044\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002", romaji: "Watashi wa sensei dewa arimasen.", indonesian: "Saya bukan seorang guru." },
      { japanese: "\u3053\u308C\u306F \u308F\u305F\u3057\u306E \u304B\u3055\u3058\u3083\u3042\u308A\u307E\u305B\u3093\u3002", romaji: "Kore wa watashi no kasa ja arimasen.", indonesian: "Ini bukan payung milik saya." }
    ]
  },
  {
    id: "g-n5-3",
    level: "N5",
    pattern: "\uFF5E\u3066\u304F\u3060\u3055\u3044",
    romaji: "~te kudasai",
    meaning: "Tolong / Silakan lakukan... (Permintaan Sopan)",
    formation: "KK [Bentuk Te] + \u304F\u3060\u3055\u3044",
    explanation: "Digunakan untuk meminta lawan bicara melakukan sesuatu secara sopan, memberikan instruksi di kelas, atau menawarkan bantuan ramah.",
    category: "Permintaan & Instruksi",
    examples: [
      { japanese: "\u3053\u3053\u306B \u306A\u307E\u3048\u3092 \u304B\u3044\u3066\u304F\u3060\u3055\u3044\u3002", romaji: "Koko ni namae o kaite kudasai.", indonesian: "Tolong tulis nama di sini." },
      { japanese: "\u3086\u3063\u304F\u308A \u306F\u306A\u3057\u3066\u304F\u3060\u3055\u3044\u3002", romaji: "Yukkuri hanashite kudasai.", indonesian: "Tolong berbicara secara pelan-pelan." },
      { japanese: "\u30C9\u30A2\u3092 \u3042\u3051\u3066\u304F\u3060\u3055\u3044\u3002", romaji: "Doa o akete kudasai.", indonesian: "Tolong buka pintunya." }
    ]
  },
  {
    id: "g-n5-4",
    level: "N5",
    pattern: "\uFF5E\u3066\u3082\u3044\u3044\u3067\u3059",
    romaji: "~te mo ii desu",
    meaning: "Boleh melakukan... / Diizinkan...",
    formation: "KK [Bentuk Te] + \u3082\u3044\u3044\u3067\u3059 (Bertanya izin: \uFF5E\u3066\u3082\u3044\u3044\u3067\u3059\u304B)",
    explanation: "Digunakan untuk memberikan izin atau meminta izin kepada lawan bicara untuk melakukan sesuatu.",
    category: "Izin & Aturan",
    examples: [
      { japanese: "\u3057\u3083\u3057\u3093\u3092 \u3068\u3063\u3066\u3082\u3044\u3044\u3067\u3059\u304B\u3002", romaji: "Shashin o totte mo ii desu ka.", indonesian: "Bolehkah saya mengambil foto?" },
      { japanese: "\u306F\u3044\u3001\u3053\u3053\u3067 \u305F\u3079\u3066\u3082\u3044\u3044\u3067\u3059\u3088\u3002", romaji: "Hai, koko de tabete mo ii desu yo.", indonesian: "Ya, boleh makan di sini kok." }
    ]
  },
  {
    id: "g-n5-5",
    level: "N5",
    pattern: "\uFF5E\u3066\u306F\u3044\u3051\u307E\u305B\u3093",
    romaji: "~te wa ikemasen",
    meaning: "Dilarang / Tidak boleh melakukan...",
    formation: "KK [Bentuk Te] + \u306F\u3044\u3051\u307E\u305B\u3093 (Percakapan sehari-hari: \uFF5E\u3066\u306F\u3060\u3081)",
    explanation: "Digunakan untuk menyatakan larangan tegas berdasarkan aturan, etika sosial, atau keselamatan.",
    category: "Larangan",
    examples: [
      { japanese: "\u3053\u3053\u3067 \u305F\u3070\u3053\u3092 \u3059\u3063\u3066\u306F\u3044\u3051\u307E\u305B\u3093\u3002", romaji: "Koko de tabako o sutte wa ikemasen.", indonesian: "Dilarang merokok di tempat ini." },
      { japanese: "\u30C6\u30B9\u30C8\u3061\u3085\u3046\u306B \u30B9\u30DE\u30DB\u3092 \u3064\u304B\u3063\u3066\u306F\u3044\u3051\u307E\u305B\u3093\u3002", romaji: "Tesuto-chuu ni sumaho o tsukatte wa ikemasen.", indonesian: "Dilarang menggunakan smartphone selama ujian." }
    ]
  },
  {
    id: "g-n5-6",
    level: "N5",
    pattern: "\uFF5E\u305F\u3044\u3067\u3059",
    romaji: "~tai desu",
    meaning: "Ingin / Mau melakukan...",
    formation: "KK [Bentuk Masu (buang masu)] + \u305F\u3044\u3067\u3059",
    explanation: "Menyatakan keinginan diri sendiri pembicara untuk melakukan suatu tindakan kata kerja. Partikel \u3092 sering bisa diganti menjadi \u304C.",
    category: "Keinginan & Cita-cita",
    examples: [
      { japanese: "\u306B\u307B\u3093\u3078 \u3044\u304D\u305F\u3044\u3067\u3059\u3002", romaji: "Nihon e ikitai desu.", indonesian: "Saya ingin pergi ke Jepang." },
      { japanese: "\u30E9\u30FC\u30E1\u30F3\u304C \u305F\u3079\u305F\u3044\u3067\u3059\u3002", romaji: "Raamen ga tabetai desu.", indonesian: "Saya ingin makan ramen." }
    ]
  },
  {
    id: "g-n5-7",
    level: "N5",
    pattern: "\uFF5E\u307E\u305B\u3093\u304B / \uFF5E\u307E\u3057\u3087\u3046",
    romaji: "~masen ka / ~mashou",
    meaning: "Maukah Anda...? / Mari kita... (Ajakan Sopan)",
    formation: "KK [Bentuk Masu (buang masu)] + \u307E\u305B\u3093\u304B / \u307E\u3057\u3087\u3046",
    explanation: "\uFF5E\u307E\u305B\u3093\u304B digunakan untuk mengajak atau menawarkan dengan sopan sembari memberi ruang bagi lawan bicara menolak. Sedangkan \uFF5E\u307E\u3057\u3087\u3046 adalah ajakan positif penuh semangat.",
    category: "Ajakan & Tawaran",
    examples: [
      { japanese: "\u3044\u3063\u3057\u3087\u306B \u30B3\u30FC\u30D2\u30FC\u3092 \u306E\u307F\u307E\u305B\u3093\u304B\u3002", romaji: "Issho ni koohii o nomimasen ka.", indonesian: "Maukah minum kopi bersama-sama?" },
      { japanese: "\u306F\u3044\u3001\u306E\u307F\u307E\u3057\u3087\u3046\uFF01", romaji: "Hai, nomimashou!", indonesian: "Ya, ayo kita minum!" }
    ]
  },
  {
    id: "g-n5-8",
    level: "N5",
    pattern: "\uFF5E\u304B\u3089\uFF5E\u307E\u3067",
    romaji: "~kara ~made",
    meaning: "Dari... Sampai... (Rentang Waktu / Tempat)",
    formation: "Waktu/Tempat 1 + \u304B\u3089 + Waktu/Tempat 2 + \u307E\u3067",
    explanation: "Menunjukkan titik awal keberangkatan/waktu kerja dan titik akhir tujuan/waktu selesai.",
    category: "Waktu & Tempat",
    examples: [
      { japanese: "\u304E\u3093\u3053\u3046\u306F \u304F\u3058\u304B\u3089 \u3054\u3058\u307E\u3067\u3067\u3059\u3002", romaji: "Ginkou wa kuji kara goji made desu.", indonesian: "Bank buka dari jam 9 sampai jam 5." },
      { japanese: "\u3068\u3046\u304D\u3087\u3046\u304B\u3089 \u304A\u304A\u3055\u304B\u307E\u3067 \u3057\u3093\u304B\u3093\u305B\u3093\u3067 \u3044\u304D\u307E\u3059\u3002", romaji: "Toukyou kara Oosaka made shinkansen de ikimasu.", indonesian: "Dari Tokyo sampai Osaka pergi menggunakan Shinkansen." }
    ]
  },
  // =========================================================================
  // JLPT N4 POLA KALIMAT (Tata Bahasa Menengah Bawah)
  // =========================================================================
  {
    id: "g-n4-1",
    level: "N4",
    pattern: "\uFF5E\u305F\u3053\u3068\u304C\u3042\u308B",
    romaji: "~ta koto ga aru",
    meaning: "Pernah berpengalaman melakukan...",
    formation: "KK [Bentuk Lampau / Bentuk Ta] + \u3053\u3068\u304C\u3042\u308B",
    explanation: "Digunakan untuk menceritakan pengalaman masa lalu yang pernah dilakukan minimal sekali dalam hidup. Bentuk negatifnya: \uFF5E\u305F\u3053\u3068\u304C\u306A\u3044 (belum pernah).",
    category: "Pengalaman",
    examples: [
      { japanese: "\u308F\u305F\u3057\u306F \u3075\u3058\u3055\u3093\u306B \u306E\u307C\u3063\u305F\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002", romaji: "Watashi wa Fujisan ni nobotta koto ga arimasu.", indonesian: "Saya pernah mendaki Gunung Fuji." },
      { japanese: "\u306A\u3063\u3068\u3046\u3092 \u305F\u3079\u305F\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u304B\u3002", romaji: "Nattou o tabeta koto ga arimasu ka.", indonesian: "Apakah Anda pernah makan natto?" }
    ]
  },
  {
    id: "g-n4-2",
    level: "N4",
    pattern: "\uFF5E\u306A\u3051\u308C\u3070\u306A\u3089\u306A\u3044",
    romaji: "~nakereba naranai",
    meaning: "Harus / Wajib melakukan...",
    formation: "KK [Bentuk Nai (ganti i jadi kereba)] + \u306A\u3089\u306A\u3044 / \u306A\u308A\u307E\u305B\u3093",
    explanation: "Menyatakan kewajiban atau keharusan mutlak yang timbul dari tugas, aturan, atau kebutuhan biologis/sosial.",
    category: "Keharusan & Kewajiban",
    examples: [
      { japanese: "\u3042\u3057\u305F \u3057\u3051\u3093\u304C \u3042\u308B\u306E\u3067\u3001\u3079\u3093\u304D\u3087\u3046\u3057\u306A\u3051\u308C\u3070\u306A\u308A\u307E\u305B\u3093\u3002", romaji: "Ashita shiken ga aru node, benkyou shinakereba narimasen.", indonesian: "Karena besok ada ujian, saya harus belajar." },
      { japanese: "\u304F\u3059\u308A\u3092 \u306E\u307E\u306A\u3051\u308C\u3070\u306A\u308A\u307E\u305B\u3093\u3002", romaji: "Kusuri o nomanakereba narimasen.", indonesian: "Saya harus meminum obat." }
    ]
  },
  {
    id: "g-n4-3",
    level: "N4",
    pattern: "\uFF5E\u306A\u304F\u3066\u3082\u3044\u3044",
    romaji: "~nakute mo ii",
    meaning: "Tidak harus / Tidak perlu melakukan...",
    formation: "KK [Bentuk Nai (ganti i jadi kute)] + \u3082\u3044\u3044",
    explanation: "Menyatakan bahwa suatu perbuatan tidak wajib dikerjakan dan tidak ada paksaan.",
    category: "Izin & Ketiadaan Keharusan",
    examples: [
      { japanese: "\u3042\u3057\u305F\u306F \u3084\u3059\u307F\u3060\u304B\u3089\u3001\u306F\u3084\u304F \u304A\u304D\u306A\u304F\u3066\u3082\u3044\u3044\u3067\u3059\u3002", romaji: "Ashita wa yasumi dakara, hayaku okinakute mo ii desu.", indonesian: "Karena besok hari libur, tidak perlu bangun pagi-pagi." },
      { japanese: "\u305C\u3093\u3076 \u305F\u3079\u306A\u304F\u3066\u3082\u3044\u3044\u3067\u3059\u3088\u3002", romaji: "Zenbu tabenakute mo ii desu yo.", indonesian: "Tidak harus dihabiskan semua kok." }
    ]
  },
  {
    id: "g-n4-4",
    level: "N4",
    pattern: "\uFF5E\u307B\u3046\u304C\u3044\u3044",
    romaji: "~hou ga ii",
    meaning: "Sebaiknya / Lebih baik... (Saran / Nasihat)",
    formation: "KK [Bentuk Ta] + \u307B\u3046\u304C\u3044\u3044 (Positif) / KK [Bentuk Nai] + \u307B\u3046\u304C\u3044\u3044 (Negatif)",
    explanation: "Digunakan untuk memberikan saran atau nasihat yang dinilai paling baik bagi lawan bicara.",
    category: "Nasihat & Saran",
    examples: [
      { japanese: "\u304B\u305C\u3092 \u3072\u3044\u305F\u306A\u3089\u3001\u3073\u3087\u3046\u3044\u3093\u3078 \u3044\u3063\u305F\u307B\u3046\u304C\u3044\u3044\u3067\u3059\u3002", romaji: "Kaze o hiita nara, byouin e itta hou ga ii desu.", indonesian: "Kalau masuk angin, sebaiknya pergi ke dokter/rumah sakit." },
      { japanese: "\u3088\u308B \u304A\u305D\u304F \u3042\u307E\u3044\u3082\u306E\u3092 \u305F\u3079\u306A\u3044\u307B\u3046\u304C\u3044\u3044\u3067\u3059\u3088\u3002", romaji: "Yoru osoku amai mono o tabenai hou ga ii desu yo.", indonesian: "Sebaiknya tidak makan makanan manis larut malam." }
    ]
  },
  {
    id: "g-n4-5",
    level: "N4",
    pattern: "\uFF5E\u3066\u3057\u307E\u3046",
    romaji: "~te shimau",
    meaning: "Telah tuntas dikerjakan / Tanpa sengaja terjadi (Penyesalan)",
    formation: "KK [Bentuk Te] + \u3057\u307E\u3046 / \u3057\u307E\u3044\u307E\u3057\u305F (Percakapan santai: \uFF5E\u3061\u3083\u3046 / \uFF5E\u3058\u3083\u3046)",
    explanation: "Memiliki 2 arti utama: (1) Suatu pekerjaan selesai total hingga tuntas; (2) Suatu kesalahan/kejadian buruk terjadi tanpa disengaja dan membawa penyesalan.",
    category: "Penyelesaian & Penyesalan",
    examples: [
      { japanese: "\u3060\u3044\u3058\u306A \u3055\u3044\u3075\u3092 \u304A\u3068\u3057\u3066\u3057\u307E\u3044\u307E\u3057\u305F\u3002", romaji: "Daijina saifu o otoshite shimaimashita.", indonesian: "Duh, dompet berharga saya terjatuh/hilang." },
      { japanese: "\u3057\u3085\u304F\u3060\u3044\u3092 \u305C\u3093\u3076 \u3084\u3063\u3066\u3057\u307E\u3044\u307E\u3057\u305F\u3002", romaji: "Shukudai o zenbu yatte shimaimashita.", indonesian: "PR-nya sudah saya selesaikan semuanya sampai tuntas." }
    ]
  },
  {
    id: "g-n4-6",
    level: "N4",
    pattern: "\uFF5E\u3064\u3082\u308A\u3067\u3059",
    romaji: "~tsumori desu",
    meaning: "Berniat / Berencana untuk...",
    formation: "KK [Bentuk Kamus / Kamus Negatif] + \u3064\u3082\u308A\u3067\u3059",
    explanation: "Menyatakan rencana atau niat kuat di dalam hati pembicara yang sudah diputuskan sebelumnya.",
    category: "Rencana & Niat",
    examples: [
      { japanese: "\u3089\u3044\u306D\u3093 \u306B\u307B\u3093\u306B \u308A\u3085\u3046\u304C\u304F\u3059\u308B \u3064\u3082\u308A\u3067\u3059\u3002", romaji: "Rainen Nihon ni ryuugaku suru tsumori desu.", indonesian: "Tahun depan saya berniat melanjutkan studi ke Jepang." },
      { japanese: "\u3053\u3093\u3070\u3093 \u30D1\u30FC\u30C6\u30A3\u30FC\u306B\u306F \u3044\u304B\u306A\u3044\u3064\u3082\u308A\u3067\u3059\u3002", romaji: "Konban paatii ni wa ikanai tsumori desu.", indonesian: "Malam ini saya berencana tidak datang ke pesta." }
    ]
  },
  {
    id: "g-n4-7",
    level: "N4",
    pattern: "\uFF5E\u305F\u308A\uFF5E\u305F\u308A\u3059\u308B",
    romaji: "~tari ~tari suru",
    meaning: "Kadang melakukan A, kadang melakukan B / Melakukan hal seperti A dan B",
    formation: "KK [Bentuk Ta] + \u308A + KK [Bentuk Ta] + \u308A + \u3059\u308B",
    explanation: "Menyebutkan beberapa contoh kegiatan yang dilakukan tanpa urutan waktu yang kaku.",
    category: "Daftar Kegiatan",
    examples: [
      { japanese: "\u304D\u3085\u3046\u3058\u3064\u306F \u307B\u3093\u3092 \u3088\u3093\u3060\u308A \u304A\u3093\u304C\u304F\u3092 \u304D\u3044\u305F\u308A\u3057\u307E\u3059\u3002", romaji: "Kyuujitsu wa hon o yondari ongaku o kiitari shimasu.", indonesian: "Saat hari libur saya membaca buku, mendengarkan musik, dan sebagainya." }
    ]
  },
  // =========================================================================
  // JLPT N3 POLA KALIMAT (Tata Bahasa Menengah)
  // =========================================================================
  {
    id: "g-n3-1",
    level: "N3",
    pattern: "\uFF5E\u306F\u305A\u3060",
    romaji: "~hazu da",
    meaning: "Seharusnya / Sudah semestinya pasti...",
    formation: "Bentuk Biasa (Futsuukei) + \u306F\u305A\u3060 / \u306F\u305A\u3067\u3059 (Kata Sifat Na + \u306A, Kata Benda + \u306E)",
    explanation: "Menyatakan keyakinan kuat dari pembicara berdasarkan logika, bukti nyata, atau jadwal yang telah disepakati.",
    category: "Kepastian & Dugaan Logis",
    examples: [
      { japanese: "\u304B\u308C\u306F \u3058\u3085\u3063\u3077\u3093\u307E\u3048\u306B \u3067\u305F\u304B\u3089\u3001\u3082\u3046 \u3064\u304F\u306F\u305A\u3067\u3059\u3002", romaji: "Kare wa juppun mae ni deta kara, mou tsuku hazu desu.", indonesian: "Karena dia berangkat 10 menit lalu, dia seharusnya sudah sampai." },
      { japanese: "\u3053\u306E\u3078\u3084\u306E \u30AB\u30AE\u306F \u3053\u3053\u306B\u3042\u308B\u306F\u305A\u3067\u3059\u3002", romaji: "Kono heya no kagi wa koko ni aru hazu desu.", indonesian: "Kunci ruangan ini semestinya ada di sini." }
    ]
  },
  {
    id: "g-n3-2",
    level: "N3",
    pattern: "\uFF5E\u308F\u3051\u3067\u306F\u306A\u3044",
    romaji: "~wake dewa nai",
    meaning: "Bukan berarti / Tidak selalu berarti bahwa...",
    formation: "Bentuk Biasa (Futsuukei) + \u308F\u3051\u3067\u306F\u306A\u3044 (Kata Sifat Na + \u306A)",
    explanation: "Digunakan untuk menyangkal generalisasi sebagian, menjelaskan bahwa situasi sebenarnya tidak seekstrem dugaan orang.",
    category: "Penyangkalan Nuansa",
    examples: [
      { japanese: "\u306B\u307B\u3093\u308A\u3087\u3046\u308A\u304C \u304D\u3089\u3044\u306A\u308F\u3051\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u304C\u3001\u306A\u3063\u3068\u3046\u306F \u306B\u304C\u3066\u3067\u3059\u3002", romaji: "Nihon ryouri ga kiraina wake dewa arimasen ga, nattou wa nigate desu.", indonesian: "Bukan berarti saya membenci masakan Jepang, tapi saya kurang bisa makan natto." },
      { japanese: "\u304A\u304B\u306D\u304C \u3042\u308C\u3070 \u3057\u3042\u308F\u305B\u306B\u306A\u308C\u308B\u308F\u3051\u3067\u306F\u306A\u3044\u3002", romaji: "Okane ga areba shiawase ni nareru wake dewa nai.", indonesian: "Punya banyak uang bukan berarti otomatis membuat bahagia." }
    ]
  },
  {
    id: "g-n3-3",
    level: "N3",
    pattern: "\uFF5E\u3088\u3046\u306B\u3059\u308B",
    romaji: "~you ni suru",
    meaning: "Berusaha untuk selalu / Membiasakan diri untuk...",
    formation: "KK [Bentuk Kamus / Bentuk Nai] + \u3088\u3046\u306B\u3059\u308B",
    explanation: "Menyatakan usaha sadar dan kebiasaan terus-menerus untuk mewujudkan atau menghindari suatu perilaku.",
    category: "Usaha & Kebiasaan",
    examples: [
      { japanese: "\u307E\u3044\u306B\u3061 \u306B\u307B\u3093\u3054\u306E \u305F\u3093\u3054\u3092 \u3058\u3085\u3063\u3053 \u304A\u307C\u3048\u308B\u3088\u3046\u306B\u3057\u3066\u3044\u307E\u3059\u3002", romaji: "Mainichi nihongo no tango o jukko oboeru you ni shiteimasu.", indonesian: "Saya berusaha membiasakan diri menghafal 10 kosakata bahasa Jepang setiap hari." },
      { japanese: "\u3042\u307E\u3044\u3082\u306E\u3092 \u306E\u307F\u3059\u304E\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u3044\u307E\u3059\u3002", romaji: "Amai mono o nomisuginai you ni shiteimasu.", indonesian: "Saya berusaha agar tidak terlalu banyak minum minuman manis." }
    ]
  },
  {
    id: "g-n3-4",
    level: "N3",
    pattern: "\uFF5E\u3046\u3061\u306B",
    romaji: "~uchi ni",
    meaning: "Selagi / Mumpung masih... / Tanpa disadari selama...",
    formation: "KK [Bentuk Kamus / Te iru / Nai] + \u3046\u3061\u306B / Kata Sifat + \u3046\u3061\u306B / KB + \u306E\u3046\u3061\u306B",
    explanation: "Menyatakan melakukan suatu hal selagi kondisi masih mendukung sebelum keadaan berubah.",
    category: "Waktu & Peluang",
    examples: [
      { japanese: "\u30B9\u30FC\u30D7\u304C \u3042\u3064\u3044\u3046\u3061\u306B\u3001\u3069\u3046\u305E \u3081\u3057\u3042\u304C\u3063\u3066\u304F\u3060\u3055\u3044\u3002", romaji: "Suupu ga atsui uchi ni, douzo meshiagatte kudasai.", indonesian: "Mumpung supnya masih panas, silakan dinikmati." },
      { japanese: "\u308F\u304B\u3044\u3046\u3061\u306B\u3001\u3044\u308D\u3044\u308D\u306A \u3051\u3044\u3051\u3093\u3092\u3057\u305F\u307B\u3046\u304C\u3044\u3044\u3002", romaji: "Wakai uchi ni, iroirona keiken o shita hou ga ii.", indonesian: "Selagi masih muda, sebaiknya mengumpulkan banyak pengalaman hidup." }
    ]
  },
  {
    id: "g-n3-5",
    level: "N3",
    pattern: "\uFF5E\u306B\u3068\u3063\u3066",
    romaji: "~ni totte",
    meaning: "Bagi... / Menurut pandangan pihak...",
    formation: "Kata Benda (Orang / Lembaga) + \u306B\u3068\u3063\u3066",
    explanation: "Menyatakan sudut pandang, penilaian, atau signifikansi sesuatu dari sudut pihak tertentu.",
    category: "Sudut Pandang",
    examples: [
      { japanese: "\u3059\u3044\u307F\u3093\u306F \u306B\u3093\u3052\u3093\u306B\u3068\u3063\u3066\u3001\u3068\u3066\u3082 \u305F\u3044\u305B\u3064\u306A\u3053\u3068\u3067\u3059\u3002", romaji: "Suimin wa ningen ni totte, totemo taisetsuna koto desu.", indonesian: "Tidur adalah hal yang sangat krusial bagi manusia." },
      { japanese: "\u3053\u308C\u306F \u304C\u304F\u305B\u3044\u305F\u3061\u306B\u3068\u3063\u3066 \u304B\u3051\u304C\u3048\u306E\u306A\u3044 \u304A\u3082\u3044\u3067\u306B\u306A\u308A\u307E\u3059\u3002", romaji: "Kore wa gakusei-tachi ni totte kakegae no nai omoide ni narimasu.", indonesian: "Bagi para siswa, ini menjadi kenangan yang tak tergantikan." }
    ]
  },
  // =========================================================================
  // JLPT N2 POLA KALIMAT (Tata Bahasa Tingkat Lanjut)
  // =========================================================================
  {
    id: "g-n2-1",
    level: "N2",
    pattern: "\uFF5E\u308F\u3051\u306B\u306F\u3044\u304B\u306A\u3044",
    romaji: "~wake ni wa ikanai",
    meaning: "Tidak mungkin / Tidak pantas secara moral atau sosial untuk melakukan...",
    formation: "KK [Bentuk Kamus] + \u308F\u3051\u306B\u306F\u3044\u304B\u306A\u3044",
    explanation: "Pembicara memiliki keinginan atau dorongan, namun norma sosial, tanggung jawab, etika moral, atau rasa sungkan melarangnya untuk melakukannya.",
    category: "Etika & Batasan Sosial",
    examples: [
      { japanese: "\u3042\u3057\u305F \u3060\u3044\u3058\u306A \u3057\u3051\u3093\u304C\u3042\u308B\u304B\u3089\u3001\u304D\u3087\u3046\u306F \u3042\u305D\u3073\u306B\u3044\u304F\u308F\u3051\u306B\u306F\u3044\u304B\u306A\u3044\u3002", romaji: "Ashita daijina shiken ga aru kara, kyou wa asobi ni iku wake ni wa ikanai.", indonesian: "Karena besok ada ujian penentu penting, hari ini saya tidak mungkin bisa pergi bermain." },
      { japanese: "\u305B\u3093\u305B\u3044\u306B \u305F\u306E\u307E\u308C\u305F\u306E\u3067\u3001\u3053\u3068\u308F\u308B\u308F\u3051\u306B\u306F\u3044\u304D\u307E\u305B\u3093\u3002", romaji: "Sensei ni tanomareta node, kotowaru wake ni wa ikimasen.", indonesian: "Karena guru yang meminta tolong, tidak etis bagi saya untuk menolaknya." }
    ]
  },
  {
    id: "g-n2-2",
    level: "N2",
    pattern: "\uFF5E\u306B\u9055\u3044\u306A\u3044",
    romaji: "~ni chigainai",
    meaning: "Pasti / Tidak diragukan lagi bahwa...",
    formation: "Bentuk Biasa (Futsuukei) + \u306B\u9055\u3044\u306A\u3044 (Kata Benda & Kata Sifat Na langsung)",
    explanation: "Keyakinan subjektif yang luar biasa kuat dari pembicara bahwa suatu hal pasti benar terjadi.",
    category: "Keyakinan Mutlak",
    examples: [
      { japanese: "\u3053\u308C\u3060\u3051 \u308C\u3093\u3057\u3085\u3046\u3057\u305F\u306E\u3060\u304B\u3089\u3001\u3053\u3093\u3069\u3053\u305D \u3054\u3046\u304B\u304F\u3059\u308B\u306B\u3061\u304C\u3044\u306A\u3044\u3002", romaji: "Koredake renshuu shita no dakara, kondo koso goukaku suru ni chigainai.", indonesian: "Karena sudah berlatih sekeras ini, kali ini pasti akan lulus tanpa ragu." },
      { japanese: "\u3042\u3093\u306A\u306B \u3048\u304C\u304A\u306A\u306E\u3060\u304B\u3089\u3001\u3088\u3044\u3057\u3089\u305B\u304C \u3068\u3069\u3044\u305F\u306B\u3061\u304C\u3044\u306A\u3044\u3002", romaji: "Anna ni egao na no dakara, yoi shirase ga todoita ni chigainai.", indonesian: "Melihat senyum lebarnya seperti itu, berita gembira pasti sudah sampai." }
    ]
  },
  {
    id: "g-n2-3",
    level: "N2",
    pattern: "\uFF5E\u3056\u308B\u3092\u5F97\u306A\u3044",
    romaji: "~zaru o enai",
    meaning: "Mau tidak mau terpaksa harus... (Tidak ada pilihan lain)",
    formation: "KK [Bentuk Nai (buang nai)] + \u3056\u308B\u3092\u5F97\u306A\u3044 (Catatan khusus: \u3059\u308B menjadi \u305B\u3056\u308B\u3092\u5F97\u306A\u3044)",
    explanation: "Menyatakan keterpaksaan melakukan sesuatu meskipun sebenarnya tidak diinginkan karena kondisi darurat mendesak.",
    category: "Keterpaksaan Logis",
    examples: [
      { japanese: "\u305F\u3044\u3075\u3046\u304C \u3061\u304B\u3065\u3044\u3066\u3044\u308B\u305F\u3081\u3001\u30A4\u30D9\u30F3\u30C8\u3092 \u3061\u3085\u3046\u3057\u305B\u3056\u308B\u3092\u3048\u306A\u3044\u3002", romaji: "Taifuu ga chikazuiteiru tame, ibento o chuushi sezaru o enai.", indonesian: "Akibat angin topan mendekat, acara terpaksa mau tidak mau harus dibatalkan." },
      { japanese: "\u3057\u3087\u3046\u3053\u304C \u305D\u308D\u3063\u3066\u3044\u308B\u3044\u3058\u3087\u3046\u3001\u304B\u308C\u306E \u305B\u304D\u306B\u3093\u3092 \u307F\u3068\u3081\u3056\u308B\u3092\u3048\u306A\u3044\u3002", romaji: "Shouko ga sorotteiru ijou, kare no sekinin o mitomezaru o enai.", indonesian: "Mengingat bukti-bukti sudah lengkap, mau tidak mau harus mengakui kesalahannya." }
    ]
  },
  {
    id: "g-n2-4",
    level: "N2",
    pattern: "\uFF5E\u3092\u5951\u6A5F\u306B / \uFF5E\u3092\u304D\u3063\u304B\u3051\u306B",
    romaji: "~o keiki ni / ~o kikkake ni",
    meaning: "Bermula dari... / Mengambil momentum dari peristiwa...",
    formation: "Kata Benda + \u3092\u5951\u6A5F\u306B (Formal/Bisnis) / \u3092\u304D\u3063\u304B\u3051\u306B (Sehari-hari)",
    explanation: "Menyatakan suatu peristiwa atau momen yang menjadi pemicu titik balik terjadinya perubahan besar.",
    category: "Pemicu & Momentum",
    examples: [
      { japanese: "\u306B\u307B\u3093\u306E \u30A2\u30CB\u30E1\u3092 \u307F\u305F\u3053\u3068\u3092\u304D\u3063\u304B\u3051\u306B\u3001\u306B\u307B\u3093\u3054\u306E \u3079\u3093\u304D\u3087\u3046\u3092 \u306F\u3058\u3081\u307E\u3057\u305F\u3002", romaji: "Nihon no anime o mita koto o kikkake ni, nihongo no benkyou o hajimemashita.", indonesian: "Bermula dari menonton anime Jepang, saya mulai giat belajar bahasa Jepang." },
      { japanese: "\u3057\u3093\u305B\u3044\u3072\u3093\u306E \u306F\u3064\u3070\u3044\u3092 \u3051\u3044\u304D\u306B\u3001\u304B\u3044\u3057\u3083\u306E \u3046\u308A\u3042\u3052\u304C \u304D\u3085\u3046\u305E\u3046\u3057\u305F\u3002", romaji: "Shinseihin no hatsubai o keiki ni, kaisha no uriage ga kyuuzou shita.", indonesian: "Mengambil momentum peluncuran produk baru, omzet perusahaan melejit drastis." }
    ]
  },
  // =========================================================================
  // JLPT N1 POLA KALIMAT (Tata Bahasa Tingkat Mahir / Tertinggi)
  // =========================================================================
  {
    id: "g-n1-1",
    level: "N1",
    pattern: "\uFF5E\u6975\u307E\u308A\u306A\u3044 / \uFF5E\u6975\u307E\u308B",
    romaji: "~kiwamarinai / ~kiwamaru",
    meaning: "Sangat amat / Luar biasa tiada taranya (Tingkat Paling Ekstrem)",
    formation: "Kata Sifat Na (batang kata) + \u6975\u307E\u308A\u306A\u3044 / \u6975\u307E\u308B",
    explanation: "Menyatakan derajat suatu keadaan atau emosi yang telah mencapai puncak batas tertinggi, biasanya dipakai dalam karya sastra atau pidato berbobot tinggi.",
    category: "Derajat Tertinggi",
    examples: [
      { japanese: "\u305F\u3044\u305B\u3064\u306A \u304B\u3044\u304E\u306B \u3080\u3060\u3093\u3051\u3063\u304D\u3093\u3059\u308B\u3068\u306F\u3001\u3075\u307E\u3058\u3081 \u304D\u308F\u307E\u308A\u306A\u3044\u3002", romaji: "Taisetsuna kaigi ni mudan kekkin suru to wa, fumajime kiwamarinai.", indonesian: "Membolos dari rapat sepenting itu tanpa izin adalah tindakan yang luar biasa tidak bertanggung jawab." },
      { japanese: "\u3053\u306E\u3088\u3046\u306A \u6804\u8A89\u3042\u308B \u8CDE\u3092 \u3044\u305F\u3060\u304D\u3001\u611F\u7121\u91CF \u6975\u307E\u308A\u307E\u3059\u3002", romaji: "Kono youna eiyo aru shou o itadaki, kanmuryou kiwamarimasu.", indonesian: "Menerima penghargaan terhormat ini, rasa haru saya sungguh tak terlukiskan tingginya." }
    ]
  },
  {
    id: "g-n1-2",
    level: "N1",
    pattern: "\uFF5E\u3092\u76AE\u5207\u308A\u306B (\u3057\u3066)",
    romaji: "~o kawakiri ni (shite)",
    meaning: "Diawali dengan... / Dimulai dari pelopor pertama lalu menyebar luas...",
    formation: "Kata Benda + \u3092\u76AE\u5207\u308A\u306B",
    explanation: "Menunjukkan satu tindakan awal yang bertindak sebagai pemantik rangkaian kesuksesan atau rentetan kegiatan berikutnya secara berantai.",
    category: "Rentetan & Pelopor",
    examples: [
      { japanese: "\u3068\u3046\u304D\u3087\u3046\u3067\u306E \u3053\u3046\u3048\u3093\u3092 \u304B\u308F\u304D\u308A\u306B\u3001\u305C\u3093\u3053\u304F \u30C4\u30A2\u30FC\u304C \u30B9\u30BF\u30FC\u30C8\u3057\u307E\u3059\u3002", romaji: "Toukyou de no kouen o kawakiri ni, zenkoku tsuaa ga sutaato shimasu.", indonesian: "Diawali dengan konser akbar di Tokyo, tur nasional ke berbagai penjuru kota akan resmi dimulai." }
    ]
  },
  {
    id: "g-n1-3",
    level: "N1",
    pattern: "\uFF5E\u305F\u308B\u3082\u306E",
    romaji: "~taru mono",
    meaning: "Sebagai orang yang berstatus... (Wajib menjunjung etika dan kehormatan)",
    formation: "Kata Benda (Profesi / Jabatan Terhormat) + \u305F\u308B\u3082\u306E",
    explanation: "Dipakai untuk menegaskan integritas, tanggung jawab etis, dan perilaku yang pantas diemban oleh seseorang berdasarkan profesi atau status kehormatan yang ia sandang.",
    category: "Integritas & Status Etis",
    examples: [
      { japanese: "\u3044\u3057\u3083\u305F\u308B\u3082\u306E\u3001\u3069\u3093\u306A\u3068\u304D\u3067\u3082 \u304B\u3093\u3058\u3083\u306E \u3044\u306E\u3061\u3092 \u3055\u3044\u3086\u3046\u305B\u3093\u3059\u3079\u304D\u3060\u3002", romaji: "Isha taru mono, donna toki demo kanja no inochi o saiyuusen subeki da.", indonesian: "Sebagai seorang dokter terhormat, keselamatan jiwa pasien wajib senantiasa menjadi prioritas utama." },
      { japanese: "\u30EA\u30FC\u30C0\u30FC\u305F\u308B\u3082\u306E\u306F\u3001\u3064\u306D\u306B \u51B7\u9759\u306A \u5224\u65AD\u529B\u304C \u6C42\u3081\u3089\u308C\u308B\u3002", romaji: "Riidaa taru mono wa, tsuneni reiseina handanryoku ga motomerareru.", indonesian: "Sebagai seorang pemimpin sejati, senantiasa dituntut ketenangan dalam mengambil keputusan bijak." }
    ]
  },
  {
    id: "g-n1-4",
    level: "N1",
    pattern: "\uFF5E\u4F59\u5100\u306A\u304F\u3055\u308C\u308B / \uFF5E\u4F59\u5100\u306A\u304F\u3055\u305B\u308B",
    romaji: "~yogi naku sareru / ~yogi naku saseru",
    meaning: "Terpaksa tak terelakkan menghadapi situasi sulit...",
    formation: "Kata Benda + \u3092\u4F59\u5100\u306A\u304F\u3055\u308C\u308B / Kata Kerja + \u3053\u3068\u3092\u4F59\u5100\u306A\u304F\u3055\u308C\u308B",
    explanation: "Menyatakan bahwa keadaan luar yang tak terhindarkan (bencana alam, krisis ekonomi global, regulasi baru) memaksa pihak terkait untuk mengubah rencana secara drastis.",
    category: "Keterpaksaan Fatal / Bencana",
    examples: [
      { japanese: "\u3075\u3051\u3044\u304D\u306E \u3048\u3044\u304D\u3087\u3046\u306B\u3088\u308A\u3001\u3053\u3046\u3058\u3087\u3046\u306E \u3078\u3044\u3055\u3044\u3092 \u3088\u304E\u306A\u304F\u3055\u308C\u305F\u3002", romaji: "Fukeiki no eikyou ni yori, koujou no heisai o yogi naku sareta.", indonesian: "Akibat dampak resesi ekonomi yang memburuk, penutupan pabrik tak terelakkan lagi." }
    ]
  },
  {
    id: "g-n1-5",
    level: "N1",
    pattern: "\uFF5E\u306A\u3089\u3067\u306F\u306E",
    romaji: "~naredewa no",
    meaning: "Kekhasan yang hanya dimiliki oleh... / Keistimewaan unik dari...",
    formation: "Kata Benda + \u306A\u3089\u3067\u306F\u306E + Kata Benda",
    explanation: "Menyatakan keistimewaan, kualitas unggul, atau keunikan autentik yang hanya bisa dijumpai pada subjek tersebut dan mustahil ditiru pihak lain.",
    category: "Keistimewaan Unik",
    examples: [
      { japanese: "\u3053\u308C\u306F \u304D\u3087\u3046\u3068\u306A\u3089\u3067\u306F\u306E \u308C\u304D\u3057\u3042\u308B \u3051\u3057\u304D\u3067\u3059\u3002", romaji: "Kore wa Kyouto naredewa no rekishi aru keshiki desu.", indonesian: "Ini adalah pemandangan sarat sejarah bernilai tinggi yang hanya bisa dirasakan di Kyoto." }
    ]
  }
];
