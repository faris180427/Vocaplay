/* ==============================================================
   VOCAPLAY CORE ENGINE — AUTH, LIVE RANKING, PROFILE & 10 GAMES
   ============================================================== */

const STORAGE_ACCOUNTS_KEY = 'vocaplay_accounts_v1';
const STORAGE_SESSION_KEY = 'vocaplay_session_v1';
const STORAGE_GUEST_KEY = 'vocaplay_guest_v1';

const AVATAR_CHOICES = ['🎓', '🦊', '🦁', '🦉', '🚀', '👩‍🔬', '🧑‍💻', '⚡', '🐼', '🌟', '🐱', '🐸', '🦋', '🔥', '💎', '🎯', '🧠', '👾', '🦄', '🍀'];

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
  { id: 'first_word', title: 'First Lexical Capture', desc: 'Resolve your first target vocabulary token.', icon: '🌱' },
  { id: 'streak_5', title: 'Cognitive Flow', desc: 'Reach a 5-answer combo streak in one session.', icon: '⚡' },
  { id: 'lesson_done', title: 'Lesson Finisher', desc: 'Complete a full 8-round lesson session.', icon: '🏁' },
  { id: 'perfect_game', title: 'Flawless Mastery', desc: 'Finish a lesson with all 3 hearts intact.', icon: '💎' },
  { id: 'c1_conqueror', title: 'C1 Scholar', desc: 'Practice and answer correctly in the C1 corpus.', icon: '🎓' },
  { id: 'voice_master', title: 'Phonetic Articulator', desc: 'Verify pronunciation via Speech Recognition.', icon: '🎙️' },
  { id: 'syntax_architect', title: 'Syntax Architect', desc: 'Construct valid grammatical sentences.', icon: '🧩' },
  { id: 'lexicon_keeper', title: 'Lexicon Scholar', desc: 'Explore the Curated Lexicon Laboratory.', icon: '📖' }
];

const CEFR_CONFIG = {
  A1: { name: 'Foundational', timerSec: 8.0, xpMult: 1.0 },
  A2: { name: 'Elementary', timerSec: 7.5, xpMult: 1.2 },
  B1: { name: 'Intermediate', timerSec: 7.0, xpMult: 1.4 },
  B2: { name: 'Upper-Int', timerSec: 6.5, xpMult: 1.7 },
  C1: { name: 'Advanced', timerSec: 6.0, xpMult: 2.0 },
  ALL: { name: 'Mix All Corpus', timerSec: 7.0, xpMult: 1.5 }
};

/* ---------- GLOBAL STATE ---------- */
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

/* ---------- DATE & HASH HELPERS ---------- */
function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayDayIndex() {
  const day = new Date().getDay(); // 0=Sun..6=Sat
  return day === 0 ? 6 : day - 1; // 0=Mo..6=Su
}

function simpleHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(16);
}

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

function loadSessionUser() {
  const sessionUsername = localStorage.getItem(STORAGE_SESSION_KEY);
  const accounts = loadAllAccounts();
  let loaded = null;

  if (sessionUsername && sessionUsername !== 'guest' && accounts[sessionUsername.toLowerCase()]) {
    loaded = accounts[sessionUsername.toLowerCase()];
  } else if (sessionUsername === 'guest') {
    try {
      loaded = JSON.parse(localStorage.getItem(STORAGE_GUEST_KEY) || 'null');
    } catch { loaded = null; }
  }

  const firstVisit = !sessionUsername;
  if (!loaded) {
    loaded = createFreshProfile({ username: 'guest', name: 'Guest Player', avatar: '👤', isGuest: true });
  }
  applyUserToApp(loaded);

  if (firstVisit) {
    setTimeout(() => openAuthModal('login'), 250);
  }
}

function applyUserToApp(userObj) {
  normalizeDailyMission(userObj);
  currentUser = userObj;
  VOCAB_DATA = [...(userObj.customWords || []), ...getCombinedBaseVocab()];
  currentCEFR = userObj.cefr || 'A1';
  activeDeckId = userObj.deckId || 'ox_a1';
  wordQueues = {};
  setActiveDeck(activeDeckId, true);
  refreshAllUI();
}

/* ---------- AUTH MODAL & PROFILE EDIT ---------- */
function renderAvatarPicker(containerId, hiddenInputId, selectedEmoji) {
  const box = document.getElementById(containerId);
  const hidden = document.getElementById(hiddenInputId);
  if (!box || !hidden) return;
  hidden.value = selectedEmoji;
  box.innerHTML = '';
  AVATAR_CHOICES.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const active = emoji === selectedEmoji;
    btn.className = `w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition ${active ? 'bg-indigo-100 border-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`;
    btn.textContent = emoji;
    btn.onclick = () => {
      playSfx('click');
      renderAvatarPicker(containerId, hiddenInputId, emoji);
    };
    box.appendChild(btn);
  });
}

function openAuthModal(defaultTab = 'login') {
  playSfx('click');
  switchAuthTab(defaultTab);
  renderAvatarPicker('reg-avatar-picker', 'reg-avatar-value', '🎓');
  renderSavedAccountsList();
  document.getElementById('login-error-msg').classList.add('hidden');
  document.getElementById('register-error-msg').classList.add('hidden');
  document.getElementById('modal-auth').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('modal-auth').classList.add('hidden');
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-register');
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    tabLogin.className = 'flex-1 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-xs transition';
    tabReg.className = 'flex-1 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:text-slate-900 transition';
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    tabReg.className = 'flex-1 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-xs transition';
    tabLogin.className = 'flex-1 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:text-slate-900 transition';
  }
}

function renderSavedAccountsList() {
  const accounts = Object.values(loadAllAccounts());
  const section = document.getElementById('saved-accounts-section');
  const list = document.getElementById('saved-accounts-list');
  if (!accounts.length) {
    section.classList.add('hidden');
    return;
  }
  section.classList.remove('hidden');
  list.innerHTML = '';
  accounts.forEach(acc => {
    const isCurrent = currentUser && !currentUser.isGuest && currentUser.username.toLowerCase() === acc.username.toLowerCase();
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `w-full flex items-center justify-between p-2 rounded-xl border text-left transition ${isCurrent ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`;
    row.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-lg">${acc.avatar || '🎓'}</span>
        <div>
          <div class="text-xs font-bold text-slate-900">${acc.name} ${isCurrent ? '<span class="text-[10px] text-indigo-600">(Aktif)</span>' : ''}</div>
          <div class="text-[10px] text-slate-500 font-mono">@${acc.username} • ${acc.xp} XP</div>
        </div>
      </div>
      <span class="text-[10px] font-bold text-indigo-600">Pilih →</span>
    `;
    row.onclick = () => {
      playSfx('click');
      localStorage.setItem(STORAGE_SESSION_KEY, acc.username.toLowerCase());
      applyUserToApp(acc);
      closeAuthModal();
      showToast(`Selamat datang kembali, ${acc.name}!`, acc.avatar || '👋');
    };
    list.appendChild(row);
  });
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errBox = document.getElementById('login-error-msg');
  const pwHash = simpleHash(password);

  if (typeof isCloudEnabled === 'function' && isCloudEnabled()) {
    try {
      const res = await cloudLoginAccount(username, pwHash);
      if (res && res.ok && res.user) {
        const cloudAcc = { ...res.user, passwordHash: pwHash, isGuest: false };
        const accounts = loadAllAccounts();
        accounts[username] = cloudAcc;
        saveAllAccounts(accounts);
        localStorage.setItem(STORAGE_SESSION_KEY, username);
        applyUserToApp(cloudAcc);
        closeAuthModal();
        playSfx('correct');
        showToast(`Cloud Login berhasil! Halo, ${cloudAcc.name}`, cloudAcc.avatar || '☁️');
        return;
      } else if (res && res.error) {
        errBox.textContent = res.error;
        errBox.classList.remove('hidden');
        playSfx('wrong');
        return;
      }
    } catch (err) {
      console.warn('Cloud login fallback to local:', err);
    }
  }

  const accounts = loadAllAccounts();
  const acc = accounts[username];

  if (!acc || acc.passwordHash !== pwHash) {
    errBox.textContent = 'Username atau password tidak cocok.';
    errBox.classList.remove('hidden');
    playSfx('wrong');
    return;
  }

  localStorage.setItem(STORAGE_SESSION_KEY, username);
  applyUserToApp(acc);
  closeAuthModal();
  playSfx('correct');
  showToast(`Login berhasil! Halo, ${acc.name}`, acc.avatar || '🎉');
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const usernameRaw = document.getElementById('reg-username').value.trim();
  const username = usernameRaw.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const password = document.getElementById('reg-password').value;
  const avatar = document.getElementById('reg-avatar-value').value || '🎓';
  const errBox = document.getElementById('register-error-msg');

  if (username.length < 3) {
    errBox.textContent = 'Username minimal 3 karakter (huruf/angka/underscore).';
    errBox.classList.remove('hidden');
    return;
  }

  const pwHash = simpleHash(password);
  const newUser = createFreshProfile({
    username,
    name,
    passwordHash: pwHash,
    avatar,
    isGuest: false
  });
  newUser.cefr = currentCEFR;
  newUser.deckId = activeDeckId;

  if (typeof isCloudEnabled === 'function' && isCloudEnabled()) {
    try {
      const res = await cloudRegisterAccount(username, name, pwHash, avatar, newUser.joinedDate);
      if (res && res.ok && res.user) {
        const cloudAcc = { ...newUser, ...res.user, passwordHash: pwHash, isGuest: false };
        const accounts = loadAllAccounts();
        accounts[username] = cloudAcc;
        saveAllAccounts(accounts);
        localStorage.setItem(STORAGE_SESSION_KEY, username);
        applyUserToApp(cloudAcc);
        closeAuthModal();
        playSfx('fanfare');
        showToast(`Akun Cloud @${username} berhasil dibuat!`, '☁️');
        return;
      } else if (res && res.error) {
        errBox.textContent = res.error;
        errBox.classList.remove('hidden');
        return;
      }
    } catch (err) {
      console.warn('Cloud register fallback to local:', err);
    }
  }

  const accounts = loadAllAccounts();
  if (accounts[username]) {
    errBox.textContent = 'Username sudah terdaftar. Silakan gunakan tab Masuk.';
    errBox.classList.remove('hidden');
    return;
  }

  accounts[username] = newUser;
  saveAllAccounts(accounts);
  localStorage.setItem(STORAGE_SESSION_KEY, username);
  applyUserToApp(newUser);
  closeAuthModal();
  playSfx('fanfare');
  showToast(`Akun @${username} berhasil dibuat!`, avatar);
}

function continueAsGuest() {
  playSfx('click');
  localStorage.setItem(STORAGE_SESSION_KEY, 'guest');
  if (!currentUser || !currentUser.isGuest) {
    let guestData = null;
    try { guestData = JSON.parse(localStorage.getItem(STORAGE_GUEST_KEY) || 'null'); } catch {}
    if (!guestData) guestData = createFreshProfile({ username: 'guest', name: 'Guest Player', avatar: '👤', isGuest: true });
    applyUserToApp(guestData);
  }
  closeAuthModal();
  showToast('Bermain sebagai Tamu (tersimpan lokal)', '👤');
}

function logoutAccount() {
  playSfx('click');
  saveCurrentAccountState();
  localStorage.setItem(STORAGE_SESSION_KEY, 'guest');
  const guestData = createFreshProfile({ username: 'guest', name: 'Guest Player', avatar: '👤', isGuest: true });
  applyUserToApp(guestData);
  showToast('Berhasil keluar dari akun.', '🚪');
  openAuthModal('login');
}

function openEditProfileModal() {
  if (!currentUser) return;
  if (currentUser.isGuest) {
    showToast('Daftar/login akun dulu untuk mengedit profil permanen!', '🔐');
    openAuthModal('register');
    return;
  }
  playSfx('click');
  document.getElementById('edit-prof-name').value = currentUser.name;
  document.getElementById('edit-prof-bio').value = currentUser.bio || '';
  renderAvatarPicker('edit-avatar-picker', 'edit-avatar-value', currentUser.avatar || '🎓');
  document.getElementById('modal-edit-profile').classList.remove('hidden');
}

function closeEditProfileModal() {
  document.getElementById('modal-edit-profile').classList.add('hidden');
}

function handleSaveProfileEdit(e) {
  e.preventDefault();
  if (!currentUser || currentUser.isGuest) return;
  currentUser.name = document.getElementById('edit-prof-name').value.trim() || currentUser.name;
  currentUser.bio = document.getElementById('edit-prof-bio').value.trim();
  currentUser.avatar = document.getElementById('edit-avatar-value').value || currentUser.avatar;
  saveCurrentAccountState();
  refreshAllUI();
  closeEditProfileModal();
  playSfx('correct');
  showToast('Profil berhasil diperbarui!', '✓');
}

/* ---------- LIVE LEADERBOARD / RANKING ---------- */
function setLeaderboardPeriod(period) {
  playSfx('click');
  leaderboardPeriod = period;
  ['weekly', 'monthly', 'alltime'].forEach(p => {
    const btn = document.getElementById(`lb-tab-${p}`);
    if (btn) {
      btn.className = p === period
        ? 'flex-1 py-1.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-xs transition'
        : 'flex-1 py-1.5 rounded-xl text-slate-600 font-medium text-xs hover:text-slate-900 transition';
    }
  });
  renderLeaderboard();
}

function getRankedEntries(period = leaderboardPeriod) {
  const cloudRows = (typeof cachedCloudLeaderboard !== 'undefined' && Array.isArray(cachedCloudLeaderboard[period]))
    ? cachedCloudLeaderboard[period]
    : null;

  const byUsername = new Map();
  if (cloudRows && cloudRows.length > 0) {
    cloudRows.forEach(r => byUsername.set(r.username.toLowerCase(), { ...r, isRegistered: true }));
    if (cloudRows.length < 3) {
      NPC_COMPETITORS.forEach(npc => {
        if (!byUsername.has(npc.username)) byUsername.set(npc.username, npc);
      });
    }
  } else {
    NPC_COMPETITORS.forEach(npc => byUsername.set(npc.username, npc));
    Object.values(loadAllAccounts()).forEach(acc => {
      byUsername.set(acc.username.toLowerCase(), {
        username: acc.username,
        name: acc.name,
        avatar: acc.avatar || '🎓',
        cefr: acc.cefr || 'A1',
        xp: acc.xp || 0,
        weeklyXP: acc.weeklyXP || 0,
        monthlyXP: acc.monthlyXP || 0,
        isRegistered: true
      });
    });
  }

  if (currentUser) {
    byUsername.set(currentUser.username.toLowerCase(), {
      username: currentUser.username,
      name: currentUser.name,
      avatar: currentUser.avatar || '👤',
      cefr: currentUser.cefr || 'A1',
      xp: currentUser.xp || 0,
      weeklyXP: currentUser.weeklyXP || 0,
      monthlyXP: currentUser.monthlyXP || 0,
      isGuest: currentUser.isGuest
    });
  }

  const allUsers = Array.from(byUsername.values());
  const key = period === 'weekly' ? 'weeklyXP' : (period === 'monthly' ? 'monthlyXP' : 'xp');
  allUsers.sort((a, b) => (b[key] || 0) - (a[key] || 0));
  return allUsers.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
    displayXP: entry[key] || 0,
    isMe: currentUser && entry.username.toLowerCase() === currentUser.username.toLowerCase()
  }));
}

let cloudLbFetching = false;
function renderLeaderboard(skipCloudRefresh = false) {
  if (!skipCloudRefresh && !cloudLbFetching && typeof isCloudEnabled === 'function' && isCloudEnabled()) {
    cloudLbFetching = true;
    cloudFetchLeaderboard(leaderboardPeriod).then(rows => {
      cloudLbFetching = false;
      if (rows) renderLeaderboard(true);
    });
  }

  const ranked = getRankedEntries(leaderboardPeriod);
  const me = ranked.find(r => r.isMe) || ranked[ranked.length - 1];

  const myRankPill = document.getElementById('lb-my-rank-pill');
  if (myRankPill && me) myRankPill.textContent = `#${me.rank}`;

  const bannerName = document.getElementById('lb-banner-name');
  const bannerSub = document.getElementById('lb-banner-sub');
  const cloudTag = (typeof isCloudEnabled === 'function' && isCloudEnabled()) ? '☁️ Online' : '📱 Lokal';
  if (bannerName && me) bannerName.textContent = `${me.name} • Peringkat #${me.rank} dari ${ranked.length} (${cloudTag})`;
  if (bannerSub && me) bannerSub.textContent = `${me.displayXP} XP (${leaderboardPeriod === 'weekly' ? 'Minggu Ini' : leaderboardPeriod === 'monthly' ? 'Bulan Ini' : 'Sepanjang Waktu'})`;

  const podium = document.getElementById('leaderboard-podium');
  const list = document.getElementById('leaderboard-list');
  if (!podium || !list) return;

  const top3 = [ranked[1], ranked[0], ranked[2]].filter(Boolean);
  podium.innerHTML = '';
  top3.forEach(entry => {
    const isFirst = entry.rank === 1;
    const col = document.createElement('div');
    col.className = 'flex flex-col items-center';
    const ring = entry.isMe ? 'ring-4 ring-sky-400' : '';
    const barColor = isFirst ? 'bg-indigo-600 text-white h-28 w-20' : (entry.rank === 2 ? 'bg-sky-500/20 text-sky-400 h-20 w-16 border border-sky-400/30' : 'bg-orange-500/20 text-orange-400 h-16 w-16 border border-orange-400/30');
    col.innerHTML = `
      ${isFirst ? '<span class="text-xl mb-1 animate-bounce">👑</span>' : ''}
      <div class="${isFirst ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-xl'} rounded-full app-subsurface border-2 ${isFirst ? 'border-amber-400' : 'border-slate-400/40'} ${ring} flex items-center justify-center shadow-sm">
        ${entry.avatar}
      </div>
      <span class="text-xs font-bold mt-1 max-w-[80px] truncate">${entry.isMe ? 'You' : entry.name}</span>
      <span class="code-font text-[10px] ${isFirst ? 'text-amber-400 font-extrabold' : 'text-sky-400 font-bold'}">${entry.displayXP} XP</span>
      <div class="${barColor} rounded-t-2xl flex items-center justify-center text-2xl font-black mt-2 shadow-sm">${entry.rank}</div>
    `;
    podium.appendChild(col);
  });

  list.innerHTML = '';
  ranked.slice(3).forEach(entry => {
    const row = document.createElement('div');
    row.className = entry.isMe
      ? 'flex items-center justify-between p-3 rounded-2xl bg-sky-500/15 border border-sky-400/40 shadow-xs'
      : 'flex items-center justify-between p-3 rounded-2xl hover:bg-slate-500/10 transition';
    row.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="font-mono font-bold text-xs ${entry.isMe ? 'text-sky-400' : 'text-slate-400'} w-5">${entry.rank}</span>
        <div class="w-8 h-8 rounded-full app-subsurface border border-slate-400/30 flex items-center justify-center text-sm shadow-xs">${entry.avatar}</div>
        <div>
          <span class="text-xs font-bold">${entry.name} ${entry.isMe ? '<span class="text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded ml-1">YOU</span>' : ''}</span>
          <span class="text-[10px] text-slate-400 block font-mono">CEFR ${entry.cefr}</span>
        </div>
      </div>
      <span class="code-font text-xs font-bold ${entry.isMe ? 'text-sky-400' : 'text-slate-400'}">${entry.displayXP} XP</span>
    `;
    list.appendChild(row);
  });
}

/* ---------- LIVE PROFILE & DAILY MISSIONS ---------- */
function renderProfile() {
  if (!currentUser) return;
  normalizeDailyMission(currentUser);
  const ranked = getRankedEntries('weekly');
  const me = ranked.find(r => r.isMe);
  const myRankStr = me ? `#${me.rank}` : '#—';
  const acc = currentUser.totalAnswered > 0 ? Math.round((currentUser.totalCorrect / currentUser.totalAnswered) * 100) : 100;

  document.getElementById('profile-avatar').textContent = currentUser.avatar || '🎓';
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-username').textContent = currentUser.isGuest ? '@guest • Mode Tamu (belum login)' : `@${currentUser.username} • Akun Terdaftar`;
  document.getElementById('profile-joined').textContent = `Joined Vocaplay • ${currentUser.joinedDate}`;
  document.getElementById('profile-bio').textContent = `"${currentUser.bio || 'Building English fluency one word at a time.'}"`;

  const logoutBtn = document.getElementById('btn-logout-account');
  if (logoutBtn) logoutBtn.classList.toggle('hidden', !!currentUser.isGuest);

  document.getElementById('profile-words-mastered').textContent = currentUser.masteredWords.length;
  document.getElementById('profile-games-played').textContent = currentUser.gamesPlayed;
  document.getElementById('profile-total-xp').textContent = currentUser.xp;

  document.getElementById('stat-streak').textContent = `${currentUser.streak} Days`;
  document.getElementById('stat-gems').textContent = currentUser.coins;
  document.getElementById('stat-xp').textContent = `${currentUser.xp} XP`;
  document.getElementById('stat-league-rank').textContent = myRankStr;
  document.getElementById('stat-accuracy').textContent = `${acc}%`;
  document.getElementById('profile-achievements-btn-text').textContent = `View Achievements (${currentUser.unlockedBadges.length} / ${ACHIEVEMENTS.length})`;

  updateWeakWordsUI();
}

function renderQuests() {
  if (!currentUser) return;
  normalizeDailyMission(currentUser);
  const dm = currentUser.dailyMission;

  document.getElementById('quests-streak-title').textContent = `${currentUser.streak} ${currentUser.streak === 1 ? 'day' : 'days'} straight!`;
  document.getElementById('quests-date-label').textContent = dm.date;

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const weekGrid = document.getElementById('quests-week-grid');
  if (weekGrid) {
    weekGrid.innerHTML = '';
    days.forEach((d, idx) => {
      const done = currentUser.weekDaysActive[idx];
      const cell = document.createElement('div');
      cell.className = done
        ? 'flex flex-col items-center p-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-xs'
        : 'flex flex-col items-center p-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs';
      cell.innerHTML = `<span class="text-[10px] ${done ? 'opacity-85' : 'text-slate-400'}">${d}</span><span>${done ? '✓' : '○'}</span>`;
      weekGrid.appendChild(cell);
    });
  }

  const missions = [
    { id: 'm_gems', icon: '💎', bg: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500', title: 'Collect 15 Diamonds Today', cur: dm.diamondsToday, max: 15, rewardText: '+30 XP', rewardXP: 30, rewardCoins: 0 },
    { id: 'm_xp', icon: '⚡', bg: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', title: 'Earn 50 XP Today', cur: dm.xpToday, max: 50, rewardText: '+15 💎', rewardXP: 0, rewardCoins: 15 },
    { id: 'm_games', icon: '🎯', bg: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', title: 'Complete 2 Lessons Today', cur: dm.gamesToday, max: 2, rewardText: '+20 💎', rewardXP: 0, rewardCoins: 20 }
  ];

  const list = document.getElementById('quests-missions-list');
  if (!list) return;
  list.innerHTML = '';
  missions.forEach(m => {
    const pct = Math.min(100, Math.round((m.cur / m.max) * 100));
    const isComplete = m.cur >= m.max;
    const isClaimed = dm.claimed.includes(m.id);

    const card = document.createElement('div');
    card.className = 'flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100';
    card.innerHTML = `
      <div class="w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center text-lg flex-shrink-0">${m.icon}</div>
      <div class="flex-grow">
        <div class="flex justify-between text-xs font-bold text-slate-800">
          <span>${m.title}</span>
          <span class="font-mono text-slate-500">${Math.min(m.cur, m.max)} / ${m.max}</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
          <div class="${m.bar} h-full rounded-full transition-all duration-300" style="width: ${pct}%;"></div>
        </div>
      </div>
      <div class="flex-shrink-0">
        ${isClaimed
          ? '<span class="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">Claimed ✓</span>'
          : (isComplete
            ? `<button onclick="claimDailyMission('${m.id}', ${m.rewardXP}, ${m.rewardCoins})" class="tactile-btn text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-xl">Claim ${m.rewardText}</button>`
            : `<span class="text-[10px] font-mono text-slate-400">${m.rewardText}</span>`)
        }
      </div>
    `;
    list.appendChild(card);
  });
}

function claimDailyMission(id, xpBonus, coinsBonus) {
  if (!currentUser) return;
  normalizeDailyMission(currentUser);
  if (currentUser.dailyMission.claimed.includes(id)) return;
  currentUser.dailyMission.claimed.push(id);
  currentUser.xp += xpBonus;
  currentUser.weeklyXP += xpBonus;
  currentUser.monthlyXP += xpBonus;
  currentUser.coins += coinsBonus;
  saveCurrentAccountState();
  playSfx('fanfare');
  triggerConfetti();
  refreshAllUI();
  showToast(`Reward claimed! ${xpBonus ? '+' + xpBonus + ' XP' : '+' + coinsBonus + ' 💎'}`, '🎁');
}

function refreshAllUI() {
  updateHeaderStats();
  renderProfile();
  renderQuests();
  renderLeaderboard();
}

/* ---------- THEME, QUICK SEARCH, NAVIGATION & DECKS ---------- */
function stopAllActiveGameTimers() {
  clearInterval(fastVocabTimerInterval);
  clearInterval(shooterInterval);
  clearInterval(shooterSpawnInterval);
  clearInterval(examTimerInterval);
}

function initTheme() {
  const saved = localStorage.getItem('vocaplay_theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('theme-dark', isDark);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('vocaplay_theme', theme);
}

function toggleAppTheme() {
  playSfx('click');
  const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
  applyTheme(next);
}

function openQuickDictionary(query) {
  openNotebookModal();
  const inp = document.getElementById('notebook-search-input');
  if (inp) {
    inp.value = (query || '').trim();
    filterNotebookWords();
  }
}

function switchAppTab(tabId) {
  playSfx('click');
  stopAllActiveGameTimers();

  ['tab-learn', 'tab-decks', 'tab-quests', 'tab-leaderboard', 'tab-profile', 'screen-gameplay', 'screen-results'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.remove('hidden');

  ['learn', 'decks', 'quests', 'leaderboard', 'profile'].forEach(name => {
    const btn = document.getElementById(`nav-btn-${name}`);
    if (btn) btn.className = name === tabId ? 'flex flex-col items-center text-sky-400 p-1' : 'flex flex-col items-center text-slate-400 p-1';
    const side = document.getElementById(`side-btn-${name}`);
    if (side) side.className = name === tabId
      ? 'sidebar-link-active flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left'
      : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100/10 transition text-left';
  });

  ['listening', 'speaking', 'vocab', 'toeic', 'ielts'].forEach(s => {
    const el = document.getElementById(`side-btn-${s}`);
    if (el) el.className = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100/10 transition text-left';
  });

  if (tabId === 'decks') renderDecksHub();
  if (tabId === 'leaderboard') renderLeaderboard();
  if (tabId === 'profile') renderProfile();
  if (tabId === 'quests') renderQuests();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterHubSection(section) {
  switchAppTab('learn');
  ['all', 'vocab', 'listening', 'speaking', 'exam'].forEach(s => {
    const pill = document.getElementById(`hub-pill-${s}`);
    if (pill) {
      pill.className = s === section
        ? 'tactile-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500 text-white'
        : 'tactile-btn px-3 py-1.5 rounded-xl text-xs font-semibold app-surface border border-slate-200';
    }
  });
  document.querySelectorAll('.game-hub-card').forEach(card => {
    const cat = card.dataset.hubCat;
    card.classList.toggle('hidden', section !== 'all' && cat !== section);
  });
  if (['listening', 'speaking', 'vocab'].includes(section)) {
    const sideLearn = document.getElementById('side-btn-learn');
    if (sideLearn) sideLearn.className = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100/10 transition text-left';
    const sideBtn = document.getElementById(`side-btn-${section}`);
    if (sideBtn) sideBtn.className = 'sidebar-link-active flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left';
  }
}

function goToHome() {
  playSfx('click');
  stopAllActiveGameTimers();
  switchAppTab('learn');
}

function exitToHome() {
  goToHome();
}

function updateHeaderStats() {
  if (!currentUser) return;
  const xp = currentUser.xp || 0;
  const rankTier = xp >= 1000 ? 'Master' : (xp >= 400 ? 'Scholar' : (xp >= 150 ? 'Proficient' : 'Explorer'));
  const levelPct = xp % 100;

  document.getElementById('user-streak-header').textContent = currentUser.streak || 0;
  document.getElementById('user-coins-count').textContent = currentUser.coins || 0;
  document.getElementById('user-level-badge').textContent = `Rank: ${rankTier}`;
  document.getElementById('user-xp-bar').style.width = `${levelPct}%`;

  const avatar = currentUser.avatar || '👤';
  const nameText = currentUser.isGuest ? 'Masuk' : currentUser.name;
  document.getElementById('header-account-avatar').textContent = avatar;
  document.getElementById('header-account-name').textContent = nameText;
  const sideAvatar = document.getElementById('sidebar-account-avatar');
  const sideLabel = document.getElementById('sidebar-account-label');
  if (sideAvatar) sideAvatar.textContent = avatar;
  if (sideLabel) sideLabel.textContent = currentUser.isGuest ? 'MASUK / DAFTAR' : `${currentUser.name} (${xp} XP)`;

  document.getElementById('banner-streak-text').textContent = `🔥 ${currentUser.streak || 0} Days Streak`;
  document.getElementById('banner-user-greeting').textContent = currentUser.isGuest ? 'Guest Mode (Simpan via Masuk)' : `Hi, ${currentUser.name}`;

  const curScore = document.getElementById('gameplay-current-score');
  if (curScore) curScore.textContent = `${score} pts`;

  const livesContainer = document.getElementById('gameplay-lives-container');
  if (livesContainer) {
    livesContainer.innerHTML = '';
    const maxLives = currentMode === 'memory-flip' ? 6 : 3;
    for (let i = 0; i < maxLives; i++) {
      const dot = document.createElement('span');
      dot.className = `w-2.5 h-2.5 rounded-full transition-colors ${i < lives ? 'bg-rose-500' : 'bg-slate-600/40'}`;
      livesContainer.appendChild(dot);
    }
  }
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

/* ---------- DECKS, CEFR & SHUFFLE-BAG QUEUE ---------- */
function setActiveDeck(deckId, silent = false) {
  if (!silent) playSfx('click');
  const deck = VOCAB_DECKS.find(d => d.id === deckId) || VOCAB_DECKS[2];
  activeDeckId = deck.id;
  currentCEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'ALL'].includes(deck.cefr) ? deck.cefr : 'ALL';
  if (currentUser) {
    currentUser.deckId = activeDeckId;
    currentUser.cefr = currentCEFR;
    if (!silent) saveCurrentAccountState();
  }
  const iconEl = document.getElementById('active-deck-icon');
  const titleEl = document.getElementById('active-deck-title');
  if (iconEl) iconEl.textContent = deck.icon;
  if (titleEl) titleEl.textContent = deck.title;

  currentCategory = 'All';
  initCategoryPills();
  updateAvailableCorpusCount();
  if (!silent) showToast(`Dek aktif: ${deck.title}`, deck.icon);
}

function setCEFRLevel(levelKey, silent = false) {
  const map = { A1: 'ox_a1', A2: 'ox_a2', B1: 'ox_b1', B2: 'ox_b2', C1: 'ox_c1', ALL: 'all' };
  setActiveDeck(map[levelKey] || 'ox_a1', silent);
}

function renderDecksGrid(containerId, onSelectDeck) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  const weakList = currentUser ? currentUser.weakWords : [];
  const allDecks = weakList.length
    ? [...VOCAB_DECKS, { id: 'weak_vault', title: 'Memory Vault (Kata Lemah)', desc: 'Latih ulang kata yang pernah salah', color: 'from-rose-500 to-red-600', icon: '🧠', tag: 'Review', cefr: 'MIX' }]
    : VOCAB_DECKS;

  allDecks.forEach(deck => {
    const count = getDeckVocab(deck.id, VOCAB_DATA, weakList).length;
    const isActive = deck.id === activeDeckId;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `tactile-btn app-surface text-left rounded-2xl p-4 border transition flex items-start gap-3.5 ${isActive ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-200 hover:border-sky-400/60'}`;
    card.innerHTML = `
      <div class="w-12 h-14 rounded-xl bg-gradient-to-br ${deck.color} text-white flex flex-col items-center justify-center shadow-sm flex-shrink-0">
        <span class="text-xl">${deck.icon}</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-1.5">
          <span class="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/15 px-1.5 py-0.5 rounded">${deck.tag}</span>
          ${isActive ? '<span class="text-[10px] font-bold text-emerald-400">✓ Aktif</span>' : ''}
        </div>
        <h4 class="text-xs font-extrabold mt-1 truncate">${deck.title}</h4>
        <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">${deck.desc}</p>
        <div class="text-[11px] font-mono font-bold text-sky-400 mt-1.5">${count.toLocaleString()} kartu</div>
      </div>
    `;
    card.onclick = () => onSelectDeck(deck);
    grid.appendChild(card);
  });
}

function renderDecksHub() {
  const pill = document.getElementById('decks-total-words-pill');
  if (pill) pill.textContent = `${VOCAB_DATA.length.toLocaleString()} Kartu Tersedia`;
  renderDecksGrid('decks-full-grid', (deck) => {
    setActiveDeck(deck.id);
    switchAppTab('learn');
  });
}

function openDeckPickerModal(targetMode = null) {
  playSfx('click');
  pendingDeckGameMode = targetMode;
  const sub = document.getElementById('deck-picker-subtitle');
  if (sub) {
    sub.textContent = targetMode
      ? `Pilih dek untuk langsung bermain (${VOCAB_DATA.length.toLocaleString()} kata tersedia gratis)`
      : `Pilih paket kosakata aktif untuk semua game (${VOCAB_DATA.length.toLocaleString()} kata tersedia gratis)`;
  }
  renderDecksGrid('deck-picker-grid', (deck) => {
    setActiveDeck(deck.id);
    closeDeckPickerModal();
    if (pendingDeckGameMode) startGame(pendingDeckGameMode);
  });
  document.getElementById('modal-deck-picker').classList.remove('hidden');
}

function closeDeckPickerModal() {
  document.getElementById('modal-deck-picker').classList.add('hidden');
}

function getFilteredVocab() {
  const weakList = currentUser ? currentUser.weakWords : [];
  if (isPracticingWeakWords && weakList.length > 0) return weakList;
  let pool = getDeckVocab(activeDeckId, VOCAB_DATA, weakList);
  if (currentCategory !== 'All') {
    const catPool = pool.filter(v => v.category === currentCategory);
    if (catPool.length) pool = catPool;
  }
  return pool.length ? pool : VOCAB_DATA;
}

function drawNextWord(pool) {
  if (!pool || !pool.length) return null;
  const key = `${currentMode}|${activeDeckId}|${currentCategory}|${isPracticingWeakWords ? 'weak' : 'all'}`;
  if (!wordQueues[key] || wordQueues[key].length === 0) {
    const fresh = [...pool].sort(() => Math.random() - 0.5);
    if (fresh.length > 1 && fresh[0].id === lastDrawnId) {
      fresh.push(fresh.shift());
    }
    wordQueues[key] = fresh;
  }
  const picked = wordQueues[key].shift();
  lastDrawnId = picked.id;
  return picked;
}

function initCategoryPills() {
  const container = document.getElementById('category-pill-container');
  if (!container) return;
  const weakList = currentUser ? currentUser.weakWords : [];
  const deckWords = getDeckVocab(activeDeckId, VOCAB_DATA, weakList);
  const categories = ['All', ...new Set(deckWords.map(v => v.category))];
  container.innerHTML = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    const isActive = cat === currentCategory;
    btn.className = `tactile-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition border ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'app-surface border-slate-200 text-slate-500'}`;
    btn.textContent = cat;
    btn.onclick = () => {
      playSfx('click');
      currentCategory = cat;
      initCategoryPills();
      updateAvailableCorpusCount();
    };
    container.appendChild(btn);
  });
}

function updateAvailableCorpusCount() {
  const pool = getFilteredVocab();
  const label = document.getElementById('pool-count-label');
  if (label) label.textContent = `${pool.length.toLocaleString()} kartu siap dimainkan`;
}

/* ---------- SOUND & SPEECH ---------- */
let audioCtx = null;
let sfxEnabled = localStorage.getItem('vocaplay_sfx') !== 'off';

function updateSfxToggleUI() {
  const btn = document.getElementById('btn-sfx-toggle');
  if (btn) btn.textContent = sfxEnabled ? '🔊' : '🔇';
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  localStorage.setItem('vocaplay_sfx', sfxEnabled ? 'on' : 'off');
  updateSfxToggleUI();
  if (sfxEnabled) playSfx('click');
  showToast(sfxEnabled ? 'Efek suara aktif' : 'Efek suara dimatikan', sfxEnabled ? '🔊' : '🔇');
}

function getAudioContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playSfx(type) {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (type === 'click') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);
      gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 0.03);
    } else if (type === 'correct') {
      [698.46, 880.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06); gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.22);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
      gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'fanfare') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08); gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.35);
      });
    }
  } catch {}
}

function speakText(text, rate = 0.85) {
  if ('speechSynthesis' in window && text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate; u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }
}

function replayTargetAudio() {
  if (currentItem) speakText(currentItem.word, 0.85);
}

/* ---------- SCORING, PROGRESS & SESSION COMPLETION ---------- */
function updateRoundProgressUI() {
  const maxR = currentMode === 'memory-flip' ? 3 : MAX_ROUNDS;
  const shown = Math.min(roundNumber, maxR);
  document.getElementById('gameplay-round-badge').textContent = `${shown} / ${maxR}`;
  document.getElementById('gameplay-progress-bar').style.width = `${Math.round((shown / maxR) * 100)}%`;
}

function advanceOrFinishRound(nextCallback, delayMs = 800) {
  const maxR = currentMode === 'memory-flip' ? 3 : MAX_ROUNDS;
  if (lives <= 0) return;
  if (roundNumber >= maxR) {
    setTimeout(endGameSession, Math.min(delayMs, 900));
  } else {
    setTimeout(nextCallback, delayMs);
  }
}

function addSuccessScore(points) {
  playSfx('correct');
  streak++;
  totalQuestionsAnswered++;
  correctAnswersCount++;

  const tier = (currentItem && currentItem.cefr) || (currentCEFR === 'ALL' ? 'B1' : currentCEFR);
  const conf = CEFR_CONFIG[tier] || CEFR_CONFIG.A1;
  const streakMultiplier = streak >= 5 ? 2.0 : (streak >= 3 ? 1.5 : 1.0);
  if (streak >= 5) unlockBadge('streak_5');

  const earned = Math.round(points * conf.xpMult * streakMultiplier);
  const xpGain = Math.round(15 * conf.xpMult);
  const gemGain = 2;

  score += earned;
  sessionXP += xpGain;
  sessionDiamonds += gemGain;

  if (currentUser) {
    normalizeDailyMission(currentUser);
    currentUser.xp += xpGain;
    currentUser.weeklyXP += xpGain;
    currentUser.monthlyXP += xpGain;
    currentUser.coins += gemGain;
    currentUser.totalAnswered++;
    currentUser.totalCorrect++;
    currentUser.dailyMission.xpToday += xpGain;
    currentUser.dailyMission.diamondsToday += gemGain;

    if (currentItem && !currentUser.masteredWords.includes(currentItem.id)) {
      currentUser.masteredWords.push(currentItem.id);
    }
    if (isPracticingWeakWords && currentItem) {
      currentUser.weakWords = currentUser.weakWords.filter(w => w.id !== currentItem.id);
    }
    saveCurrentAccountState();
  }

  updateHeaderStats();
  unlockBadge('first_word');
  if (tier === 'C1') unlockBadge('c1_conqueror');

  const streakBanner = document.getElementById('streak-banner');
  const streakText = document.getElementById('streak-text');
  if (streak >= 2 && streakBanner && streakText) {
    streakText.textContent = `Combo x${streakMultiplier} (+${earned} pts)`;
    streakBanner.classList.remove('opacity-0');
    setTimeout(() => streakBanner.classList.add('opacity-0'), 1400);
  }
}

function handleMistake(item) {
  playSfx('wrong');
  streak = 0;
  totalQuestionsAnswered++;
  lives--;

  if (currentUser) {
    currentUser.totalAnswered++;
    if (item && !currentUser.weakWords.some(w => w.id === item.id)) {
      currentUser.weakWords.push(item);
    }
    saveCurrentAccountState();
  }
  if (item) reviewWordsList.add(item);

  updateHeaderStats();
  const streakBanner = document.getElementById('streak-banner');
  if (streakBanner) streakBanner.classList.add('opacity-0');

  if (lives <= 0) {
    clearInterval(fastVocabTimerInterval);
    setTimeout(endGameSession, 600);
  }
}

function updateWeakWordsUI() {
  const countLabel = document.getElementById('weak-words-count');
  const listEl = document.getElementById('weak-words-list');
  const btnPractice = document.getElementById('btn-practice-weak');
  if (!listEl || !currentUser) return;

  const list = currentUser.weakWords || [];
  countLabel.textContent = `${list.length} Missed`;
  if (list.length > 0) {
    listEl.innerHTML = '';
    list.forEach(w => {
      const chip = document.createElement('span');
      chip.className = 'px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-mono rounded-lg';
      chip.textContent = `${w.word} (${w.meaning})`;
      listEl.appendChild(chip);
    });
    if (btnPractice) btnPractice.classList.remove('hidden');
  } else {
    listEl.innerHTML = `<span class="text-xs text-slate-400 italic">No missed words yet. Perfect retention!</span>`;
    if (btnPractice) btnPractice.classList.add('hidden');
  }
}

function practiceWeakWords() {
  if (!currentUser || !currentUser.weakWords.length) return;
  playSfx('click');
  isPracticingWeakWords = true;
  showToast(`Reinforcing ${currentUser.weakWords.length} weak words!`, '🧠');
  startGame('fast-vocab', true);
}

function endGameSession() {
  stopAllActiveGameTimers();
  playSfx('fanfare');
  triggerConfetti();

  const elapsedSec = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
  const mins = Math.floor(elapsedSec / 60);
  const secs = String(elapsedSec % 60).padStart(2, '0');

  const isWin = lives > 0;
  const bonusXP = isWin ? 25 : 5;
  const bonusGems = isWin ? 5 : 1;
  sessionXP += bonusXP;
  sessionDiamonds += bonusGems;

  if (currentUser) {
    normalizeDailyMission(currentUser);
    currentUser.xp += bonusXP;
    currentUser.weeklyXP += bonusXP;
    currentUser.monthlyXP += bonusXP;
    currentUser.coins += bonusGems;
    currentUser.gamesPlayed++;
    if (isWin && lives === 3) {
      currentUser.perfectGames++;
      unlockBadge('perfect_game');
    }
    if (isWin) unlockBadge('lesson_done');

    currentUser.dailyMission.xpToday += bonusXP;
    currentUser.dailyMission.diamondsToday += bonusGems;
    currentUser.dailyMission.gamesToday++;

    const today = getTodayISO();
    if (currentUser.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000);
      const yISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      currentUser.streak = currentUser.lastActiveDate === yISO ? currentUser.streak + 1 : 1;
      currentUser.lastActiveDate = today;
    }
    currentUser.weekDaysActive[getMondayDayIndex()] = true;
    saveCurrentAccountState();
  }

  refreshAllUI();
  const ranked = getRankedEntries('weekly');
  const me = ranked.find(r => r.isMe);

  document.getElementById('results-title').textContent = isWin ? 'Lesson completed!' : 'Session finished!';
  document.getElementById('results-subtitle').textContent = currentUser && !currentUser.isGuest
    ? `Progress saved to @${currentUser.username}!`
    : 'Saved locally. Login to keep your account progress!';
  document.getElementById('results-diamonds-earned').textContent = `+${sessionDiamonds}`;
  document.getElementById('summary-final-score').textContent = `+${sessionXP} XP`;
  document.getElementById('summary-time-spent').textContent = `${mins}:${secs}`;
  const acc = totalQuestionsAnswered > 0 ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100) : 100;
  document.getElementById('summary-accuracy').textContent = `${acc}%`;
  document.getElementById('results-streak-text').textContent = `${currentUser ? currentUser.streak : 1} day streak!`;
  document.getElementById('results-rank-badge').textContent = me ? `Weekly Rank #${me.rank}` : 'Ranked';

  const reviewContainer = document.getElementById('review-words-container');
  const reviewChips = document.getElementById('review-words-chips');
  if (reviewWordsList.size > 0) {
    reviewContainer.classList.remove('hidden');
    reviewChips.innerHTML = '';
    reviewWordsList.forEach(w => {
      const chip = document.createElement('div');
      chip.className = 'px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs flex items-center gap-1.5 shadow-xs';
      chip.innerHTML = `<span class="code-font font-bold text-slate-800">${w.word}</span> <span class="text-slate-400 text-[11px]">(${w.meaning})</span>`;
      reviewChips.appendChild(chip);
    });
  } else {
    reviewContainer.classList.add('hidden');
  }

  isPracticingWeakWords = false;

  ['tab-learn', 'tab-decks', 'tab-quests', 'tab-leaderboard', 'tab-profile', 'screen-gameplay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('screen-results').classList.remove('hidden');
}

/* ---------- GAME EXECUTION CONTROLLER ---------- */
function startExamMode(examType) {
  currentExamType = examType === 'ielts' ? 'ielts' : 'toeic';
  setActiveDeck(currentExamType, true);
  startGame('exam-quiz');
}

function startGame(mode, keepWeakFlag = false) {
  playSfx('click');
  getAudioContext();
  stopAllActiveGameTimers();
  if (!keepWeakFlag) isPracticingWeakWords = false;
  currentMode = mode;
  score = 0;
  lives = mode === 'memory-flip' ? 6 : 3;
  streak = 0;
  sessionXP = 0;
  sessionDiamonds = 0;
  totalQuestionsAnswered = 0;
  correctAnswersCount = 0;
  roundNumber = 0;
  sessionStartTime = Date.now();
  reviewWordsList.clear();

  updateHeaderStats();

  ['tab-learn', 'tab-decks', 'tab-quests', 'tab-leaderboard', 'tab-profile', 'screen-results'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('screen-gameplay').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const modeNames = {
    'fast-vocab': 'Fast Vocab',
    'word-speller': 'Word Speller',
    'sentence-builder': 'Sentence Builder',
    'memory-flip': 'Memory Flip',
    'word-scramble': 'Word Scramble',
    'odd-one-out': 'Odd One Out',
    'listening-dictation': 'Acoustic Dictation',
    'meaning-hunter': 'Meaning Hunter',
    'balloon-catcher': 'Balloon Catcher',
    'voice-duel': 'Voice Duel',
    'word-shooter': 'Penembak Kata',
    'exam-quiz': currentExamType === 'ielts' ? 'Ujian IELTS' : 'Ujian TOEIC'
  };
  document.getElementById('gameplay-mode-badge').textContent = modeNames[mode] || mode;
  document.getElementById('gameplay-level-badge').textContent = isPracticingWeakWords ? 'WEAK' : currentCEFR;

  [
    'subgame-fast-vocab', 'subgame-word-speller', 'subgame-sentence-builder',
    'subgame-memory-flip', 'subgame-word-scramble', 'subgame-odd-one-out',
    'subgame-listening-dictation', 'subgame-meaning-hunter', 'subgame-balloon-catcher',
    'subgame-voice-duel', 'subgame-word-shooter', 'subgame-exam-quiz'
  ].forEach(id => document.getElementById(id).classList.add('hidden'));

  document.getElementById(`subgame-${mode}`).classList.remove('hidden');

  if (mode === 'fast-vocab') nextFastVocabRound();
  else if (mode === 'word-speller') nextWordSpellerRound();
  else if (mode === 'sentence-builder') nextSentenceBuilderRound();
  else if (mode === 'memory-flip') initMemoryFlipGame();
  else if (mode === 'word-scramble') nextWordScrambleRound();
  else if (mode === 'odd-one-out') nextOddOneOutRound();
  else if (mode === 'listening-dictation') nextListeningDictationRound();
  else if (mode === 'meaning-hunter') nextMeaningHunterRound();
  else if (mode === 'balloon-catcher') nextBalloonCatcherRound();
  else if (mode === 'voice-duel') nextVoiceDuelRound();
  else if (mode === 'word-shooter') startWordShooterGame();
  else if (mode === 'exam-quiz') nextExamQuizRound();
}

/* ---------- 1. FAST VOCAB ---------- */
function nextFastVocabRound() {
  clearInterval(fastVocabTimerInterval);
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  const distractorSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const otherCards = distractorSource.filter(i => i.id !== currentItem.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const roundChoices = [currentItem, ...otherCards].sort(() => 0.5 - Math.random());

  const grid = document.getElementById('fast-vocab-cards-grid');
  grid.innerHTML = '';
  roundChoices.forEach(choice => {
    const card = document.createElement('button');
    card.dataset.wordId = choice.id;
    if (hasRealImage(choice)) {
      card.className = 'tactile-btn fast-vocab-card h-40 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-2.5 transition hover:border-indigo-400 focus-ring overflow-hidden shadow-xs';
      card.innerHTML = `
        <div class="w-full h-24 lexical-img-frame mb-1.5">${renderWordImgTag(choice)}</div>
        <div class="flex items-center justify-between w-full px-1 gap-1.5">
          <span class="text-xs font-bold text-slate-800 truncate">${choice.meaning}</span>
          <span class="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">${choice.cefr}</span>
        </div>
      `;
    } else {
      card.className = 'tactile-btn fast-vocab-card app-surface h-32 border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-3.5 transition hover:border-sky-400 focus-ring shadow-xs text-center';
      card.innerHTML = `
        <div class="w-full flex items-center justify-between">
          <span class="text-[10px] font-mono uppercase text-slate-400 font-bold">${choice.category}</span>
          <span class="text-[10px] text-sky-400 bg-sky-500/15 border border-sky-400/30 px-1.5 py-0.5 rounded font-mono font-bold">${choice.cefr}</span>
        </div>
        <div class="text-xs sm:text-sm font-bold leading-snug line-clamp-2 my-auto">${choice.meaning}</div>
        <div class="w-8 h-1 rounded-full bg-sky-500/40"></div>
      `;
    }
    card.onclick = () => handleFastVocabChoice(choice, card);
    grid.appendChild(card);
  });

  speakText(currentItem.word, 0.85);
  const baseDuration = (CEFR_CONFIG[currentItem.cefr] || CEFR_CONFIG.A1).timerSec;
  fastVocabTimeLeft = baseDuration;
  const bar = document.getElementById('fast-vocab-timer-bar');
  bar.style.width = '100%';

  fastVocabTimerInterval = setInterval(() => {
    fastVocabTimeLeft -= 0.05;
    bar.style.width = `${Math.max(0, (fastVocabTimeLeft / baseDuration) * 100)}%`;
    if (fastVocabTimeLeft <= 0) {
      clearInterval(fastVocabTimerInterval);
      handleMistake(currentItem);
      showToast(`Time up: "${currentItem.word}"`, '⏰');
      highlightFastVocabCorrect();
      advanceOrFinishRound(nextFastVocabRound, 1100);
    }
  }, 50);
}

function handleFastVocabChoice(selected, cardEl) {
  clearInterval(fastVocabTimerInterval);
  if (selected.id === currentItem.id) {
    cardEl.classList.add('border-emerald-600', 'bg-emerald-50/50');
    addSuccessScore(100);
    showToast(`Matched: ${currentItem.word}`, '✓');
    advanceOrFinishRound(nextFastVocabRound, 650);
  } else {
    cardEl.classList.add('border-rose-600', 'bg-rose-50/50', 'shake-anim');
    handleMistake(currentItem);
    highlightFastVocabCorrect();
    advanceOrFinishRound(nextFastVocabRound, 1100);
  }
}

function highlightFastVocabCorrect() {
  document.querySelectorAll('.fast-vocab-card').forEach(c => {
    if (c.dataset.wordId === currentItem.id) c.classList.add('border-emerald-600', 'bg-emerald-50/50');
  });
}

/* ---------- 2. WORD SPELLER ---------- */
let spellerTargetLetters = [];
let spellerConstructedWord = [];
let spellerTileButtons = [];

function nextWordSpellerRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  spellerTargetLetters = currentItem.word.toLowerCase().split('');
  spellerConstructedWord = [];

  setOptionalImageFrame('speller-image-frame', currentItem);
  document.getElementById('speller-phonetic-text').textContent = currentItem.phonetic || `/${currentItem.word}/`;
  document.getElementById('speller-meaning-text').textContent = `"${currentItem.definition || currentItem.meaning}"`;
  speakText(currentItem.word, 0.85);

  // Bug Fix #5: Generate letter distractors if word doesn't have distractors field
  let distractors;
  if (currentItem.distractors && currentItem.distractors.length) {
    distractors = (currentItem.distractors || []).slice(0, currentItem.cefr === 'C1' ? 4 : 2);
  } else {
    // Auto-generate distractor letters not in the word
    const wordLetters = new Set(spellerTargetLetters);
    const pool = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !wordLetters.has(c));
    const count = currentItem.cefr === 'C1' ? 4 : currentItem.cefr === 'B2' ? 3 : 2;
    distractors = pool.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  spellerTileButtons = [...spellerTargetLetters, ...distractors]
    .map((char, idx) => ({ id: `tile_${idx}`, char, used: false }))
    .sort(() => 0.5 - Math.random());
  renderSpellerSlotsAndTiles();
}

function renderSpellerSlotsAndTiles() {
  const slots = document.getElementById('speller-target-slots');
  slots.innerHTML = '';
  for (let i = 0; i < spellerTargetLetters.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'w-9 h-11 rounded-lg border flex items-center justify-center font-bold text-base uppercase transition font-mono';
    if (i < spellerConstructedWord.length) {
      slot.className += ' bg-white border-blue-600 text-blue-700 shadow-xs cursor-pointer hover:bg-slate-50';
      slot.textContent = spellerConstructedWord[i].char;
      slot.onclick = () => removeSpellerTileAt(i);
    } else {
      slot.className += ' bg-white border-slate-200 text-slate-300';
      slot.textContent = '·';
    }
    slots.appendChild(slot);
  }

  const deck = document.getElementById('speller-letter-deck');
  deck.innerHTML = '';
  spellerTileButtons.forEach(tile => {
    const btn = document.createElement('button');
    btn.className = `tactile-btn w-9 h-11 rounded-lg font-bold text-base font-mono uppercase transition ${tile.used ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed' : 'bg-white hover:border-slate-400 text-slate-800 border border-slate-200 shadow-xs'}`;
    btn.textContent = tile.char;
    btn.disabled = tile.used;
    btn.onclick = () => handleSpellerTileClick(tile);
    deck.appendChild(btn);
  });
}

function handleSpellerTileClick(tile) {
  if (tile.used || spellerConstructedWord.length >= spellerTargetLetters.length) return;
  playSfx('click');
  tile.used = true;
  spellerConstructedWord.push(tile);
  renderSpellerSlotsAndTiles();
  if (spellerConstructedWord.length === spellerTargetLetters.length) verifySpellerAnswer();
}

function removeSpellerTileAt(idx) {
  playSfx('click');
  const t = spellerConstructedWord.splice(idx, 1)[0];
  if (t) t.used = false;
  renderSpellerSlotsAndTiles();
}

function verifySpellerAnswer() {
  const ans = spellerConstructedWord.map(t => t.char).join('');
  if (ans === spellerTargetLetters.join('')) {
    addSuccessScore(120);
    showToast(`Correct: "${currentItem.word}"`, '✓');
    speakText(currentItem.word, 0.85);
    advanceOrFinishRound(nextWordSpellerRound, 900);
  } else {
    handleMistake(currentItem);
    showToast('Orthography mismatch.', '✕');
    const slots = document.getElementById('speller-target-slots');
    slots.classList.add('shake-anim');
    setTimeout(() => slots.classList.remove('shake-anim'), 350);
  }
}

function useSpellerHint() {
  playSfx('click');
  const idx = spellerConstructedWord.length;
  if (idx >= spellerTargetLetters.length) return;
  const needed = spellerTargetLetters[idx];
  const tile = spellerTileButtons.find(t => !t.used && t.char === needed);
  if (tile) {
    tile.used = true;
    spellerConstructedWord.push(tile);
    score = Math.max(0, score - 20);
    updateHeaderStats();
    renderSpellerSlotsAndTiles();
    if (spellerConstructedWord.length === spellerTargetLetters.length) verifySpellerAnswer();
  }
}

function resetSpellerCurrentRound() {
  playSfx('click');
  spellerConstructedWord = [];
  spellerTileButtons.forEach(t => t.used = false);
  renderSpellerSlotsAndTiles();
}

/* ---------- 3. SENTENCE BUILDER ---------- */
let sentenceOriginalTokens = [];
let sentenceAvailableTokens = [];
let sentencePlacedTokens = [];

function isCleanSentence(v) {
  if (!Array.isArray(v.sentence) || v.sentence.length < 2) return false;
  const joined = v.sentence.join(' ');
  return !/\(=|somebody,|something,|\//.test(joined);
}

function nextSentenceBuilderRound() {
  const rawPool = getFilteredVocab();
  let sentencePool = rawPool.filter(isCleanSentence);
  if (!sentencePool.length) {
    sentencePool = rawPool.filter(v => Array.isArray(v.sentence) && v.sentence.length >= 2);
  }
  if (!sentencePool.length) {
    sentencePool = VOCAB_DATA.filter(isCleanSentence);
  }
  currentItem = drawNextWord(sentencePool);
  if (!currentItem) return;

  roundNumber++;
  updateRoundProgressUI();

  sentenceOriginalTokens = [...currentItem.sentence];
  sentencePlacedTokens = [];
  setOptionalImageFrame('sentence-image-frame', currentItem);
  document.getElementById('sentence-meaning-hint').textContent = `"${currentItem.sentenceIndo}"`;
  sentenceAvailableTokens = sentenceOriginalTokens.map((tok, idx) => ({ id: `tok_${idx}`, text: tok, used: false })).sort(() => 0.5 - Math.random());
  renderSentenceTokens();
}

function renderSentenceTokens() {
  const target = document.getElementById('sentence-target-container');
  target.innerHTML = '';
  if (!sentencePlacedTokens.length) {
    target.innerHTML = `<span class="text-slate-400 text-xs italic">Tap constituent tokens below in lawful syntactic sequence...</span>`;
  } else {
    sentencePlacedTokens.forEach((tok, idx) => {
      const btn = document.createElement('button');
      btn.className = 'tactile-btn px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs shadow-xs flex items-center gap-1.5';
      btn.innerHTML = `<span>${tok.text}</span> <span class="text-slate-400 text-[10px]">✕</span>`;
      btn.onclick = () => { playSfx('click'); tok.used = false; sentencePlacedTokens.splice(idx, 1); renderSentenceTokens(); };
      target.appendChild(btn);
    });
  }

  const src = document.getElementById('sentence-source-container');
  src.innerHTML = '';
  sentenceAvailableTokens.forEach(tok => {
    const btn = document.createElement('button');
    btn.className = `tactile-btn px-3 py-1.5 rounded-lg text-xs font-medium border transition ${tok.used ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-white hover:border-slate-400 text-slate-800 border-slate-200 shadow-xs'}`;
    btn.textContent = tok.text;
    btn.disabled = tok.used;
    btn.onclick = () => { if (!tok.used) { playSfx('click'); tok.used = true; sentencePlacedTokens.push(tok); renderSentenceTokens(); } };
    src.appendChild(btn);
  });
}

function resetSentenceCurrentTokens() {
  playSfx('click');
  sentencePlacedTokens = [];
  sentenceAvailableTokens.forEach(t => t.used = false);
  renderSentenceTokens();
}

function checkSentenceSolution() {
  const formed = sentencePlacedTokens.map(t => t.text).join(' ');
  const target = sentenceOriginalTokens.join(' ');
  if (formed === target) {
    addSuccessScore(150);
    unlockBadge('syntax_architect');
    showToast('Syntax Validated!', '✓');
    speakText(target, 0.9);
    advanceOrFinishRound(nextSentenceBuilderRound, 1300);
  } else {
    handleMistake(currentItem);
    showToast('Grammatical sequence invalid.', '✕');
    const c = document.getElementById('sentence-target-container');
    c.classList.add('shake-anim');
    setTimeout(() => c.classList.remove('shake-anim'), 350);
  }
}

/* ---------- 4. MEMORY FLIP ---------- */
let flippedCards = [];
let matchedPairsCount = 0;
let totalPairsNeeded = 4;

function initMemoryFlipGame() {
  const pool = getFilteredVocab();
  roundNumber++;
  updateRoundProgressUI();

  const pairCount = 4;
  const selected = [];
  for (let i = 0; i < Math.min(pairCount, pool.length); i++) {
    const w = drawNextWord(pool);
    if (w && !selected.some(s => s.id === w.id)) selected.push(w);
  }
  totalPairsNeeded = selected.length;
  matchedPairsCount = 0;
  flippedCards = [];
  document.getElementById('memory-pairs-count').textContent = `0 / ${totalPairsNeeded}`;

  const deck = [];
  selected.forEach((item, idx) => {
    deck.push({ uid: `t_${idx}`, pairId: item.id, type: 'text', item });
    deck.push({ uid: `i_${idx}`, pairId: item.id, type: 'image', item });
  });
  deck.sort(() => 0.5 - Math.random());

  const grid = document.getElementById('memory-cards-grid');
  grid.innerHTML = '';
  deck.forEach(card => {
    const el = document.createElement('div');
    el.className = 'tactile-btn memory-card-item h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-xs text-center p-2 overflow-hidden';
    el.innerHTML = `<span class="code-font text-xs font-bold text-slate-400">#HIDDEN</span>`;
    el.onclick = () => handleMemoryCardClick(card, el);
    grid.appendChild(el);
  });
}

function handleMemoryCardClick(card, el) {
  if (flippedCards.length >= 2 || el.dataset.matched === 'true' || flippedCards.some(f => f.card.uid === card.uid)) return;
  playSfx('click');
  el.classList.add('bg-slate-50', 'border-slate-400');
  if (card.type === 'image') {
    if (hasRealImage(card.item)) {
      el.innerHTML = `<div class="w-full h-full lexical-img-frame">${renderWordImgTag(card.item)}</div>`;
    } else {
      el.innerHTML = `<div class="flex flex-col items-center justify-center px-1.5"><span class="text-[9px] font-mono uppercase text-sky-400 font-bold mb-0.5">${card.item.category}</span><span class="text-[11px] font-semibold text-slate-800 line-clamp-3 leading-tight">${card.item.meaning}</span></div>`;
    }
  } else {
    el.innerHTML = `<span class="code-font text-xs font-bold text-slate-900">${card.item.word}</span>`;
    currentItem = card.item;
    speakText(card.item.word, 0.85);
  }
  flippedCards.push({ card, el });

  if (flippedCards.length === 2) {
    const [a, b] = flippedCards;
    if (a.card.pairId === b.card.pairId) {
      a.el.dataset.matched = 'true';
      b.el.dataset.matched = 'true';
      a.el.className = 'tactile-btn memory-card-item h-28 bg-emerald-50 border border-emerald-500 rounded-2xl flex items-center justify-center text-center p-2 overflow-hidden';
      b.el.className = 'tactile-btn memory-card-item h-28 bg-emerald-50 border border-emerald-500 rounded-2xl flex items-center justify-center text-center p-2 overflow-hidden';
      currentItem = a.card.item;
      matchedPairsCount++;
      document.getElementById('memory-pairs-count').textContent = `${matchedPairsCount} / ${totalPairsNeeded}`;
      addSuccessScore(130);
      flippedCards = [];
      if (matchedPairsCount >= totalPairsNeeded) {
        triggerConfetti();
        advanceOrFinishRound(initMemoryFlipGame, 900);
      }
    } else {
      setTimeout(() => {
        a.el.className = 'tactile-btn memory-card-item h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-xs text-center p-2 overflow-hidden';
        b.el.className = 'tactile-btn memory-card-item h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-xs text-center p-2 overflow-hidden';
        a.el.innerHTML = `<span class="code-font text-xs font-bold text-slate-400">#HIDDEN</span>`;
        b.el.innerHTML = `<span class="code-font text-xs font-bold text-slate-400">#HIDDEN</span>`;
        handleMistake(a.card.item);
        flippedCards = [];
      }, 750);
    }
  }
}

/* ---------- 5. WORD SCRAMBLE ---------- */
let scrambleTargetWord = '';

function nextWordScrambleRound() {
  const rawPool = getFilteredVocab();
  let validPool = rawPool.filter(v => v.word && v.word.trim().length >= 2);
  if (!validPool.length) validPool = VOCAB_DATA.filter(v => v.word && v.word.trim().length >= 2);
  currentItem = drawNextWord(validPool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  scrambleTargetWord = currentItem.word.toLowerCase();
  const letters = scrambleTargetWord.split('');
  let tries = 0;
  do { letters.sort(() => 0.5 - Math.random()); tries++; } while (letters.join('') === scrambleTargetWord && tries < 10);

  setOptionalImageFrame('scramble-image-frame', currentItem);
  document.getElementById('scramble-jumbled-word').textContent = letters.join(' ').toUpperCase();
  document.getElementById('scramble-meaning-clue').textContent = `Definition: ${currentItem.definition}`;

  const input = document.getElementById('scramble-user-input');
  input.value = '';
  input.focus();
}

function checkScrambleAnswer() {
  const input = document.getElementById('scramble-user-input');
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  if (val === scrambleTargetWord) {
    speakText(scrambleTargetWord, 0.85);
    addSuccessScore(140);
    showToast(`Anagram resolved: ${scrambleTargetWord}`, '✓');
    advanceOrFinishRound(nextWordScrambleRound, 850);
  } else {
    handleMistake(currentItem);
    showToast('Incorrect anagram transcription.', '✕');
    input.classList.add('shake-anim', 'border-rose-500');
    setTimeout(() => input.classList.remove('shake-anim', 'border-rose-500'), 400);
  }
}

function useScrambleHint() {
  if (!scrambleTargetWord) return;
  playSfx('click');
  const input = document.getElementById('scramble-user-input');
  input.value = scrambleTargetWord.slice(0, 2).toUpperCase();
  score = Math.max(0, score - 15);
  updateHeaderStats();
  input.focus();
}

/* ---------- 6. ODD ONE OUT ---------- */
function nextOddOneOutRound() {
  roundNumber++;
  updateRoundProgressUI();

  const tierPool = currentCEFR === 'ALL' ? VOCAB_DATA : VOCAB_DATA.filter(v => v.cefr === currentCEFR);
  const byCat = {};
  VOCAB_DATA.forEach(v => {
    if (!byCat[v.category]) byCat[v.category] = [];
    byCat[v.category].push(v);
  });

  const validCats = Object.keys(byCat).filter(c => byCat[c].length >= 3);
  const tierCats = validCats.filter(c => tierPool.some(w => w.category === c));
  const chosenPoolCats = tierCats.length ? tierCats : validCats;
  const mainCat = chosenPoolCats[Math.floor(Math.random() * chosenPoolCats.length)];
  const otherCats = Object.keys(byCat).filter(c => c !== mainCat);
  const otherCat = otherCats[Math.floor(Math.random() * otherCats.length)];

  const mainCandidates = [
    ...tierPool.filter(v => v.category === mainCat),
    ...byCat[mainCat].filter(v => !tierPool.some(t => t.id === v.id))
  ];
  const mainItems = mainCandidates.slice(0, 6).sort(() => 0.5 - Math.random()).slice(0, 3);
  const oddCandidates = tierPool.filter(v => v.category === otherCat);
  const oddPool = oddCandidates.length ? oddCandidates : byCat[otherCat];
  const oddItem = oddPool[Math.floor(Math.random() * oddPool.length)];
  currentItem = oddItem;

  const roundItems = [...mainItems, oddItem].sort(() => 0.5 - Math.random());
  document.getElementById('odd-out-prompt').textContent = `Which item does NOT belong to "${mainCat}"?`;

  const grid = document.getElementById('odd-out-cards-grid');
  grid.innerHTML = '';
  roundItems.forEach(item => {
    const card = document.createElement('button');
    if (hasRealImage(item)) {
      card.className = 'tactile-btn h-36 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-2 transition hover:border-slate-400 focus-ring overflow-hidden shadow-xs';
      card.innerHTML = `
        <div class="w-full h-20 lexical-img-frame mb-1">${renderWordImgTag(item)}</div>
        <span class="text-xs font-bold text-slate-800">${item.word}</span>
        <span class="text-[10px] text-slate-400 font-mono">${item.cefr}</span>
      `;
    } else {
      card.className = 'tactile-btn app-surface h-28 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-3 transition hover:border-sky-400 focus-ring shadow-xs gap-1';
      card.innerHTML = `
        <span class="text-sm font-extrabold tracking-tight">${item.word}</span>
        <span class="text-[10px] text-slate-400 font-mono">${item.phonetic || ('/' + item.word + '/')} • ${item.cefr}</span>
      `;
    }
    card.onclick = () => {
      if (item.id === oddItem.id) {
        card.classList.add('border-emerald-600', 'bg-emerald-50');
        addSuccessScore(120);
        showToast(`Outlier: "${oddItem.word}" (${oddItem.category})`, '✓');
        advanceOrFinishRound(nextOddOneOutRound, 850);
      } else {
        card.classList.add('border-rose-500', 'bg-rose-50', 'shake-anim');
        handleMistake(oddItem);
        showToast(`"${item.word}" belongs to ${mainCat}.`, '✕');
        advanceOrFinishRound(nextOddOneOutRound, 1000);
      }
    };
    grid.appendChild(card);
  });
}

/* ---------- 7. ACOUSTIC DICTATION ---------- */
function nextListeningDictationRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  document.getElementById('dictation-phonetic').textContent = currentItem.phonetic;
  const input = document.getElementById('dictation-user-input');
  input.value = '';
  input.focus();
  speakText(currentItem.word, 0.85);
}

function checkDictationAnswer() {
  const input = document.getElementById('dictation-user-input');
  if (!input || !currentItem) return;
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  if (val === currentItem.word.toLowerCase()) {
    addSuccessScore(130);
    showToast(`Correct spelling: "${currentItem.word}"`, '✓');
    speakText(currentItem.word, 0.85);
    advanceOrFinishRound(nextListeningDictationRound, 850);
  } else {
    handleMistake(currentItem);
    showToast('Transcription error. Listen again.', '✕');
    input.classList.add('shake-anim', 'border-rose-500');
    setTimeout(() => input.classList.remove('shake-anim', 'border-rose-500'), 400);
  }
}

function useDictationHint() {
  if (!currentItem) return;
  playSfx('click');
  score = Math.max(0, score - 10);
  updateHeaderStats();
  showToast(`${currentItem.word.length} letters, starts with "${currentItem.word[0].toUpperCase()}"`, '💡');
  document.getElementById('dictation-user-input').focus();
}

/* ---------- 8. MEANING HUNTER ---------- */
function nextMeaningHunterRound() {
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  // Bug Fix #4: Safe fallback for vocab_4000 words without synonym/antonym
  const hasSyn = Boolean(currentItem.synonym && currentItem.synonym.trim());
  const hasAnt = Boolean(currentItem.antonym && currentItem.antonym.trim());
  // If word has no synonym/antonym, always use meaning match
  const useAntonym = hasAnt && Math.random() > 0.65;
  const useSynonym = hasSyn && !useAntonym;
  const useDefMatch = !useAntonym && !useSynonym;

  const correctChoice = useAntonym
    ? currentItem.antonym
    : (useSynonym ? currentItem.synonym : currentItem.meaning);

  document.getElementById('hunter-relation-type').textContent = useAntonym
    ? 'Find Antonym (Opposite)'
    : (useDefMatch ? 'Match Meaning (Bahasa Indonesia)' : 'Find Synonym (Similar)');
  document.getElementById('hunter-target-word').textContent = currentItem.word;
  document.getElementById('hunter-target-meaning').textContent = useDefMatch
    ? `${currentItem.phonetic || ('/' + currentItem.word + '/')} • ${currentItem.category || 'General'}`
    : `"${currentItem.definition || currentItem.meaning}"`;

  const otherSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const distractors = [];
  const usedTexts = new Set([String(correctChoice).toLowerCase()]);
  for (let i = 0; i < 24 && distractors.length < 3; i++) {
    const candidate = otherSource[Math.floor(Math.random() * otherSource.length)];
    if (!candidate || candidate.id === currentItem.id) continue;
    const text = useAntonym
      ? (candidate.antonym || candidate.synonym || candidate.meaning)
      : (useDefMatch ? candidate.meaning : (candidate.synonym || candidate.meaning));
    if (text && !usedTexts.has(text.toLowerCase())) {
      usedTexts.add(text.toLowerCase());
      distractors.push(text);
    }
  }

  const options = [{ text: correctChoice, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))]
    .sort(() => 0.5 - Math.random());

  const grid = document.getElementById('hunter-options-grid');
  grid.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'tactile-btn p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 font-semibold text-xs text-slate-800 shadow-xs';
    btn.textContent = opt.text;
    btn.onclick = () => {
      if (opt.correct) {
        btn.classList.add('bg-emerald-50', 'border-emerald-600', 'text-emerald-800');
        addSuccessScore(125);
        showToast(`Verified: ${opt.text}`, '✓');
        advanceOrFinishRound(nextMeaningHunterRound, 800);
      } else {
        btn.classList.add('bg-rose-50', 'border-rose-500', 'shake-anim');
        handleMistake(currentItem);
        showToast(`Answer: "${correctChoice}"`, '✕');
        advanceOrFinishRound(nextMeaningHunterRound, 1100);
      }
    };
    grid.appendChild(btn);
  });
}

/* ---------- 9. BALLOON CATCHER ---------- */
function nextBalloonCatcherRound() {
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  document.getElementById('balloon-target-prompt').textContent = `Tangkap: "${currentItem.meaning}"`;
  const playground = document.getElementById('balloon-playground');
  playground.innerHTML = '';

  const otherSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const otherWords = otherSource.filter(v => v.id !== currentItem.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const balloons = [currentItem, ...otherWords].sort(() => 0.5 - Math.random());

  // Bug Fix #7: Add falling animation with staggered timing per balloon
  const fallDurations = [3.8, 4.4, 5.0, 4.1];
  balloons.forEach((item, idx) => {
    const balloon = document.createElement('button');
    const leftPct = 4 + (idx * 23) + Math.floor(Math.random() * 8);
    const duration = fallDurations[idx];

    balloon.className = 'balloon-falling tactile-btn px-3.5 py-2 rounded-2xl bg-white border border-slate-300 shadow-md text-slate-800 font-semibold text-xs flex items-center gap-2 hover:border-indigo-500';
    balloon.style.left = `${leftPct}%`;
    balloon.style.animationDuration = `${duration}s`;
    balloon.style.animationDelay = `${idx * 0.5}s`;
    balloon.innerHTML = hasRealImage(item)
      ? `<div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">${renderWordImgTag(item, 'w-full h-full object-cover')}</div><span class="code-font font-bold">${item.word}</span>`
      : `<span class="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0"></span><span class="code-font font-bold text-sm">${item.word}</span>`;

    let answered = false;
    balloon.onclick = () => {
      if (answered) return;
      answered = true;
      balloon.style.animationPlayState = 'paused';
      if (item.id === currentItem.id) {
        balloon.classList.add('bg-emerald-50', 'border-emerald-600');
        addSuccessScore(130);
        showToast(`Tertangkap: "${currentItem.word}"`, '✓');
        speakText(currentItem.word);
        // Remove all balloons then advance
        setTimeout(() => { playground.innerHTML = ''; advanceOrFinishRound(nextBalloonCatcherRound, 400); }, 500);
      } else {
        balloon.classList.add('bg-rose-50', 'border-rose-500', 'shake-anim');
        handleMistake(currentItem);
        showToast('Target salah!', '✕');
      }
    };

    // Auto miss ONLY if the target balloon reaches the bottom
    balloon.addEventListener('animationend', () => {
      if (!answered) {
        answered = true;
        balloon.remove();
        if (item.id === currentItem.id) {
          handleMistake(item);
          showToast(`Target lolos: "${item.word}"!`, '💨');
          playground.innerHTML = '';
          advanceOrFinishRound(nextBalloonCatcherRound, 500);
        } else if (playground.querySelectorAll('.balloon-falling').length === 0) {
          advanceOrFinishRound(nextBalloonCatcherRound, 400);
        }
      }
    });

    playground.appendChild(balloon);
  });
}

/* ---------- 10. VOICE DUEL ---------- */
function nextVoiceDuelRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  setOptionalImageFrame('duel-image-frame', currentItem);
  document.getElementById('duel-target-word').textContent = currentItem.word;
  document.getElementById('duel-phonetic').textContent = currentItem.phonetic;
  document.getElementById('duel-meaning').textContent = `"${currentItem.definition}"`;
  document.getElementById('duel-status-text').textContent = 'Tap microphone and articulate clearly';
  document.getElementById('duel-result-feedback').innerHTML = '';
  speakText(currentItem.word, 0.85);
}

function triggerDuelSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Web Speech Recognition requires Chrome/Edge on localhost.', '⚠️'); return; }
  playSfx('click');
  const recognizer = new SR();
  recognizer.lang = 'en-US';
  recognizer.interimResults = false;

  const micBtn = document.getElementById('btn-duel-mic');
  const statusText = document.getElementById('duel-status-text');
  const resultBox = document.getElementById('duel-result-feedback');
  statusText.textContent = 'Listening... Articulate now.';
  micBtn.classList.add('ring-2', 'ring-blue-600');
  recognizer.start();

  recognizer.onresult = (event) => {
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    const target = currentItem.word.toLowerCase();
    micBtn.classList.remove('ring-2', 'ring-blue-600');
    if (spoken.includes(target)) {
      statusText.textContent = `Match confirmed: "${spoken}"`;
      resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-200">✓ Articulation Verified</span>`;
      addSuccessScore(160);
      unlockBadge('voice_master');
      triggerConfetti();
      advanceOrFinishRound(nextVoiceDuelRound, 1100);
    } else {
      statusText.textContent = `Heard: "${spoken}"`;
      resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-rose-50 text-rose-800 text-xs font-mono font-bold rounded border border-rose-200">Target: "${target}"</span>`;
      handleMistake(currentItem);
    }
  };
  recognizer.onerror = () => { micBtn.classList.remove('ring-2', 'ring-blue-600'); statusText.textContent = 'Audio error. Retry.'; };
  recognizer.onend = () => micBtn.classList.remove('ring-2', 'ring-blue-600');
}

// Bug Fix #8 & Word Speller keyboard support
document.addEventListener('keydown', (e) => {
  const gameplayVisible = !document.getElementById('screen-gameplay')?.classList.contains('hidden');
  if (!gameplayVisible) return;

  if (e.key === 'Enter') {
    const active = document.activeElement?.id;
    if (currentMode === 'word-scramble' && active === 'scramble-user-input') checkScrambleAnswer();
    else if (currentMode === 'listening-dictation' && active === 'dictation-user-input') checkDictationAnswer();
    else if (currentMode === 'sentence-builder') checkSentenceSolution();
  } else if (currentMode === 'word-speller' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (e.key === 'Backspace') {
      if (spellerConstructedWord.length > 0) {
        e.preventDefault();
        removeSpellerTileAt(spellerConstructedWord.length - 1);
      }
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      const ch = e.key.toLowerCase();
      const tile = spellerTileButtons.find(t => !t.used && t.char.toLowerCase() === ch);
      if (tile) handleSpellerTileClick(tile);
    }
  }
});

/* ---------- LEXICON, VOICE LAB, CUSTOM WORD & ACHIEVEMENTS ---------- */
function openNotebookModal() {
  playSfx('click');
  document.getElementById('modal-notebook').classList.remove('hidden');
  filterNotebookWords();
  unlockBadge('lexicon_keeper');
}
function closeNotebookModal() { playSfx('click'); document.getElementById('modal-notebook').classList.add('hidden'); }

function renderNotebookList(items) {
  const list = document.getElementById('notebook-words-list');
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">No entries match your search criteria.</div>`;
    return;
  }
  const MAX_SHOW = 80;
  const info = document.createElement('div');
  info.className = 'py-2 px-2 text-[11px] font-mono text-slate-500 bg-slate-50 rounded-lg mb-2 flex justify-between';
  info.innerHTML = `<span>Showing ${Math.min(items.length, MAX_SHOW)} of ${items.length.toLocaleString()} words</span><span>Type above to filter</span>`;
  list.appendChild(info);

  items.slice(0, MAX_SHOW).forEach(item => {
    const row = document.createElement('div');
    row.className = 'py-3 flex items-start justify-between hover:bg-slate-50 px-2 rounded-xl transition gap-3';
    row.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-14 h-14 rounded-xl overflow-hidden lexical-img-frame flex-shrink-0 border border-slate-200">${renderWordImgTag(item, 'w-full h-full object-cover', true)}</div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 text-sm">${item.word}</span>
            <span class="code-font text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded border border-blue-200">${item.cefr}</span>
            <span class="code-font text-xs text-slate-500">${item.phonetic}</span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">${item.definition}</p>
          <span class="text-[11px] text-slate-400 font-medium">${item.meaning} • ${item.category}</span>
        </div>
      </div>
      <button onclick="speakText('${item.word}')" class="tactile-btn p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs flex-shrink-0">🔊</button>
    `;
    list.appendChild(row);
  });
}

function filterNotebookWords() {
  const q = document.getElementById('notebook-search-input').value.toLowerCase();
  const cefrFilter = document.getElementById('notebook-cefr-filter').value;
  const filtered = VOCAB_DATA.filter(v => {
    const matchText = v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
    return matchText && (cefrFilter === 'ALL' || v.cefr === cefrFilter);
  });
  renderNotebookList(filtered);
}

let voiceLabCurrentItem = VOCAB_DATA[0];
let recognition = null;
let waveAnimId = null;

function drawWaveform(active = false) {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  let step = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = active ? '#4F46E5' : '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const mid = canvas.height / 2;
    for (let x = 0; x < canvas.width; x += 4) {
      const amp = active ? Math.sin((x * 0.05) + step) * 12 + Math.cos((x * 0.08) - step) * 6 : 2;
      const y = mid + (active ? amp : Math.sin(x * 0.05 + step) * 1.5);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    step += 0.1;
    if (active) waveAnimId = requestAnimationFrame(animate);
  }
  cancelAnimationFrame(waveAnimId);
  animate();
}

function openVoiceLabModal() {
  playSfx('click');
  document.getElementById('modal-voicelab').classList.remove('hidden');
  const pool = currentCEFR === 'ALL' ? VOCAB_DATA : VOCAB_DATA.filter(v => v.cefr === currentCEFR);
  loadVoiceLabWord(pool[0] || VOCAB_DATA[0]);
  setTimeout(() => drawWaveform(false), 100);
}
function closeVoiceLabModal() {
  playSfx('click');
  document.getElementById('modal-voicelab').classList.add('hidden');
  if (recognition) recognition.stop();
  cancelAnimationFrame(waveAnimId);
}

function loadVoiceLabWord(item) {
  voiceLabCurrentItem = item;
  setOptionalImageFrame('voicelab-image-frame', item);
  document.getElementById('voicelab-word').textContent = item.word;
  document.getElementById('voicelab-phonetic').textContent = item.phonetic;
  document.getElementById('voicelab-cefr').textContent = item.cefr;
  document.getElementById('voicelab-status-text').textContent = 'Click microphone to calibrate input';
  document.getElementById('voicelab-result-badge').innerHTML = '';
  speakText(item.word, 0.85);
  drawWaveform(false);
}

function loadNextVoiceLabWord() {
  playSfx('click');
  const pool = currentCEFR === 'ALL' ? VOCAB_DATA : VOCAB_DATA.filter(v => v.cefr === currentCEFR);
  loadVoiceLabWord(pool[Math.floor(Math.random() * pool.length)] || VOCAB_DATA[0]);
}

function startSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Speech Recognition not supported in this browser.', '⚠️'); return; }
  playSfx('click');
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  const micBtn = document.getElementById('btn-start-mic');
  const statusText = document.getElementById('voicelab-status-text');
  const badge = document.getElementById('voicelab-result-badge');
  statusText.textContent = 'Listening... Articulate word.';
  micBtn.classList.add('ring-2', 'ring-blue-600');
  drawWaveform(true);
  recognition.start();

  recognition.onresult = (event) => {
    drawWaveform(false);
    micBtn.classList.remove('ring-2', 'ring-blue-600');
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    const target = voiceLabCurrentItem.word.toLowerCase();
    if (spoken.includes(target)) {
      playSfx('correct');
      statusText.textContent = `Acoustic match: "${spoken}"`;
      badge.innerHTML = `<span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-200">✓ Calibrated (+30 XP)</span>`;
      if (currentUser) {
        currentUser.xp += 30; currentUser.weeklyXP += 30; currentUser.monthlyXP += 30; currentUser.coins += 5;
        saveCurrentAccountState();
      }
      refreshAllUI();
      unlockBadge('voice_master');
      triggerConfetti();
    } else {
      playSfx('wrong');
      statusText.textContent = `Transcribed: "${spoken}"`;
      badge.innerHTML = `<span class="px-2.5 py-0.5 bg-rose-50 text-rose-800 text-xs font-mono font-bold rounded border border-rose-200">Expected: "${target}"</span>`;
    }
  };
  recognition.onerror = () => { drawWaveform(false); micBtn.classList.remove('ring-2', 'ring-blue-600'); statusText.textContent = 'Microphone error.'; };
  recognition.onend = () => { drawWaveform(false); micBtn.classList.remove('ring-2', 'ring-blue-600'); };
}

function openCustomWordModal() { playSfx('click'); document.getElementById('modal-custom-word').classList.remove('hidden'); }
function closeCustomWordModal() { playSfx('click'); document.getElementById('modal-custom-word').classList.add('hidden'); }

function handleSaveCustomWord(e) {
  e.preventDefault();
  const word = document.getElementById('cust-word').value.trim().toLowerCase();
  const cefr = document.getElementById('cust-cefr').value;
  const emoji = document.getElementById('cust-emoji').value.trim() || '📝';
  const meaning = document.getElementById('cust-meaning').value.trim();
  const def = document.getElementById('cust-def').value.trim();
  const rawSentence = document.getElementById('cust-sentence').value.trim();

  const newEntry = {
    id: `custom_${Date.now()}`, word, cefr, category: 'Custom', emoji, image: '',
    phonetic: `/${word}/`, meaning, definition: def, distractors: ['e', 'o', 'k', 's'],
    synonym: word, antonym: 'opposite', sentence: rawSentence.split(' '), sentenceIndo: meaning
  };
  VOCAB_DATA.unshift(newEntry);
  if (currentUser) {
    currentUser.customWords.unshift(newEntry);
    saveCurrentAccountState();
  }
  wordQueues = {};
  closeCustomWordModal();
  setCEFRLevel(cefr, true);
  playSfx('fanfare');
  showToast(`Custom word "${word}" saved to your account!`, emoji);
  e.target.reset();
}

function openAchievementsModal() { playSfx('click'); document.getElementById('modal-achievements').classList.remove('hidden'); renderAchievementsList(); }
function closeAchievementsModal() { playSfx('click'); document.getElementById('modal-achievements').classList.add('hidden'); }

function unlockBadge(badgeId) {
  if (!currentUser) return;
  const badge = ACHIEVEMENTS.find(b => b.id === badgeId);
  if (badge && !currentUser.unlockedBadges.includes(badgeId)) {
    currentUser.unlockedBadges.push(badgeId);
    saveCurrentAccountState();
    renderProfile();
    showToast(`Milestone Unlocked: ${badge.title}`, '🏆');
    playSfx('fanfare');
  }
}

function renderAchievementsList() {
  const list = document.getElementById('achievements-list');
  const unlocked = currentUser ? currentUser.unlockedBadges : [];
  list.innerHTML = '';
  ACHIEVEMENTS.forEach(b => {
    const isUnlocked = unlocked.includes(b.id);
    const item = document.createElement('div');
    item.className = `p-3 rounded-xl border flex items-center gap-3 transition ${isUnlocked ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-60'}`;
    item.innerHTML = `
      <div class="w-10 h-10 rounded-lg ${isUnlocked ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-lg flex-shrink-0">${b.icon}</div>
      <div>
        <h4 class="text-xs font-bold text-slate-900">${b.title} ${isUnlocked ? '✓' : ''}</h4>
        <p class="text-[11px] text-slate-500 mt-0.5">${b.desc}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 45 }, () => ({
    x: canvas.width / 2, y: canvas.height / 2, r: Math.random() * 3 + 2,
    color: ['#0F172A', '#2563EB', '#D97706', '#059669'][Math.floor(Math.random() * 4)],
    vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.7) * 8, alpha: 1
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.alpha -= 0.02;
      if (p.alpha > 0) {
        alive = true; ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(draw); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

let toastTimeout = null;
function showToast(message, icon = '✓') {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-message').textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 2200);
}

/* ---------- 11. PENEMBAK KATA (WORD SHOOTER) ---------- */
function startWordShooterGame() {
  stopAllActiveGameTimers();
  shooterActiveWords = [];
  shooterDestroyed = 0;
  roundNumber = 0;
  updateRoundProgressUI();
  document.getElementById('shooter-destroyed-label').textContent = `Destroyed: 0 / ${MAX_ROUNDS}`;

  const arena = document.getElementById('shooter-arena');
  arena.querySelectorAll('.shooter-falling-item').forEach(el => el.remove());

  const input = document.getElementById('shooter-type-input');
  input.value = '';
  input.focus();

  spawnShooterWord();
  shooterSpawnInterval = setInterval(() => {
    if (shooterActiveWords.length < 3 && (shooterDestroyed + shooterActiveWords.length) < MAX_ROUNDS) {
      spawnShooterWord();
    }
  }, 2400);

  shooterInterval = setInterval(tickShooterArena, 50);
}

function spawnShooterWord() {
  const pool = getFilteredVocab();
  const item = drawNextWord(pool);
  if (!item) return;

  const arena = document.getElementById('shooter-arena');
  const el = document.createElement('div');
  const leftPct = 10 + Math.floor(Math.random() * 62);
  el.className = 'shooter-falling-item absolute px-3 py-1.5 rounded-xl bg-slate-900/90 border border-sky-400/60 shadow-lg text-center pointer-events-none transition-colors';
  el.style.left = `${leftPct}%`;
  el.style.top = '8px';
  el.innerHTML = `
    <div class="code-font text-sm font-extrabold text-white tracking-wide shooter-word-label">${item.word}</div>
    <div class="text-[10px] text-sky-300 max-w-[140px] truncate">${item.meaning}</div>
  `;
  arena.appendChild(el);
  shooterActiveWords.push({
    item,
    el,
    y: 8,
    speed: 0.95 + Math.min(0.6, shooterDestroyed * 0.08)
  });
}

function tickShooterArena() {
  const arena = document.getElementById('shooter-arena');
  if (!arena || currentMode !== 'word-shooter') return;
  const maxBottom = arena.clientHeight - 54;

  for (let i = shooterActiveWords.length - 1; i >= 0; i--) {
    const obj = shooterActiveWords[i];
    obj.y += obj.speed;
    obj.el.style.top = `${obj.y}px`;

    if (obj.y >= maxBottom) {
      obj.el.remove();
      shooterActiveWords.splice(i, 1);
      handleMistake(obj.item);
      showToast(`Missed "${obj.item.word}"!`, '💥');
      if (lives > 0 && shooterActiveWords.length === 0) spawnShooterWord();
    }
  }
}

function handleShooterInput(rawVal) {
  const val = (rawVal || '').trim().toLowerCase();
  const input = document.getElementById('shooter-type-input');

  shooterActiveWords.forEach(obj => {
    const label = obj.el.querySelector('.shooter-word-label');
    if (!label) return;
    const w = obj.item.word.toLowerCase();
    if (val && w.startsWith(val)) {
      label.innerHTML = `<span class="text-emerald-400 underline">${w.slice(0, val.length)}</span>${w.slice(val.length)}`;
      obj.el.classList.add('border-emerald-400');
    } else {
      label.textContent = obj.item.word;
      obj.el.classList.remove('border-emerald-400');
    }
  });

  const hitIdx = shooterActiveWords.findIndex(obj => obj.item.word.toLowerCase() === val);
  if (hitIdx !== -1) {
    const hit = shooterActiveWords[hitIdx];
    currentItem = hit.item;
    hit.el.innerHTML = `<div class="text-lg">💥</div>`;
    setTimeout(() => hit.el.remove(), 180);
    shooterActiveWords.splice(hitIdx, 1);

    input.value = '';
    shooterDestroyed++;
    roundNumber = shooterDestroyed;
    updateRoundProgressUI();
    document.getElementById('shooter-destroyed-label').textContent = `Destroyed: ${shooterDestroyed} / ${MAX_ROUNDS}`;

    addSuccessScore(140);
    speakText(hit.item.word, 0.9);
    showToast(`Boom! "${hit.item.word}"`, '🚀');

    if (shooterDestroyed >= MAX_ROUNDS) {
      stopAllActiveGameTimers();
      setTimeout(endGameSession, 450);
    } else if (shooterActiveWords.length === 0) {
      spawnShooterWord();
    }
  }
}

function speakShooterFirstWord() {
  if (shooterActiveWords.length > 0) speakText(shooterActiveWords[0].item.word, 0.85);
}

/* ---------- 12. UJIAN KILAT TOEIC / IELTS ---------- */
function nextExamQuizRound() {
  clearInterval(examTimerInterval);
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  document.getElementById('exam-badge').textContent = currentExamType === 'ielts' ? 'IELTS Academic Simulation' : 'TOEIC Business Simulation';

  const fullSentence = Array.isArray(currentItem.sentence) ? currentItem.sentence.join(' ') : '';
  const wordRegex = new RegExp(`\\b${currentItem.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  const canCloze = fullSentence && isCleanSentence(currentItem) && wordRegex.test(fullSentence) && (roundNumber % 2 === 1);

  const otherSource = pool.length >= 4 ? pool : VOCAB_DATA;
  let options = [];

  if (canCloze) {
    const maskedSentence = fullSentence.replace(wordRegex, '________');
    document.getElementById('exam-target-word').textContent = maskedSentence;
    document.getElementById('exam-phonetic').textContent = `${currentItem.category} (${currentItem.cefr}) • Fill in the blank`;
    document.getElementById('exam-question-prompt').textContent = `Clue: ${currentItem.definition || currentItem.meaning}`;

    const correctWord = currentItem.word;
    const distractors = [];
    const used = new Set([correctWord.toLowerCase()]);
    for (let i = 0; i < 40 && distractors.length < 3; i++) {
      const cand = otherSource[Math.floor(Math.random() * otherSource.length)];
      if (!cand || cand.id === currentItem.id || !cand.word) continue;
      if (!used.has(cand.word.toLowerCase())) {
        used.add(cand.word.toLowerCase());
        distractors.push(cand.word);
      }
    }
    options = [{ text: correctWord, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))]
      .sort(() => 0.5 - Math.random());
  } else {
    document.getElementById('exam-target-word').textContent = currentItem.word;
    document.getElementById('exam-phonetic').textContent = `${currentItem.phonetic || ('/' + currentItem.word + '/')} • ${currentItem.category} (${currentItem.cefr})`;
    document.getElementById('exam-question-prompt').textContent = 'Choose the accurate definition or equivalent:';

    const correctDef = currentItem.definition || currentItem.meaning;
    const distractors = [];
    const used = new Set([correctDef.toLowerCase()]);
    for (let i = 0; i < 30 && distractors.length < 3; i++) {
      const cand = otherSource[Math.floor(Math.random() * otherSource.length)];
      if (!cand || cand.id === currentItem.id) continue;
      const text = cand.definition || cand.meaning;
      if (text && !used.has(text.toLowerCase())) {
        used.add(text.toLowerCase());
        distractors.push(text);
      }
    }
    options = [{ text: correctDef, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))]
      .sort(() => 0.5 - Math.random());
  }

  const grid = document.getElementById('exam-options-grid');
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'tactile-btn app-surface text-left p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 text-xs font-medium flex items-start gap-2.5';
    btn.innerHTML = `<span class="code-font font-bold text-sky-400">${letters[idx]}.</span><span>${opt.text}</span>`;
    btn.onclick = () => {
      clearInterval(examTimerInterval);
      // Bug Fix #12: Disable all buttons immediately after answer to prevent double-click
      grid.querySelectorAll('button').forEach(b => b.disabled = true);
      if (opt.correct) {
        btn.classList.add('border-emerald-500', 'bg-emerald-500/15');
        addSuccessScore(150);
        showToast('Correct answer!', '✓');
        advanceOrFinishRound(nextExamQuizRound, 750);
      } else {
        btn.classList.add('border-rose-500', 'bg-rose-500/15', 'shake-anim');
        // Highlight correct answer
        grid.querySelectorAll('button').forEach((b, i) => {
          if (options[i] && options[i].correct) b.classList.add('border-emerald-500', 'bg-emerald-500/15');
        });
        handleMistake(currentItem);
        showToast('Incorrect option.', '✕');
        advanceOrFinishRound(nextExamQuizRound, 1200);
      }
    };
    grid.appendChild(btn);
  });

  examTimeLeft = 15;
  const timerEl = document.getElementById('exam-timer-text');
  if (timerEl) timerEl.textContent = `${examTimeLeft}s`;
  examTimerInterval = setInterval(() => {
    examTimeLeft--;
    if (timerEl) timerEl.textContent = `${Math.max(0, examTimeLeft)}s`;
    if (examTimeLeft <= 0) {
      clearInterval(examTimerInterval);
      handleMistake(currentItem);
      showToast('Time expired!', '⏰');
      advanceOrFinishRound(nextExamQuizRound, 900);
    }
  }, 1000);
}

/* ---------- CLOUD DB SETUP MODAL ---------- */
function refreshCloudBadges() {
  if (typeof updateCloudStatusPill === 'function') updateCloudStatusPill('auto');
  const sideBadge = document.getElementById('sidebar-cloud-badge');
  if (sideBadge && typeof isCloudEnabled === 'function') {
    sideBadge.textContent = isCloudEnabled() ? 'Online' : 'Setup';
    sideBadge.className = isCloudEnabled()
      ? 'text-[10px] font-mono font-bold text-emerald-400'
      : 'text-[10px] font-mono text-slate-400';
  }
}

function openCloudSetupModal() {
  playSfx('click');
  const cfg = typeof getCloudConfig === 'function' ? getCloudConfig() : null;
  const isConnected = typeof isCloudEnabled === 'function' && isCloudEnabled();

  // Bug Fix #3: Show "connected" UI when default/saved config is active
  const statusEl = document.getElementById('cloud-setup-status');
  const urlInput = document.getElementById('cloud-url-input');
  const keyInput = document.getElementById('cloud-key-input');

  if (cfg) {
    if (urlInput) urlInput.value = cfg.url;
    if (keyInput) keyInput.value = cfg.anonKey;
  }

  if (isConnected && statusEl) {
    statusEl.className = 'text-xs font-semibold text-emerald-400';
    statusEl.textContent = `✓ Terhubung ke Supabase: ${cfg ? cfg.url.replace('https://', '').split('.')[0] : 'vocaplay'}.supabase.co`;
    statusEl.classList.remove('hidden');
  } else if (statusEl) {
    statusEl.classList.add('hidden');
  }

  document.getElementById('modal-cloud-db').classList.remove('hidden');
}

function closeCloudSetupModal() {
  document.getElementById('modal-cloud-db').classList.add('hidden');
}

async function handleSaveCloudConfig(e) {
  e.preventDefault();
  const url = document.getElementById('cloud-url-input').value.trim();
  const key = document.getElementById('cloud-key-input').value.trim();
  const statusEl = document.getElementById('cloud-setup-status');
  const btn = document.getElementById('btn-cloud-connect');

  btn.disabled = true;
  btn.textContent = 'Menghubungkan...';
  statusEl.classList.add('hidden');

  try {
    const ok = await testCloudConnection(url, key);
    if (ok) {
      saveCloudConfig(url, key);
      refreshCloudBadges();
      statusEl.className = 'text-xs font-semibold text-emerald-400';
      statusEl.textContent = '✓ Terhubung ke Supabase PostgreSQL! Silakan daftar/login atau lanjutkan bermain.';
      statusEl.classList.remove('hidden');
      if (currentUser && !currentUser.isGuest) {
        await pushCloudProfileNow(currentUser);
      }
      renderLeaderboard();
      playSfx('fanfare');
      showToast('Database Online terhubung!', '☁️');
      setTimeout(closeCloudSetupModal, 1100);
    }
  } catch (err) {
    statusEl.className = 'text-xs font-semibold text-rose-400';
    statusEl.textContent = `Gagal terhubung: ${err.message}. Pastikan supabase_schema.sql sudah dijalankan di Supabase SQL Editor.`;
    statusEl.classList.remove('hidden');
    playSfx('wrong');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Test & Hubungkan Cloud DB ✓';
  }
}

function disconnectCloudConfig() {
  playSfx('click');
  saveCloudConfig('', '');
  refreshCloudBadges();
  closeCloudSetupModal();
  renderLeaderboard();
  showToast('Beralih ke penyimpanan lokal.', '📱');
}

window.onload = function() {
  initTheme();
  if (typeof updateSfxToggleUI === 'function') updateSfxToggleUI();
  loadSessionUser();
  // Bug Fix #2: Update cloud status after slight delay so DOM is ready
  setTimeout(() => {
    refreshCloudBadges();
    if (typeof isCloudEnabled === 'function' && isCloudEnabled()) {
      updateCloudStatusPill('online');
      // Auto-fetch leaderboard on startup
      if (typeof cloudFetchLeaderboard === 'function') {
        cloudFetchLeaderboard('weekly').catch(() => {});
      }
      // Sync vocab + image URLs from Supabase vocaplay_vocab if populated
      if (typeof cloudFetchAllVocab === 'function') {
        cloudFetchAllVocab().then(rows => {
          if (!rows || !rows.length) return;
          const byId = new Map(VOCAB_DATA.map(v => [v.id, v]));
          rows.forEach(r => {
            const existing = byId.get(r.id);
            if (existing) {
              if (r.image) existing.image = r.image;
              if (r.meaning) existing.meaning = r.meaning;
              if (r.phonetic) existing.phonetic = r.phonetic;
            } else {
              VOCAB_DATA.push(r);
            }
          });
          updateAvailableCorpusCount();
        }).catch(() => {});
      }
    }
  }, 300);
};
