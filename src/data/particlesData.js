export const PARTICLES_DATA = [
  {
    id: "p-wa",
    particle: "\u306F",
    romaji: "wa",
    title: "Penanda Topik Utama (Topic Marker)",
    functions: [
      "Menandai topik kalimat atau subjek yang sedang dibicarakan.",
      "Dapat digunakan untuk memberikan penekanan atau perbandingan kontras.",
      'Meskipun ditulis huruf "ha" (\u306F), dibaca sebagai "wa" saat berfungsi sebagai partikel.'
    ],
    rules: "[Topik/Subjek] + \u306F + [Keterangan/Predikat]",
    examples: [
      {
        japanese: "\u308F\u305F\u3057\u306F \u304C\u304F\u305B\u3044\u3067\u3059\u3002",
        romaji: "Watashi wa gakusei desu.",
        indonesian: "Saya adalah seorang siswa.",
        note: 'Menandai bahwa "watashi" (saya) adalah topik yang sedang dibicarakan.'
      },
      {
        japanese: "\u304D\u3087\u3046\u306F \u3044\u3044\u3066\u3093\u304D\u3067\u3059\u306D\u3002",
        romaji: "Kyou wa ii tenki desu ne.",
        indonesian: "Hari ini cuacanya bagus ya.",
        note: 'Menandai "kyou" (hari ini) sebagai topik.'
      },
      {
        japanese: "\u304A\u3061\u3083\u306F \u306E\u307F\u307E\u3059\u304C\u3001\u30B3\u30FC\u30D2\u30FC\u306F \u306E\u307F\u307E\u305B\u3093\u3002",
        romaji: "Ocha wa nomimasu ga, koohii wa nomimasen.",
        indonesian: "Kalau teh saya minum, tetapi kalau kopi saya tidak minum.",
        note: "Fungsi kontras perbandingan antara dua hal."
      }
    ],
    comparisons: {
      with: "\u304C (ga)",
      explanation: "\u306F (wa) menekankan apa yang terjadi pada topik (informasi setelah partikel), sedangkan \u304C (ga) menekankan subjek itu sendiri (siapa atau apa yang melakukan)."
    }
  },
  {
    id: "p-ga",
    particle: "\u304C",
    romaji: "ga",
    title: "Penanda Subjek Spesifik / Keberadaan / Sifat",
    functions: [
      "Menandai subjek spesifik pelaku tindakan yang baru diperkenalkan.",
      "Digunakan bersama kata sifat atau kata yang menyatakan kesukaan/kemampuan (suki, kirai, jouzu, heta).",
      "Digunakan untuk menyatakan keberadaan benda/makhluk dengan kata kerja \u3042\u308A\u307E\u3059 (arimasu) dan \u3044\u307E\u3059 (imasu)."
    ],
    rules: "[Subjek Spesifik] + \u304C + [Kata Kerja/Kata Sifat]",
    examples: [
      {
        japanese: "\u3060\u308C\u304C \u304D\u307E\u3057\u305F\u304B\u3002",
        romaji: "Dare ga kimashita ka.",
        indonesian: "Siapa yang datang?",
        note: 'Kata tanya "dare" selalu diikuti partikel \u304C (ga).'
      },
      {
        japanese: "\u308F\u305F\u3057\u306F \u306D\u3053\u304C \u3059\u304D\u3067\u3059\u3002",
        romaji: "Watashi wa neko ga suki desu.",
        indonesian: "Saya suka kucing.",
        note: "Objek kesukaan (neko) ditandai dengan \u304C (ga)."
      },
      {
        japanese: "\u3064\u304F\u3048\u306E \u3046\u3048\u306B \u307B\u3093\u304C \u3042\u308A\u307E\u3059\u3002",
        romaji: "Tsukue no ue ni hon ga arimasu.",
        indonesian: "Di atas meja ada buku.",
        note: "Menyatakan keberadaan benda mati (hon) dengan \u3042\u308A\u307E\u3059."
      }
    ],
    comparisons: {
      with: "\u306F (wa)",
      explanation: 'Dalam kalimat tanya "Siapa/Apa?", gunakan \u304C (ga) setelah kata tanya: \u3060\u308C\u304C (dare ga), \u306A\u306B\u304C (nani ga).'
    }
  },
  {
    id: "p-o",
    particle: "\u3092",
    romaji: "o / wo",
    title: "Penanda Objek Penderita (Direct Object)",
    functions: [
      "Menandai objek langsung yang dikenai tindakan kata kerja transitif.",
      "Dapat menandai ruang atau jalur yang dilintasi/dilewati (jalan, jembatan, langit).",
      'Meskipun ditulis "wo" (\u3092), dilafalkan sebagai "o" dalam percakapan standar.'
    ],
    rules: "[Objek Penderita] + \u3092 + [Kata Kerja Transitif]",
    examples: [
      {
        japanese: "\u3054\u306F\u3093\u3092 \u305F\u3079\u307E\u3059\u3002",
        romaji: "Gohan o tabemasu.",
        indonesian: "Makan nasi.",
        note: '"Gohan" (nasi) adalah objek yang dimakan.'
      },
      {
        japanese: "\u306B\u307B\u3093\u3054\u3092 \u3079\u3093\u304D\u3087\u3046\u3057\u307E\u3059\u3002",
        romaji: "Nihongo o benkyou shimasu.",
        indonesian: "Belajar bahasa Jepang.",
        note: "Bahasa Jepang adalah objek pembelajaran."
      },
      {
        japanese: "\u3053\u3046\u3048\u3093\u3092 \u3055\u3093\u307D\u3057\u307E\u3059\u3002",
        romaji: "Kouen o sanpo shimasu.",
        indonesian: "Jalan-jalan melintasi taman.",
        note: "Taman adalah area yang dilintasi gerak."
      }
    ]
  },
  {
    id: "p-ni",
    particle: "\u306B",
    romaji: "ni",
    title: "Penanda Waktu, Tujuan Akhir, & Keberadaan",
    functions: [
      "Menandai waktu terjadinya suatu hal secara spesifik (jam, hari, tanggal).",
      "Menandai tempat keberadaan orang atau benda (bersama \u3044\u307E\u3059 / \u3042\u308A\u307E\u3059).",
      "Menandai target atau orang yang dituju (penerima tindakan).",
      "Menandai tujuan kedatangan atau kepergian."
    ],
    rules: "[Waktu Spesifik / Tempat Keberadaan / Orang Penerima] + \u306B",
    examples: [
      {
        japanese: "\u3057\u3061\u3058\u306B \u304A\u304D\u307E\u3059\u3002",
        romaji: "Shichiji ni okimasu.",
        indonesian: "Bangun pada jam 7.",
        note: "Menandai waktu pasti (jam 7)."
      },
      {
        japanese: "\u3068\u3082\u3060\u3061\u306B \u3066\u304C\u307F\u3092 \u304B\u304D\u307E\u3059\u3002",
        romaji: "Tomodachi ni tegami o kakimasu.",
        indonesian: "Menulis surat kepada teman.",
        note: '"Tomodachi" adalah sasaran/penerima surat.'
      },
      {
        japanese: "\u304D\u3087\u3046\u3068\u306B \u3044\u304D\u307E\u3059\u3002",
        romaji: "Kyouto ni ikimasu.",
        indonesian: "Pergi ke Kyoto.",
        note: "Kyoto adalah titik tujuan akhir."
      }
    ],
    comparisons: {
      with: "\u3067 (de)",
      explanation: "\u306B (ni) untuk tempat DIAM/KEBERADAAN (imasu/arimasu/sumimasu), sedangkan \u3067 (de) untuk tempat MELAKUKAN SUATU AKTIVITAS (taberu/benkyou suru)."
    }
  },
  {
    id: "p-de",
    particle: "\u3067",
    romaji: "de",
    title: "Penanda Tempat Aktivitas, Alat, & Bahan",
    functions: [
      "Menandai tempat di mana suatu kegiatan/aktivitas berlangsung.",
      "Menandai alat, transportasi, atau media yang digunakan untuk melakukan sesuatu.",
      "Menandai bahan pembuat atau alasan/penyebab."
    ],
    rules: "[Tempat Aktivitas / Alat / Transportasi] + \u3067",
    examples: [
      {
        japanese: "\u3068\u3057\u3087\u304B\u3093\u3067 \u307B\u3093\u3092 \u3088\u307F\u307E\u3059\u3002",
        romaji: "Toshokan de hon o yomimasu.",
        indonesian: "Membaca buku di perpustakaan.",
        note: "Perpustakaan adalah tempat aktivitas membaca berlangsung."
      },
      {
        japanese: "\u3067\u3093\u3057\u3083\u3067 \u304C\u3063\u3053\u3046\u3078 \u3044\u304D\u307E\u3059\u3002",
        romaji: "Densha de gakkou e ikimasu.",
        indonesian: "Pergi ke sekolah dengan/naik kereta api.",
        note: "Kereta adalah sarana transportasi yang dipakai."
      },
      {
        japanese: "\u306F\u3057\u3067 \u305F\u3079\u307E\u3059\u3002",
        romaji: "Hashi de tabemasu.",
        indonesian: "Makan menggunakan sumpit.",
        note: "Sumpit adalah alat makan."
      }
    ]
  },
  {
    id: "p-e",
    particle: "\u3078",
    romaji: "e (he)",
    title: "Penanda Arah Tujuan (Direction Marker)",
    functions: [
      'Menandai arah gerak atau destinasi perjalanan (mirip "ke" / "menuju").',
      'Ditulis dengan huruf "he" (\u3078), tetapi dibaca "e" saat berfungsi sebagai partikel arah.',
      "Sering dipasangkan dengan kata kerja perpindahan seperti \u884C\u304F (iku), \u6765\u308B (kuru), \u5E30\u308B (kaeru)."
    ],
    rules: "[Tempat Arah Tujuan] + \u3078 + [Kata Kerja Perpindahan]",
    examples: [
      {
        japanese: "\u306B\u307B\u3093\u3078 \u3044\u304D\u307E\u3059\u3002",
        romaji: "Nihon e ikimasu.",
        indonesian: "Pergi menuju Jepang.",
        note: "Menunjukkan arah perjalanan ke Jepang."
      },
      {
        japanese: "\u3044\u3048\u3078 \u304B\u3048\u308A\u307E\u3059\u3002",
        romaji: "Ie e kaerimasu.",
        indonesian: "Pulang menuju ke rumah.",
        note: "Arah gerak pulang ke kediaman."
      }
    ],
    comparisons: {
      with: "\u306B (ni)",
      explanation: "\u3078 (e) berfokus pada ARAH PERJALANAN / PROSES MENUJU, sedangkan \u306B (ni) berfokus pada TITIK TARGET AKHIR yang dicapai."
    }
  },
  {
    id: "p-no",
    particle: "\u306E",
    romaji: "no",
    title: "Penanda Kepemilikan & Modifikasi Kata Benda",
    functions: [
      'Menyatakan kepemilikan (seperti "milik" atau "punya").',
      "Menghubungkan dua kata benda (kata benda pertama menerangkan kata benda kedua).",
      "Menunjukkan asal tempat, jabatan, atau bahan."
    ],
    rules: "[Kata Benda 1] + \u306E + [Kata Benda 2]",
    examples: [
      {
        japanese: "\u3053\u308C\u306F \u308F\u305F\u3057\u306E \u304B\u3070\u3093\u3067\u3059\u3002",
        romaji: "Kore wa watashi no kaban desu.",
        indonesian: "Ini adalah tas milik saya.",
        note: 'Menyatakan kepemilikan tas oleh "watashi".'
      },
      {
        japanese: "\u306B\u307B\u3093\u3054\u306E \u305B\u3093\u305B\u3044\u3067\u3059\u3002",
        romaji: "Nihongo no sensei desu.",
        indonesian: "Guru bahasa Jepang.",
        note: '"Nihongo" menerangkan bidang dari guru tersebut.'
      },
      {
        japanese: "\u30C8\u30E8\u30BF\u306E \u304F\u308B\u307E\u3002",
        romaji: "Toyota no kuruma.",
        indonesian: "Mobil buatan Toyota.",
        note: "Menyatakan asal produsen mobil."
      }
    ]
  },
  {
    id: "p-to",
    particle: "\u3068",
    romaji: "to",
    title: 'Penanda "Dan" (Daftar Lengkap) & "Bersama"',
    functions: [
      'Menghubungkan kata benda secara menyeluruh/lengkap ("dan").',
      'Menandai rekan atau orang yang diajak melakukan sesuatu ("bersama").',
      "Digunakan untuk mengutip ucapan (to iimasu)."
    ],
    rules: "[Kata Benda] + \u3068 + [Kata Benda] ATAU [Rekan] + \u3068 + [Kata Kerja]",
    examples: [
      {
        japanese: "\u30D1\u30F3\u3068 \u305F\u307E\u3054\u3092 \u305F\u3079\u307E\u3057\u305F\u3002",
        romaji: "Pan to tamago o tabemashita.",
        indonesian: "Saya makan roti dan telur.",
        note: "Menghubungkan dua makanan yang dimakan."
      },
      {
        japanese: "\u3068\u3082\u3060\u3061\u3068 \u3048\u3044\u304C\u3092 \u307F\u307E\u3059\u3002",
        romaji: "Tomodachi to eiga o mimasu.",
        indonesian: "Menonton film bersama teman.",
        note: '"Tomodachi" adalah rekan bersama.'
      }
    ]
  },
  {
    id: "p-mo",
    particle: "\u3082",
    romaji: "mo",
    title: 'Penanda "Juga" / "Pun" (Inclusion)',
    functions: [
      'Menyatakan "juga", "pun", atau kesamaan dengan hal sebelumnya.',
      "Menggantikan partikel \u306F (wa), \u304C (ga), atau \u3092 (o).",
      'Dapat digunakan berulang (A mo B mo) berarti "baik A maupun B".'
    ],
    rules: "[Kata Benda] + \u3082",
    examples: [
      {
        japanese: "\u308F\u305F\u3057\u3082 \u304C\u304F\u305B\u3044\u3067\u3059\u3002",
        romaji: "Watashi mo gakusei desu.",
        indonesian: "Saya juga seorang siswa.",
        note: 'Menggantikan "wa" untuk menyatakan kesamaan.'
      },
      {
        japanese: "\u3053\u308C\u3082 \u305D\u308C\u3082 \u3059\u304D\u3067\u3059\u3002",
        romaji: "Kore mo sore mo suki desu.",
        indonesian: "Ini maupun itu, keduanya saya suka.",
        note: "Penggunaan ganda untuk menunjukkan inklusi semua."
      }
    ]
  },
  {
    id: "p-kara",
    particle: "\u304B\u3089",
    romaji: "kara",
    title: 'Penanda Titik Awal "Dari" & Alasan "Karena"',
    functions: [
      'Menandai titik awal tempat atau waktu ("dari" / "sejak").',
      'Jika diletakkan di akhir klausa, bermakna "karena" atau "sebab".',
      "Sering dipasangkan dengan \u307E\u3067 (made)."
    ],
    rules: "[Waktu / Tempat Awal] + \u304B\u3089",
    examples: [
      {
        japanese: "\u304F\u3058\u304B\u3089 \u3058\u3085\u3046\u3054\u3058\u307E\u3067 \u3079\u3093\u304D\u3087\u3046\u3057\u307E\u3059\u3002",
        romaji: "Kuji kara juugoji made benkyou shimasu.",
        indonesian: "Belajar dari jam 9 sampai jam 15.",
        note: "Menandai waktu awal kegiatan."
      },
      {
        japanese: "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2\u304B\u3089 \u304D\u307E\u3057\u305F\u3002",
        romaji: "Indoneshia kara kimashita.",
        indonesian: "Saya datang dari Indonesia.",
        note: "Menandai negara asal titik keberangkatan."
      }
    ]
  },
  {
    id: "p-made",
    particle: "\u307E\u3067",
    romaji: "made",
    title: 'Penanda Batas Akhir "Sampai / Hingga"',
    functions: [
      'Menandai batas akhir waktu atau tempat tujuan ("sampai" / "hingga").',
      "Menunjukkan titik penyelesaian dari suatu rentang proses."
    ],
    rules: "[Waktu / Tempat Akhir] + \u307E\u3067",
    examples: [
      {
        japanese: "\u3068\u3046\u304D\u3087\u3046\u307E\u3067 \u3067\u3093\u3057\u3083\u3067 \u3044\u304D\u307E\u3059\u3002",
        romaji: "Toukyou made densha de ikimasu.",
        indonesian: "Pergi naik kereta sampai Tokyo.",
        note: "Tokyo adalah batas akhir rute kereta."
      },
      {
        japanese: "\u3054\u3054 \u3054\u3058\u307E\u3067 \u306F\u305F\u3089\u304D\u307E\u3059\u3002",
        romaji: "Gogo goji made hatarakimasu.",
        indonesian: "Bekerja sampai jam 5 sore.",
        note: "Menunjukkan batas waktu kerja."
      }
    ]
  },
  {
    id: "p-ya",
    particle: "\u3084",
    romaji: "ya",
    title: 'Penanda Contoh "Dan Lain-lain" (Daftar Terbuka)',
    functions: [
      "Menghubungkan kata benda sebagai perwakilan contoh (bukan daftar lengkap).",
      'Sering dipadukan dengan \u306A\u3069 (nado) di akhir untuk arti "dan sebagainya".'
    ],
    rules: "[Benda 1] + \u3084 + [Benda 2] (+ \u306A\u3069)",
    examples: [
      {
        japanese: "\u3064\u304F\u3048\u306E \u3046\u3048\u306B \u307B\u3093\u3084 \u30DA\u30F3\u304C \u3042\u308A\u307E\u3059\u3002",
        romaji: "Tsukue no ue ni hon ya pen ga arimasu.",
        indonesian: "Di atas meja ada buku, pena, dan lain-lain.",
        note: "Menyebutkan sebagian contoh barang saja."
      }
    ],
    comparisons: {
      with: "\u3068 (to)",
      explanation: "\u3068 (to) menyebutkan SEMUA benda tanpa ada yang terlewat, sedangkan \u3084 (ya) hanya menyebutkan BEBERAPA contoh sampel."
    }
  },
  {
    id: "p-ka",
    particle: "\u304B",
    romaji: "ka",
    title: 'Penanda Kalimat Tanya & Pilihan "Atau"',
    functions: [
      'Diletakkan di akhir kalimat untuk mengubahnya menjadi pertanyaan (seperti tanda tanya "?").',
      'Diletakkan di antara dua kata benda untuk memberikan pilihan alternatif ("atau").'
    ],
    rules: "[Kalimat Lengkap] + \u304B \uFF1F ATAU [Pilihan A] + \u304B + [Pilihan B]",
    examples: [
      {
        japanese: "\u3053\u308C\u306F \u3042\u306A\u305F\u306E \u304B\u3070\u3093\u3067\u3059\u304B\u3002",
        romaji: "Kore wa anata no kaban desu ka.",
        indonesian: "Apakah ini tas milik Anda?",
        note: "Mengubah kalimat pernyataan menjadi pertanyaan."
      },
      {
        japanese: "\u304A\u3061\u3083\u304B \u30B3\u30FC\u30D2\u30FC\u3092 \u306E\u307F\u307E\u3059\u3002",
        romaji: "Ocha ka koohii o nomimasu.",
        indonesian: "Saya akan minum teh atau kopi.",
        note: "Menawarkan pilihan antara dua opsi."
      }
    ]
  },
  {
    id: "p-ne",
    particle: "\u306D",
    romaji: "ne",
    title: 'Partikel Akhir "Ya / Bukan Begitu?" (Persetujuan)',
    functions: [
      "Diletakkan di akhir kalimat untuk meminta konfirmasi atau mencari simpati/persetujuan lawan bicara.",
      "Membuat nada bicara menjadi lebih ramah, hangat, dan akrab."
    ],
    rules: "[Kalimat Lengkap] + \u306D",
    examples: [
      {
        japanese: "\u304D\u3087\u3046\u306F \u3042\u3064\u3044\u3067\u3059\u306D\u3002",
        romaji: "Kyou wa atsui desu ne.",
        indonesian: "Hari ini panas ya.",
        note: "Mencari persetujuan lawan bicara tentang cuaca."
      },
      {
        japanese: "\u304A\u3044\u3057\u3044\u3067\u3059\u306D\u3002",
        romaji: "Oishii desu ne.",
        indonesian: "Enak sekali ya.",
        note: "Mengajak lawan bicara merasakan rasa yang sama."
      }
    ]
  },
  {
    id: "p-yo",
    particle: "\u3088",
    romaji: "yo",
    title: 'Partikel Akhir "Lho / Tahu!" (Informasi Baru / Penegasan)',
    functions: [
      "Memberikan informasi baru yang belum diketahui lawan bicara.",
      "Menegaskan kepastian atau anjuran dengan yakin."
    ],
    rules: "[Kalimat Lengkap] + \u3088",
    examples: [
      {
        japanese: "\u3053\u306E\u30E9\u30FC\u30E1\u30F3\u306F \u3068\u3066\u3082 \u304A\u3044\u3057\u3044\u3067\u3059\u3088\u3002",
        romaji: "Kono raamen wa totemo oishii desu yo.",
        indonesian: "Ramen ini sangat lezat lho!",
        note: "Memberi tahu informasi yang mungkin belum diketahui lawan bicara."
      },
      {
        japanese: "\u3082\u3046 \u3058\u304B\u3093\u3067\u3059\u3088\u3002",
        romaji: "Mou jikan desu yo.",
        indonesian: "Sudah waktunya lho!",
        note: "Mengingatkan waktu dengan tegas."
      }
    ]
  },
  // ================= N4 & N3 PARTICLES =================
  {
    id: "p-yori",
    particle: "\u3088\u308A",
    romaji: "yori",
    title: 'Penanda Komparasi / Perbandingan ("Daripada")',
    level: "N4",
    functions: [
      "Menjadi patokan pembanding dalam pola komparasi lebih dari.",
      'Sering dipadukan dengan \u307B\u3046 (hou) yang berarti "lebih...".'
    ],
    rules: "[Kata Benda Pembanding] + \u3088\u308A + [Keterangan]",
    examples: [
      {
        japanese: "\u3072\u3053\u3046\u304D\u306F \u3057\u3093\u304B\u3093\u305B\u3093\u3088\u308A \u306F\u3084\u3044\u3067\u3059\u3002",
        romaji: "Hikouki wa shinkansen yori hayai desu.",
        indonesian: "Pesawat terbang lebih cepat daripada kereta peluru (Shinkansen).",
        note: "Shinkansen adalah pembandingnya."
      }
    ],
    comparisons: {
      with: "\u307B\u3069 (hodo)",
      explanation: '\u3088\u308A (yori) digunakan dalam perbandingan positif ("lebih cepat dari..."), sedangkan \u307B\u3069 (hodo) digunakan dalam perbandingan negatif ("tidak secepat...").'
    }
  },
  {
    id: "p-dake",
    particle: "\u3060\u3051",
    romaji: "dake",
    title: 'Penanda Batasan Tunggal ("Hanya / Cuma")',
    level: "N4",
    functions: [
      "Membatasi jumlah, cakupan, atau kondisi hanya pada yang disebutkan.",
      "Dapat diikuti oleh kalimat bernuansa positif maupun netral."
    ],
    rules: "[Kata Benda / Kata Kerja] + \u3060\u3051",
    examples: [
      {
        japanese: "\u307F\u305A\u3060\u3051\u3092 \u306E\u307F\u307E\u3057\u305F\u3002",
        romaji: "Mizu dake o nomimashita.",
        indonesian: "Saya hanya minum air saja.",
        note: "Menyatakan tidak minum hal lain."
      }
    ],
    comparisons: {
      with: "\u3057\u304B (shika)",
      explanation: "\u3060\u3051 (dake) berpasangan dengan predikat positif (dake tabemasu), sedangkan \u3057\u304B (shika) HARUS berpasangan dengan predikat negatif (shika tabemasen)."
    }
  },
  {
    id: "p-shika",
    particle: "\u3057\u304B",
    romaji: "shika",
    title: 'Penanda Batasan Bernuansa Kurang ("Hanya ... tidak lebih")',
    level: "N4",
    functions: [
      "Menyatakan bahwa hanya ada sedikit atau tidak ada pilihan lain selain itu.",
      "SELALU wajib berpasangan dengan kata kerja/predikat bentuk negatif (Nai)."
    ],
    rules: "[Kata Benda / Jumlah] + \u3057\u304B + [Bentuk Negatif (Nai)]",
    examples: [
      {
        japanese: "\u30B5\u30A4\u30D5\u306E\u306A\u304B\u306B \u305B\u3093\u3048\u3093\u3057\u304B \u3042\u308A\u307E\u305B\u3093\u3002",
        romaji: "Saifu no naka ni sen'en shika arimasen.",
        indonesian: "Di dalam dompet hanya ada seribu yen saja (merasa sedikit/tidak cukup).",
        note: "Predikat menggunakan arimasen (negatif)."
      }
    ]
  },
  {
    id: "p-hodo",
    particle: "\u307B\u3069",
    romaji: "hodo",
    title: 'Penanda Derajat / Perbandingan Negatif ("Tidak Se-...")',
    level: "N3",
    functions: [
      "Menyatakan perbandingan negatif: subjek A tidak se-hebat/se-tinggi B.",
      "Menyatakan batas tingkatan ekstrem (begitu lelah hingga...).",
      'Dalam pola \u301C\u3070\u301C\u307B\u3069 menyatakan "semakin ... semakin ...".'
    ],
    rules: "[Kata Benda] + \u307B\u3069 + [Predikat Negatif]",
    examples: [
      {
        japanese: "\u3053\u3068\u3057\u306F \u304D\u3087\u306D\u3093\u307B\u3069 \u3042\u3064\u304F\u306A\u3044\u3067\u3059\u3002",
        romaji: "Kotoshi wa kyonen hodo atsukunai desu.",
        indonesian: "Tahun ini tidak sepanas tahun lalu.",
        note: "Menyatakan derajat panas tahun ini tidak mencapai tahun lalu."
      }
    ]
  },
  {
    id: "p-bakari",
    particle: "\u3070\u304B\u308A",
    romaji: "bakari",
    title: 'Penanda "Melulu / Hanya ... saja" & "Baru Saja"',
    level: "N3",
    functions: [
      "Menyatakan seseorang melakukan suatu tindakan melulu hingga terkesan berlebihan.",
      "Jika dipasangkan dengan kata kerja bentuk Ta (V-ta bakari), berarti baru saja selesai terjadi."
    ],
    rules: "[Kata Benda / V-te] + \u3070\u304B\u308A / [V-ta] + \u3070\u304B\u308A",
    examples: [
      {
        japanese: "\u30B2\u30FC\u30E0\u3070\u304B\u308A \u3057\u3066\u3044\u306A\u3044\u3067\u3001\u3079\u3093\u304D\u3087\u3046\u3057\u306A\u3055\u3044\u3002",
        romaji: "Geemu bakari shiteinaide, benkyou shinasai.",
        indonesian: "Jangan main game melulu, belajarlah!",
        note: "Kritik karena terlalu sering main game."
      }
    ]
  },
  // ================= N2 & N1 PARTICLES & GRAMMAR MARKERS =================
  {
    id: "p-ni-taishite",
    particle: "\u306B\u5BFE\u3057\u3066 (ni taishite)",
    romaji: "ni taishite",
    title: 'Penanda Sasaran Objek & Kontras ("Terhadap / Berbeda dengan")',
    level: "N2",
    functions: [
      "Menandai sasaran tindakan atau sikap kepada pihak tertentu.",
      "Membuat perbandingan kontras antara dua kondisi yang saling bertolak belakang."
    ],
    rules: "[Kata Benda] + \u306B\u5BFE\u3057\u3066",
    examples: [
      {
        japanese: "\u304A\u304D\u3083\u304F\u3055\u307E\u306B \u305F\u3044\u3057\u3066\u3001\u3066\u3044\u306D\u3044\u306B \u305B\u3063\u304B\u304F\u3057\u307E\u3059\u3002",
        romaji: "Okyakusama ni taishite, teinei ni sekkaku shimasu.",
        indonesian: "Bersikap sopan dan ramah terhadap para pelanggan.",
        note: "Menunjukkan sasaran sikap."
      }
    ]
  },
  {
    id: "p-ni-kanshte",
    particle: "\u306B\u95A2\u3057\u3066 (ni kanshite)",
    romaji: "ni kanshite",
    title: 'Penanda Topik Diskusi Mendalam ("Mengenai / Berkenaan dengan")',
    level: "N2",
    functions: [
      "Menandai topik pembicaraan dalam konteks formal atau laporan ilmiah.",
      "Lebih formal dan luas cakupannya dibanding partikel \u306B\u3064\u3044\u3066 (ni tsuite)."
    ],
    rules: "[Kata Benda] + \u306B\u95A2\u3057\u3066 / \u306B\u95A2\u3059\u308B [Kata Benda]",
    examples: [
      {
        japanese: "\u3053\u306E \u3058\u3051\u3093\u306B\u95A2\u3057\u3066\u3001\u304F\u308F\u3057\u3044 \u3061\u3087\u3046\u3055\u304C \u3059\u3059\u3081\u3089\u308C\u3066\u3044\u307E\u3059\u3002",
        romaji: "Kono jiken ni kanshite, kuwashii chousa ga susumerareteimasu.",
        indonesian: "Mengenai insiden ini, penyelidikan mendalam sedang dilakukan.",
        note: "Khas bahasa berita dan laporan formal."
      }
    ]
  },
  {
    id: "p-ni-totte",
    particle: "\u306B\u3068\u3063\u3066 (ni totte)",
    romaji: "ni totte",
    title: 'Penanda Sudut Pandang Subjektif ("Bagi / Menurut ...")',
    level: "N2",
    functions: [
      "Menunjukkan dari sudut pandang siapa suatu penilaian atau nilai penting dibuat."
    ],
    rules: "[Kata Benda (Orang / Pihak)] + \u306B\u3068\u3063\u3066",
    examples: [
      {
        japanese: "\u304C\u304F\u305B\u3044\u306B\u3068\u3063\u3066\u3001\u3053\u306E \u3057\u3051\u3093\u306F \u304D\u308F\u3081\u3066 \u3058\u3085\u3046\u3088\u3046\u3067\u3059\u3002",
        romaji: "Gakusei ni totte, kono shiken wa kiwamete juuyou desu.",
        indonesian: "Bagi seorang pelajar, ujian ini teramat sangat penting.",
        note: "Menunjukkan sudut pandang seorang pelajar."
      }
    ]
  },
  {
    id: "p-dokoroka",
    particle: "\u3069\u3053\u308D\u304B (dokoroka)",
    romaji: "dokoroka",
    title: 'Penanda Tingkat Ekstrem ("Jangankan ... Jangankan begitu, justru ...")',
    level: "N1",
    functions: [
      "Menyatakan bahwa kenyataan yang terjadi jauh dari apa yang diharapkan atau diperkirakan.",
      'Sering bernuansa: "Jangankan A, bahkan B yang lebih sederhana saja tidak bisa".'
    ],
    rules: "[Kata Benda / Bentuk Biasa] + \u3069\u3053\u308D\u304B",
    examples: [
      {
        japanese: "\u304B\u3093\u3058\u3069\u3053\u308D\u304B\u3001\u3072\u3089\u304C\u306A\u3055\u3048 \u307E\u3060 \u3088\u3081\u307E\u305B\u3093\u3002",
        romaji: "Kanji dokoroka, hiragana sae mada yomemasen.",
        indonesian: "Jangankan huruf Kanji, huruf Hiragana pun dia belum bisa baca.",
        note: "Tingkat keparahan yang kontras."
      }
    ]
  },
  {
    id: "p-ni-kakete",
    particle: "\u306B\u304B\u3051\u3066 (ni kakete)",
    romaji: "ni kakete",
    title: 'Penanda Rentang Ruang & Waktu ("Membentang dari ... hingga ...")',
    level: "N1",
    functions: [
      "Menyatakan rentang waktu atau area geografis yang berlangsung secara bertahap tanpa batas kaku.",
      "Lebih fleksibel dan luas dibanding \u304B\u3089\u301C\u307E\u3067 (kara... made)."
    ],
    rules: "[Waktu/Tempat 1] + \u304B\u3089 + [Waktu/Tempat 2] + \u306B\u304B\u3051\u3066",
    examples: [
      {
        japanese: "\u3042\u3057\u305F\u306E \u3042\u3055\u304B\u3089 \u3086\u3046\u304C\u305F\u306B\u304B\u3051\u3066\u3001\u3064\u3088\u3044 \u3042\u3081\u304C \u3075\u308B\u3067\u3057\u3087\u3046\u3002",
        romaji: "Ashita no asa kara yuugata ni kakete, tsuyoi ame ga furu deshou.",
        indonesian: "Mulai besok pagi hingga membentang ke petang hari, diperkirakan akan turun hujan lebat.",
        note: "Rentang waktu yang samar dan membentang."
      }
    ]
  }
];
