/* ==============================================================
   VOCAPLAY — GLOBAL STATE, CONSTANTS & STORAGE HELPERS
   ============================================================== */

const STORAGE_ACCOUNTS_KEY = 'vocaplay_accounts_v1';
const STORAGE_SESSION_KEY = 'vocaplay_session_v1';
const STORAGE_GUEST_KEY = 'vocaplay_guest_v1';

const AVATAR_CHOICES = [
  '🎓', '🦊', '🦁', '🦉', '🚀', '👩‍🔬', '🧑‍💻', '⚡', '🐼', '🌟',
  '🐱', '🐸', '🦋', '🔥', '💎', '🎯', '🧠', '👾', '🦄', '🍀'
];

const NPC_COMPETITORS = [
  { username: 'npc_maryland', name: 'Maryland W.', avatar: '👩‍🔬', cefr: 'C1', xp: 680, weeklyXP: 180, monthlyXP: 420 },
  { username: 'npc_andrew', name: 'Andrew K.', avatar: '👨‍🎓', cefr: 'B2', xp: 520, weeklyXP: 140, monthlyXP: 340 },
  { username: 'npc_charlotte', name: 'Charlotte L.', avatar: '🧑‍💻', cefr: 'B2', xp: 410, weeklyXP: 110, monthlyXP: 280 },
  { username: 'npc_rosalia', name: 'Rosalia E.', avatar: '👩‍🎨', cefr: 'B1', xp: 300, weeklyXP: 85, monthlyXP: 210 },
  { username: 'npc_darren', name: 'Darren K.', avatar: '👨‍🏫', cefr: 'B1', xp: 210, weeklyXP: 60, monthlyXP: 150 },
  { username: 'npc_clinton', name: 'Clinton H.', avatar: '👨‍🚀', cefr: 'A2', xp: 140, weeklyXP: 40, monthlyXP: 100 },
  { username: 'npc_kenji', name: 'Kenji S.', avatar: '🦊', cefr: 'A2', xp: 80, weeklyXP: 25, monthlyXP: 60 },
  { username: 'npc_siti', name: 'Siti R.', avatar: '🦉', cefr: 'A1', xp: 40, weeklyXP: 15, monthlyXP: 30 }
];

const ACHIEVEMENTS = [
  { id: 'first_word', title: 'First Lexical Capture', desc: 'Jawab benar kata pertama kamu.', icon: '🌱' },
  { id: 'words_25', title: 'Word Collector', desc: 'Pelajari & kuasai 25 kosakata berbeda.', icon: '📘' },
  { id: 'words_100', title: 'Century Lexicon', desc: 'Pelajari & kuasai 100 kosakata berbeda.', icon: '📚' },
  { id: 'words_500', title: 'Vocabulary Titan', desc: 'Pelajari & kuasai 500 kosakata berbeda.', icon: '🏛️' },
  { id: 'words_1000', title: 'Lexicon Legend', desc: 'Pelajari & kuasai 1.000 kosakata berbeda.', icon: '👑' },
  { id: 'streak_5', title: 'Cognitive Flow', desc: 'Capai 5 jawaban benar beruntun dalam 1 sesi.', icon: '⚡' },
  { id: 'lesson_done', title: 'Lesson Finisher', desc: 'Selesaikan 1 sesi permainan penuh.', icon: '🏁' },
  { id: 'games_5', title: 'Dedicated Learner', desc: 'Selesaikan total 5 sesi permainan.', icon: '🎮' },
  { id: 'games_20', title: 'Marathon Scholar', desc: 'Selesaikan total 20 sesi permainan.', icon: '🏅' },
  { id: 'perfect_game', title: 'Flawless Mastery', desc: 'Selesaikan sesi tanpa kehilangan satu nyawa pun.', icon: '💎' },
  { id: 'streak_3_days', title: '3-Day Habit', desc: 'Pertahankan daily streak selama 3 hari.', icon: '🔥' },
  { id: 'streak_7_days', title: 'Weekly Champion', desc: 'Pertahankan daily streak selama 7 hari.', icon: '🌟' },
  { id: 'xp_500', title: 'XP Hunter', desc: 'Kumpulkan total 500 XP.', icon: '🚀' },
  { id: 'xp_2000', title: 'Grand Master', desc: 'Kumpulkan total 2.000 XP.', icon: '🏆' },
  { id: 'c1_conqueror', title: 'C1 Scholar', desc: 'Jawab benar kosakata tingkat mahir (C1).', icon: '🎓' },
  { id: 'voice_master', title: 'Phonetic Articulator', desc: 'Berhasil verifikasi pelafalan via mikrofon.', icon: '🎙️' },
  { id: 'syntax_architect', title: 'Syntax Architect', desc: 'Susun kalimat bahasa Inggris dengan benar.', icon: '🧩' },
  { id: 'shooter_ace', title: 'Sky Defender', desc: 'Selesaikan sesi Penembak Kata dengan menang.', icon: '🛸' },
  { id: 'exam_pro', title: 'Exam Ready', desc: 'Selesaikan simulasi Ujian TOEIC atau IELTS.', icon: '💼' },
  { id: 'lexicon_keeper', title: 'Lexicon Scholar', desc: 'Buka Kamus & Lexicon Laboratory.', icon: '📖' },
  { id: 'custom_creator', title: 'Word Architect', desc: 'Tambahkan kosakata kustom buatanmu sendiri.', icon: '✏️' }
];

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
let examTimerInterval = null;
let examTimeLeft = 15;
let currentExamType = 'toeic';

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
