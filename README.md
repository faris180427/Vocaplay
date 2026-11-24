# Vocaplay — English Language Studio & Games

Aplikasi belajar kosakata bahasa Inggris berbasis web (Vanilla HTML/CSS/JS + Tailwind CDN) dengan 4.080+ kosakata standar Oxford (CEFR A1–C1), 12 mode permainan interaktif, 12 dek kosakata, dan sinkronisasi database online (Supabase PostgreSQL).

## Struktur Proyek

```
vocaplay/
├── index.html                  # Shell UI utama & modal
├── css/
│   └── style.css               # Tema gelap/terang, animasi 3D flip, transisi, & efek game
├── js/
│   ├── state.js                # Konfigurasi global, state permainan, & helper profil
│   ├── audio.js                # Web Audio SFX & pemilihan suara TTS natural
│   ├── decks.js                # Sistem 12 dek kosakata, filter kategori, & antrean kata
│   ├── auth.js                 # Login, daftar akun, tamu, & edit profil
│   ├── leaderboard.js          # Peringkat langsung (Mingguan, Bulanan, All-Time)
│   ├── missions.js             # Misi harian, streak, kata lemah, & lencana pencapaian
│   ├── engine.js               # Kontrol sesi game, skor, nyawa, & shortcut keyboard
│   ├── games.js                # Logika seluruh 12 mode permainan
│   └── ui.js                   # Navigasi tab, kamus, Speech Studio, & bootstrap aplikasi
├── vocab.js                    # 80 kata kurasi lengkap, 12 dek, & generator kartu visual
├── vocab_4000.js               # 4.000 kata Oxford (CEFR A1–C1)
├── cloud.js                    # Klien Supabase REST / RPC
├── supabase_schema.sql         # Skema PostgreSQL (tabel user, kosakata, & fungsi RPC)
├── build_4000_vocab.py         # Generator korpus 4.000 kata Oxford
├── fetch_vocab_images.py       # Pengambil foto Wikipedia + generator CSV untuk Supabase
└── translate_vocab_indo.py     # Penerjemah arti 4.000 kata ke Bahasa Indonesia
```

## Cara Menjalankan

1. **Langsung di Browser:** Buka `index.html` di Chrome/Edge.
2. **Dengan Server Lokal (disarankan untuk Voice Duel / mikrofon):**
   ```powershell
   cd C:\Users\asus\.gemini\antigravity\scratch\vocaplay
   python -m http.server 8000
   ```
   Lalu buka `http://localhost:8000`.
