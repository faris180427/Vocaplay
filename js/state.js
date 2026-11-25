/* ==============================================================
   VOCAPLAY — GLOBAL STATE, CONSTANTS & STORAGE HELPERS
   ============================================================== */

const STORAGE_ACCOUNTS_KEY = 'vocaplay_accounts_v1';
const STORAGE_SESSION_KEY = 'vocaplay_session_v1';
const STORAGE_GUEST_KEY = 'vocaplay_guest_v1';

const AVATAR_CHOICES = [
  'av-sky', 'av-indigo', 'av-emerald', 'av-violet', 'av-amber', 'av-rose', 'av-cyan', 'av-teal'
];

const AVATAR_PALETTES = {
  'av-sky': { bg: 'from-sky-500 to-blue-600', text: 'text-white', ring: 'ring-sky-400/40' },
  'av-indigo': { bg: 'from-indigo-500 to-purple-600', text: 'text-white', ring: 'ring-indigo-400/40' },
  'av-emerald': { bg: 'from-emerald-500 to-teal-600', text: 'text-white', ring: 'ring-emerald-400/40' },
  'av-violet': { bg: 'from-violet-500 to-fuchsia-600', text: 'text-white', ring: 'ring-violet-400/40' },
  'av-amber': { bg: 'from-amber-500 to-orange-600', text: 'text-white', ring: 'ring-amber-400/40' },
  'av-rose': { bg: 'from-rose-500 to-pink-600', text: 'text-white', ring: 'ring-rose-400/40' },
  'av-cyan': { bg: 'from-cyan-500 to-blue-600', text: 'text-white', ring: 'ring-cyan-400/40' },
  'av-teal': { bg: 'from-teal-500 to-emerald-600', text: 'text-white', ring: 'ring-teal-400/40' }
};

const NPC_COMPETITORS = [
  { username: 'npc_maryland', name: 'Maryland W.', avatar: 'av-indigo', cefr: 'C1', xp: 680, weeklyXP: 180, monthlyXP: 420 },
  { username: 'npc_andrew', name: 'Andrew K.', avatar: 'av-sky', cefr: 'B2', xp: 520, weeklyXP: 140, monthlyXP: 340 },
  { username: 'npc_charlotte', name: 'Charlotte L.', avatar: 'av-violet', cefr: 'B2', xp: 410, weeklyXP: 110, monthlyXP: 280 },
  { username: 'npc_rosalia', name: 'Rosalia E.', avatar: 'av-rose', cefr: 'B1', xp: 300, weeklyXP: 85, monthlyXP: 210 },
  { username: 'npc_darren', name: 'Darren K.', avatar: 'av-amber', cefr: 'B1', xp: 210, weeklyXP: 60, monthlyXP: 150 },
  { username: 'npc_clinton', name: 'Clinton H.', avatar: 'av-emerald', cefr: 'A2', xp: 140, weeklyXP: 40, monthlyXP: 100 },
  { username: 'npc_kenji', name: 'Kenji S.', avatar: 'av-cyan', cefr: 'A2', xp: 80, weeklyXP: 25, monthlyXP: 60 },
  { username: 'npc_siti', name: 'Siti R.', avatar: 'av-teal', cefr: 'A1', xp: 40, weeklyXP: 15, monthlyXP: 30 }
];

const ACHIEVEMENTS = [
  { id: 'first_word', title: 'First Lexical Capture', desc: 'Jawab benar kata pertama kamu.', icon: 'sprout' },
  { id: 'words_25', title: 'Word Collector', desc: 'Pelajari & kuasai 25 kosakata berbeda.', icon: 'book' },
  { id: 'words_100', title: 'Century Lexicon', desc: 'Pelajari & kuasai 100 kosakata berbeda.', icon: 'books' },
  { id: 'words_500', title: 'Vocabulary Titan', desc: 'Pelajari & kuasai 500 kosakata berbeda.', icon: 'landmark' },
  { id: 'words_1000', title: 'Lexicon Legend', desc: 'Pelajari & kuasai 1.000 kosakata berbeda.', icon: 'crown' },
  { id: 'streak_5', title: 'Cognitive Flow', desc: 'Capai 5 jawaban benar beruntun dalam 1 sesi.', icon: 'zap' },
  { id: 'lesson_done', title: 'Lesson Finisher', desc: 'Selesaikan 1 sesi permainan penuh.', icon: 'flag' },
  { id: 'games_5', title: 'Dedicated Learner', desc: 'Selesaikan total 5 sesi permainan.', icon: 'gamepad' },
  { id: 'games_20', title: 'Marathon Scholar', desc: 'Selesaikan total 20 sesi permainan.', icon: 'award' },
  { id: 'perfect_game', title: 'Flawless Mastery', desc: 'Selesaikan sesi tanpa kehilangan satu nyawa pun.', icon: 'diamond' },
  { id: 'streak_3_days', title: '3-Day Habit', desc: 'Pertahankan daily streak selama 3 hari.', icon: 'flame' },
  { id: 'streak_7_days', title: 'Weekly Champion', desc: 'Pertahankan daily streak selama 7 hari.', icon: 'star' },
  { id: 'xp_500', title: 'XP Hunter', desc: 'Kumpulkan total 500 XP.', icon: 'target' },
  { id: 'xp_2000', title: 'Grand Master', desc: 'Kumpulkan total 2.000 XP.', icon: 'trophy' },
  { id: 'c1_conqueror', title: 'C1 Scholar', desc: 'Jawab benar kosakata tingkat mahir (C1).', icon: 'award' },
  { id: 'voice_master', title: 'Phonetic Articulator', desc: 'Berhasil verifikasi pelafalan via mikrofon.', icon: 'mic' },
  { id: 'syntax_architect', title: 'Syntax Architect', desc: 'Susun kalimat bahasa Inggris dengan benar.', icon: 'align' },
  { id: 'shooter_ace', title: 'Sky Defender', desc: 'Selesaikan sesi Penembak Kata dengan menang.', icon: 'crosshair' },
  { id: 'speed_demon', title: 'Speed Precision', desc: 'Capai akurasi tinggi di Fast Vocab.', icon: 'zap' },
  { id: 'lexicon_keeper', title: 'Lexicon Scholar', desc: 'Buka Kamus & Lexicon Laboratory.', icon: 'search' },
  { id: 'custom_creator', title: 'Word Architect', desc: 'Tambahkan kosakata kustom buatanmu sendiri.', icon: 'pen' }
];

function getAppIconSvg(name, extraClass = 'w-4 h-4') {
  const icons = {
    home: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    decks: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/></svg>`,
    headphones: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`,
    mic: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    vocab: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    target: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    trophy: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    user: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    flame: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    gem: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
    search: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    volume: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    volumeX: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>`,
    sun: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    plus: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    zap: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    check: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    sparkles: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    rocket: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    sprout: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`,
    book: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
    books: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>`,
    crown: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
    flag: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    gamepad: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="6"/></svg>`,
    award: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    star: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    align: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`,
    crosshair: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>`,
    pen: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    landmark: `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="22" y2="22"/><line x1="12" x2="12" y1="2" y2="6"/><path d="m2 6 10-4 10 4"/><path d="M4 10v9"/><path d="M8 10v9"/><path d="M16 10v9"/><path d="M20 10v9"/></svg>`
  };
  return icons[name] || icons.zap;
}

function getAvatarMarkup(avatarKey, name = 'User', extraClass = 'w-8 h-8 rounded-xl') {
  const p = AVATAR_PALETTES[avatarKey] || AVATAR_PALETTES['av-sky'];
  const cleanName = String(name || 'VP').trim();
  const initials = cleanName.split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase() || 'VP';
  return `<div class="${extraClass} bg-gradient-to-tr ${p.bg} ${p.text} ring-2 ${p.ring} flex items-center justify-center font-bold text-xs tracking-tight shadow-sm select-none">${initials}</div>`;
}

const CEFR_CONFIG = {
  A1: { name: 'Foundational', timerSec: 8.0, xpMult: 1.0 },
  A2: { name: 'Elementary', timerSec: 7.5, xpMult: 1.2 },
  B1: { name: 'Intermediate', timerSec: 7.0, xpMult: 1.4 },
  B2: { name: 'Upper-Int', timerSec: 6.5, xpMult: 1.7 },
  C1: { name: 'Advanced', timerSec: 6.0, xpMult: 2.0 },
  ALL: { name: 'Mix All Corpus', timerSec: 7.0, xpMult: 1.5 }
};

/* ---------- GLOBAL RUNTIME STATE ---------- */
let VOCAB_DATA = getCombinedBaseVocab();
let currentUser = null;
let currentCEFR = 'A1';
let currentCategory = 'All';
let currentMode = 'fast-vocab';
let currentItem = null;
let leaderboardPeriod = 'weekly';

let score = 0;
let lives = 3;
let streak = 0;
let sessionXP = 0;
let sessionDiamonds = 0;
let totalQuestionsAnswered = 0;
let correctAnswersCount = 0;
let roundNumber = 0;
const MAX_ROUNDS = 8;
let sessionStartTime = 0;
let reviewWordsList = new Set();
let isPracticingWeakWords = false;

let wordQueues = {};
let lastDrawnId = null;
let fastVocabTimerInterval = null;
let fastVocabTimeLeft = 5.0;
let activeDeckId = 'ox_a1';
let pendingDeckGameMode = null;
let shooterInterval = null;
let shooterSpawnInterval = null;
let shooterActiveWords = [];
let shooterDestroyed = 0;

/* ---------- DATE, HASH & VISUAL HELPERS ---------- */
function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayDayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function simpleHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(16);
}

function sha256Hex(ascii) {
  const rightRotate = (v, a) => (v >>> a) | (v << (32 - a));
  const maxWord = Math.pow(2, 32);
  let result = '';
  const words = [];
  const asciiBitLength = ascii.length * 8;
  let hash = sha256Hex._h || [];
  let k = sha256Hex._k || [];
  let primeCounter = k.length;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  sha256Hex._h = hash.slice(0, 8);
  sha256Hex._k = k;
  hash = hash.slice(0, 8);

  ascii += '\x80';
  while (ascii.length % 64 - 56) ascii += '\x00';
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (let j = 0; j < words.length;) {
    const w = words.slice(j, j += 16);
    const oldHash = hash.slice(0);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
          w[i - 16]
          + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
          + w[i - 7]
          + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
        ) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }
    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

async function hashPasswordSecure(password, username) {
  const salted = `vocaplay_v2:${String(username || '').trim().toLowerCase()}:${password}`;
  if (window.crypto && window.crypto.subtle && window.TextEncoder) {
    try {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(salted));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}
  }
  return sha256Hex(unescape(encodeURIComponent(salted)));
}

function getShortMeaning(item, maxLen = 58) {
  const raw = (item && (item.meaning || item.definition)) ? String(item.meaning || item.definition).trim() : '';
  if (raw.length <= maxLen) return raw;
  const cut = raw.slice(0, maxLen).replace(/\s+\S*$/, '');
  return (cut || raw.slice(0, maxLen)) + '…';
}

function hasRealImage(item) {
  return Boolean(item && item.image && String(item.image).trim().length > 0);
}

function setOptionalImageFrame(frameId, item) {
  const frame = document.getElementById(frameId);
  if (!frame) return;
  if (hasRealImage(item)) {
    frame.classList.remove('hidden');
    frame.innerHTML = `<img src="${item.image}" alt="vocab visual" loading="lazy" class="w-full h-full object-cover" onerror="this.parentElement.classList.add('hidden')">`;
  } else {
    frame.classList.add('hidden');
    frame.innerHTML = '';
  }
}

/* ---------- PROFILE & STORAGE ---------- */
function createFreshProfile({ username, name, passwordHash = '', avatar = '🎓', isGuest = false }) {
  const today = getTodayISO();
  return {
    username,
    name,
    passwordHash,
    avatar,
    isGuest,
    bio: 'Building English fluency one word at a time.',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    cefr: 'A1',
    xp: 0,
    weeklyXP: 0,
    monthlyXP: 0,
    coins: 20,
    streak: 0,
    lastActiveDate: '',
    weekDaysActive: [false, false, false, false, false, false, false],
    gamesPlayed: 0,
    perfectGames: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    masteredWords: [],
    weakWords: [],
    customWords: [],
    unlockedBadges: [],
    dailyMission: {
      date: today,
      diamondsToday: 0,
      xpToday: 0,
      gamesToday: 0,
      claimed: []
    }
  };
}

function normalizeDailyMission(user) {
  const today = getTodayISO();
  if (!user.dailyMission || user.dailyMission.date !== today) {
    user.dailyMission = { date: today, diamondsToday: 0, xpToday: 0, gamesToday: 0, claimed: [] };
  }
  if (!Array.isArray(user.weekDaysActive) || user.weekDaysActive.length !== 7) {
    user.weekDaysActive = [false, false, false, false, false, false, false];
  }
  if (!Array.isArray(user.masteredWords)) user.masteredWords = [];
  if (!Array.isArray(user.weakWords)) user.weakWords = [];
  if (!Array.isArray(user.customWords)) user.customWords = [];
  if (!Array.isArray(user.unlockedBadges)) user.unlockedBadges = [];
}

function loadAllAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS_KEY) || '{}');
  } catch { return {}; }
}

function saveAllAccounts(accounts) {
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function saveCurrentAccountState() {
  if (!currentUser) return;
  currentUser.cefr = currentCEFR;
  currentUser.deckId = activeDeckId;
  if (currentUser.isGuest) {
    localStorage.setItem(STORAGE_GUEST_KEY, JSON.stringify(currentUser));
  } else {
    const accounts = loadAllAccounts();
    accounts[currentUser.username.toLowerCase()] = currentUser;
    saveAllAccounts(accounts);
    if (typeof scheduleCloudSync === 'function') scheduleCloudSync(currentUser);
  }
}
