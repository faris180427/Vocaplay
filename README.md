# Vocaplay — Learn and Fun

Aplikasi pembelajaran bahasa Inggris interaktif berbasis web dengan **4.080+ kosakata standar Oxford (CEFR A1–C1)**, **9 mode permainan inti yang unik (Grid 3×3)**, **Jalur Belajar 10 Unit (40 pelajaran)**, sistem **Spaced Repetition (Memory Vault SRS)**, **PWA offline support**, serta backend **Laravel + MySQL (Sanctum API)**.

---

## Fitur Utama

### 1. 9 Mode Permainan Inti (Tanpa Duplikasi Mekanik)
| Mode | Kategori | Mekanik Utama |
|---|---|---|
| **Vocab Wordle** | Puzzle Huruf | Tebak kata 5 huruf dalam 6 kesempatan dengan arti langsung & petunjuk huruf bertahap |
| **Word Connections** | Logika 4×4 | Kelompokkan 16 kata acak ke 4 kategori topik konkret ala *NYT Connections* |
| **Lexicon Boss Battle** | Mini RPG | 5 Level Boss khusus (`Lv.1 A1` – `Lv.5 C1`), HP Bar, Critical Hit, & skill Ultimate |
| **Dialogue Quest** | Roleplay | Simulasi percakapan nyata (*Kafe London*, *Bandara*, *Wawancara Kerja*) dengan NPC |
| **Penembak Kata** | Arcade Canvas | HTML5 Canvas 60fps gaya *ZType* — lock-on target, tembak laser per huruf, partikel & 4 jalur anti-tumpuk |
| **Fast Vocab** | Listening | 2 sub-mode: **Speed Match** & **Mystery Reveal 3×3** (buka 9 kotak bertahap) |
| **Sentence Builder** | Grammar | Latihan tata bahasa per topik (*Is/Are*, *Have/Has*, *Past Tense*, *Can/Can't*, *Routines & Jobs*) |
| **Acoustic Dictation** | Listening | Dengarkan pelafalan fonetik lalu tuliskan ejaan kata dengan tepat |
| **Voice Duel** | Speaking | 2 sub-mode: **Kata Tunggal** & **Kalimat Penuh (Speaking Phrases)** dengan highlight per kata |

### 2. Sistem Belajar, UI, & Keamanan
* **Tema Warm Charcoal + Indigo & Coral**: Mendukung **Dark Mode** dan **Light Mode** kontras tinggi, dibuild lokal dengan **Tailwind CSS v3** (`css/tailwind.css`).
* **Jalur Belajar Terstruktur**: 10 Unit tematik (40 pelajaran dari A1 hingga C1), filter CEFR, **Fase Perbaikan Kesalahan (*Mistake Re-Queue*)**, dan **Peti Hadiah** di tiap akhir unit.
* **Memory Vault (SRS 3 Tahap)**: Kata yang salah masuk antrean ulang bertahap (`0/3 → 1/3 → 2/3 → lulus`).
* **Profil & Avatar**: Pilihan avatar **Warna (Inisial)** dan **Emoticon** (16 pilihan cepat + input emoticon bebas).
* **Liga Mingguan Transparan**: Jenjang *Bronze → Silver → Gold → Sapphire → Obsidian League* dengan label **`BOT`** yang jelas pada bot latihan (otomatis hilang saat pemain terdaftar ≥ 3).
* **Hardening Keamanan Backend**: Hash password **bcrypt** di server, **rate limiting** login (maks. 5 gagal/menit → HTTP 429), validasi anti-cheat XP/Coins/Streak berbasis waktu, sanitasi XSS (`escapeHtml`), dan cache berbasis file untuk korpus kosakata.

---

## Struktur Proyek

```text
vocaplay/
├── index.html                      # Shell UI utama, 9 mode game, Jalur Belajar, & modal
├── manifest.json                   # Konfigurasi PWA (installable app)
├── sw.js                           # Service Worker (network-first, bypass /api/*)
├── package.json                    # Script build Tailwind CSS & test runner (Node / Playwright)
├── tailwind.config.js              # Konfigurasi Tailwind CSS v3
├── playwright.config.js            # Konfigurasi E2E smoke test browser
├── css/
│   ├── tailwind.input.css          # Input directives Tailwind
│   ├── tailwind.css                # Output CSS terkompilasi lokal (hasil npm run build:css)
│   └── style.css                   # Tema Warm Charcoal + Indigo & Coral, animasi taktil
├── assets/
│   ├── logos/                      # Konsep logo SVG, lockup horizontal, & galeri preview
│   └── theme-preview.html          # Halaman perbandingan 3 palet warna (Dark & Light)
├── js/
│   ├── state.js                    # State global, escapeHtml, ikon SVG Lucide, avatar, & storage
│   ├── audio.js                    # Web Audio pentatonis, laser/explode SFX, & TTS US/UK
│   ├── decks.js                    # 12 dek kosakata, preview kata per dek, & shuffle-bag
│   ├── auth.js                     # Login/Register, show/hide password, & Edit Profil
│   ├── leaderboard.js              # Podium, Liga Mingguan, Zona Promosi Top 3, & badge BOT
│   ├── missions.js                 # Misi harian, Toko Diamonds, Memory Vault SRS, & badge
│   ├── engine.js                   # Runner sesi, Personal Best, Extra Shield, & shortcut keyboard
│   ├── games.js                    # Fast Vocab, Mystery Reveal, Grammar Builder, Voice Duel, Penembak Kata
│   ├── games_pro.js                # Vocab Wordle, Word Connections, 5-Level Boss Battle, Dialogue Quest
│   ├── path.js                     # Jalur Belajar 10 Unit (40 pelajaran) & Mistake Re-Queue
│   └── ui.js                       # Navigasi tab, Flashcard, Kamus, 2x XP Boost, & bootstrap
├── vocab.js                        # 80 kata kurasi, definisi 12 dek, & fallback visual SVG
├── tests/
│   ├── js/state.test.mjs           # Unit test logika JS & proteksi XSS (node --test)
│   └── e2e/smoke.spec.js           # Smoke test 9 game & 6 tab (Playwright)
├── laravel-backend/                # Starter Kit & Sync Laravel + MySQL (MVC, Sanctum API)
│   ├── sync_to_laravel.ps1         # Skrip otomatis sinkronisasi ke C:\xampp\htdocs\vocaplay-laravel
│   ├── vocaplay_mysql.sql          # Skema 5 tabel relasional MySQL (siap phpMyAdmin / ERD)
│   ├── LARAVEL_SETUP_GUIDE.md      # Panduan setup XAMPP/Laragon + testing
│   ├── phpunit.xml                 # Konfigurasi PHPUnit memakai database terpisah vocaplay_test
│   ├── app/                        # Model User/Vocab & VocaplayController (API + Anti-Cheat)
│   ├── database/migrations/        # Migrasi tabel & kolom MySQL
│   ├── routes/                     # api.php (throttled) & web.php
│   ├── public/cloud_laravel.js     # Klien API Laravel + MySQL (pengganti cloud.js)
│   └── tests/Feature/              # Feature test API Laravel (VocaplayApiTest & ExampleTest)
└── docs/
    └── ARCHITECTURE.md             # Dokumentasi arsitektur, ERD Mermaid, & daftar endpoint
```

---

## Cara Menjalankan & Build

### 1. Build Tailwind CSS Lokal
```powershell
npm install
npm run build:css
```

### 2. Sinkronisasi & Jalankan di Laravel + MySQL (XAMPP)
```powershell
powershell -ExecutionPolicy Bypass -File ".\laravel-backend\sync_to_laravel.ps1"
cd C:\xampp\htdocs\vocaplay-laravel
php artisan serve
```
Lalu buka `http://127.0.0.1:8000`. Panduan setup awal ada di [laravel-backend/LARAVEL_SETUP_GUIDE.md](laravel-backend/LARAVEL_SETUP_GUIDE.md).

### 3. Menjalankan Tes Otomatis
```powershell
# Unit test JS (Node built-in test runner)
npm run test:unit

# Smoke test 9 game di browser (Playwright)
npm run test:e2e

# Feature test API Laravel (memakai database terpisah vocaplay_test)
cd C:\xampp\htdocs\vocaplay-laravel
php artisan test
```
