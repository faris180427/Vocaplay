/* ==============================================================
   VOCAPLAY — LARAVEL + MYSQL API CLIENT (PENGGANTI SUPABASE)
   Ganti isi cloud.js dengan file ini saat memakai Laravel + MySQL
   ============================================================== */
const LARAVEL_API_BASE = window.VOCAPLAY_API_BASE || '/api';
const STORAGE_SANCTUM_TOKEN_KEY = 'vocaplay_sanctum_token_v1';

function getApiToken() {
  return localStorage.getItem(STORAGE_SANCTUM_TOKEN_KEY) || '';
}

function setApiToken(token) {
  if (token) localStorage.setItem(STORAGE_SANCTUM_TOKEN_KEY, token);
  else localStorage.removeItem(STORAGE_SANCTUM_TOKEN_KEY);
}

function isCloudEnabled() {
  return true;
}

async function callLaravelApi(endpoint, method = 'GET', body = null, useAuth = false) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if (useAuth) {
    const token = getApiToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${LARAVEL_API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.error) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

function mapLaravelUserToApp(u) {
  if (!u) return null;
  const meta = u.profile_meta || {};
  return {
    username: u.username,
    name: u.name,
    avatar: u.avatar || 'av-sky',
    bio: u.bio || 'Building English fluency one word at a time.',
    cefr: u.cefr || 'A1',
    deckId: u.deck_id || 'ox_a1',
    xp: u.xp || 0,
    weeklyXP: u.weekly_xp || 0,
    monthlyXP: u.monthly_xp || 0,
    coins: u.coins || 0,
    streak: u.streak || 0,
    streakFreezes: u.streak_freezes || 0,
    extraShields: u.extra_shields || 0,
    lastActiveDate: u.last_active_date || null,
    gamesPlayed: u.games_played || 0,
    perfectGames: u.perfect_games || 0,
    totalAnswered: u.total_answered || 0,
    totalCorrect: u.total_correct || 0,
    joinedDate: (u.created_at || '').slice(0, 10) || getTodayISO(),
    weekDaysActive: meta.weekDaysActive || [false, false, false, false, false, false, false],
    masteredWords: meta.masteredWords || [],
    weakWords: meta.weakWords || [],
    customWords: meta.customWords || [],
    unlockedBadges: meta.unlockedBadges || [],
    completedNodes: meta.completedNodes || [],
    claimedChests: meta.claimedChests || [],
    bossClearedLevels: meta.bossClearedLevels || [],
    highScores: meta.highScores || {},
    dailyMission: meta.dailyMission || null,
    isGuest: false
  };
}

async function cloudRegisterAccount(username, name, rawPassword, avatar) {
  const res = await callLaravelApi('/register', 'POST', {
    username,
    name,
    password: rawPassword,
    avatar
  });
  if (res && res.ok && res.token) {
    setApiToken(res.token);
    return { ok: true, user: mapLaravelUserToApp(res.user) };
  }
  return { ok: false, error: res.error || res.message || 'Gagal mendaftar.' };
}

async function cloudLoginAccount(username, rawPassword, legacyPassword = null) {
  const payload = { username, password: rawPassword };
  if (legacyPassword) payload.legacy_password = legacyPassword;
  const res = await callLaravelApi('/login', 'POST', payload);
  if (res && res.ok && res.token) {
    setApiToken(res.token);
    return { ok: true, user: mapLaravelUserToApp(res.user) };
  }
  return { ok: false, error: res.error || res.message || 'Login gagal.' };
}

let cloudSaveTimer = null;
function scheduleCloudSync(userObj) {
  if (!userObj || userObj.isGuest || !getApiToken()) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => {
    pushCloudProfileNow(userObj);
  }, 500);
}

async function pushCloudProfileNow(userObj) {
  if (!userObj || userObj.isGuest || !getApiToken()) return false;
  try {
    const res = await callLaravelApi('/progress', 'POST', {
      name: userObj.name,
      avatar: userObj.avatar,
      bio: userObj.bio,
      cefr: userObj.cefr,
      deck_id: userObj.deckId,
      xp: userObj.xp,
      weekly_xp: userObj.weeklyXP,
      monthly_xp: userObj.monthlyXP,
      coins: userObj.coins,
      streak: userObj.streak,
      streak_freezes: userObj.streakFreezes || 0,
      extra_shields: userObj.extraShields || 0,
      games_played: userObj.gamesPlayed || 0,
      perfect_games: userObj.perfectGames || 0,
      total_answered: userObj.totalAnswered || 0,
      total_correct: userObj.totalCorrect || 0,
      profile_meta: {
        weekDaysActive: userObj.weekDaysActive,
        masteredWords: userObj.masteredWords,
        weakWords: userObj.weakWords,
        customWords: userObj.customWords,
        unlockedBadges: userObj.unlockedBadges,
        completedNodes: userObj.completedNodes,
        claimedChests: userObj.claimedChests,
        bossClearedLevels: userObj.bossClearedLevels,
        highScores: userObj.highScores,
        dailyMission: userObj.dailyMission
      }
    }, true);
    // Server adalah otoritas progres: bila nilai klien dianggap tidak wajar, ikuti nilai server.
    if (res && res.ok && res.clamped && res.user) {
      userObj.xp = res.user.xp;
      userObj.weeklyXP = res.user.weekly_xp;
      userObj.monthlyXP = res.user.monthly_xp;
      userObj.coins = res.user.coins;
      userObj.streak = res.user.streak;
      if (typeof updateHeaderStats === 'function') updateHeaderStats();
    }
    updateCloudStatusPill(res && res.ok ? 'synced' : 'error');
    return Boolean(res && res.ok);
  } catch (err) {
    console.warn('MySQL sync warning:', err);
    updateCloudStatusPill('error');
    return false;
  }
}

let cachedCloudLeaderboard = { weekly: null, monthly: null, alltime: null };
async function cloudFetchLeaderboard(period = 'weekly') {
  try {
    const rows = await callLaravelApi(`/leaderboard?period=${encodeURIComponent(period)}`);
    if (Array.isArray(rows)) {
      cachedCloudLeaderboard[period] = rows.map(r => ({
        username: r.username,
        name: r.name,
        avatar: r.avatar || 'av-sky',
        cefr: r.cefr || 'A1',
        xp: r.xp || 0,
        weeklyXP: r.weekly_xp || 0,
        monthlyXP: r.monthly_xp || 0
      }));
      updateCloudStatusPill('online');
      return cachedCloudLeaderboard[period];
    }
  } catch (err) {
    console.warn('Leaderboard fetch warning:', err);
    updateCloudStatusPill('error');
  }
  return cachedCloudLeaderboard[period] || null;
}

async function cloudFetchAllVocab() {
  try {
    const rows = await callLaravelApi('/vocabs?all=1');
    if (!Array.isArray(rows)) return [];
    return rows.map(r => ({
      id: r.code,
      word: r.word,
      cefr: r.cefr,
      category: r.category,
      phonetic: r.phonetic || `/${r.word}/`,
      meaning: r.meaning,
      definition: r.definition || '',
      image: r.image_url || '',
      sentence: Array.isArray(r.sentence_tokens) ? r.sentence_tokens : [],
      sentenceIndo: r.sentence_indo || ''
    }));
  } catch (err) {
    console.warn('MySQL vocab fetch skipped:', err.message);
    return [];
  }
}

function updateCloudStatusPill(state = 'auto') {
  const pill = document.getElementById('cloud-status-pill');
  const dot = document.getElementById('cloud-status-dot');
  const label = document.getElementById('cloud-status-label');
  if (!pill || !dot || !label) return;
  if (state === 'error') {
    dot.className = 'w-2 h-2 rounded-full bg-amber-400';
    label.textContent = 'MySQL Retry';
  } else if (state === 'synced') {
    dot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    label.textContent = 'MySQL Saved';
    setTimeout(() => {
      dot.className = 'w-2 h-2 rounded-full bg-emerald-400';
      label.textContent = 'MySQL Online';
    }, 1500);
  } else {
    dot.className = 'w-2 h-2 rounded-full bg-emerald-400';
    label.textContent = 'MySQL Online';
  }
}
