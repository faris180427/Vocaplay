/* ==============================================================
   VOCAPLAY ONLINE DATABASE CLIENT (SUPABASE REST / RPC)
   ============================================================== */
const STORAGE_CLOUD_CFG_KEY = 'vocaplay_cloud_config_v1';

// ── DEFAULT SUPABASE PROJECT (pre-configured) ──────────────────
const VOCAPLAY_DEFAULT_CLOUD = {
  url: 'https://lkbkfpgclizwwskkrvny.supabase.co',
  anonKey: 'sb_publishable_That7S-oNbsRhyJVE_ItBw_oEahA0Sm'
};

function getCloudConfig() {
  // 1. Runtime override (window.VOCAPLAY_CLOUD_CONFIG)
  if (window.VOCAPLAY_CLOUD_CONFIG && window.VOCAPLAY_CLOUD_CONFIG.url && window.VOCAPLAY_CLOUD_CONFIG.anonKey) {
    return {
      url: String(window.VOCAPLAY_CLOUD_CONFIG.url).trim().replace(/\/+$/, ''),
      anonKey: String(window.VOCAPLAY_CLOUD_CONFIG.anonKey).trim()
    };
  }
  // 2. User-saved config from localStorage
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_CLOUD_CFG_KEY) || 'null');
    if (raw && raw.url && raw.anonKey) {
      return {
        url: String(raw.url).trim().replace(/\/+$/, ''),
        anonKey: String(raw.anonKey).trim()
      };
    }
  } catch {}
  // 3. Default project (always available)
  return VOCAPLAY_DEFAULT_CLOUD;
}

function saveCloudConfig(url, anonKey) {
  const cleanUrl = String(url || '').trim().replace(/\/+$/, '');
  const cleanKey = String(anonKey || '').trim();
  if (!cleanUrl || !cleanKey) {
    localStorage.removeItem(STORAGE_CLOUD_CFG_KEY);
    return null;
  }
  const cfg = { url: cleanUrl, anonKey: cleanKey };
  localStorage.setItem(STORAGE_CLOUD_CFG_KEY, JSON.stringify(cfg));
  return cfg;
}

function isCloudEnabled() {
  return true; // Default project always configured
}

async function callSupabaseRpc(fnName, params = {}, overrideCfg = null) {
  const cfg = overrideCfg || getCloudConfig();
  if (!cfg) throw new Error('Cloud DB not configured');

  const res = await fetch(`${cfg.url}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return await res.json();
}

async function testCloudConnection(url, anonKey) {
  const cleanCfg = {
    url: String(url || '').trim().replace(/\/+$/, ''),
    anonKey: String(anonKey || '').trim()
  };
  const rows = await callSupabaseRpc('vocaplay_get_leaderboard', { p_period: 'weekly' }, cleanCfg);
  return Array.isArray(rows);
}

async function cloudRegisterAccount(username, name, passwordHash, avatar, joinedDate) {
  return await callSupabaseRpc('vocaplay_register', {
    p_username: username,
    p_name: name,
    p_password_hash: passwordHash,
    p_avatar: avatar,
    p_joined_date: joinedDate
  });
}

async function cloudLoginAccount(username, passwordHash) {
  return await callSupabaseRpc('vocaplay_login', {
    p_username: username,
    p_password_hash: passwordHash
  });
}

let cloudSaveTimer = null;
function scheduleCloudSync(userObj) {
  if (!userObj || userObj.isGuest || !userObj.passwordHash || !isCloudEnabled()) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => {
    pushCloudProfileNow(userObj);
  }, 450);
}

async function pushCloudProfileNow(userObj) {
  if (!userObj || userObj.isGuest || !userObj.passwordHash || !isCloudEnabled()) return false;
  try {
    const payload = {
      name: userObj.name,
      avatar: userObj.avatar,
      bio: userObj.bio,
      cefr: userObj.cefr,
      deckId: userObj.deckId,
      xp: userObj.xp,
      weeklyXP: userObj.weeklyXP,
      monthlyXP: userObj.monthlyXP,
      coins: userObj.coins,
      streak: userObj.streak,
      lastActiveDate: userObj.lastActiveDate,
      weekDaysActive: userObj.weekDaysActive,
      gamesPlayed: userObj.gamesPlayed,
      perfectGames: userObj.perfectGames,
      totalAnswered: userObj.totalAnswered,
      totalCorrect: userObj.totalCorrect,
      masteredWords: userObj.masteredWords,
      weakWords: userObj.weakWords,
      customWords: userObj.customWords,
      unlockedBadges: userObj.unlockedBadges,
      dailyMission: userObj.dailyMission
    };
    const res = await callSupabaseRpc('vocaplay_save_profile', {
      p_username: userObj.username,
      p_password_hash: userObj.passwordHash,
      p_payload: payload
    });
    updateCloudStatusPill(res && res.ok ? 'synced' : 'error');
    return Boolean(res && res.ok);
  } catch (err) {
    console.warn('Cloud sync warning:', err);
    updateCloudStatusPill('error');
    return false;
  }
}

let cachedCloudLeaderboard = { weekly: null, monthly: null, alltime: null };
async function cloudFetchLeaderboard(period = 'weekly') {
  if (!isCloudEnabled()) return null;
  try {
    const rows = await callSupabaseRpc('vocaplay_get_leaderboard', { p_period: period });
    if (Array.isArray(rows)) {
      cachedCloudLeaderboard[period] = rows;
      updateCloudStatusPill('online');
      return rows;
    }
  } catch (err) {
    console.warn('Leaderboard fetch warning:', err);
    updateCloudStatusPill('error');
  }
  return cachedCloudLeaderboard[period] || null;
}

function updateCloudStatusPill(state = 'auto') {
  const pill = document.getElementById('cloud-status-pill');
  const dot = document.getElementById('cloud-status-dot');
  const label = document.getElementById('cloud-status-label');
  if (!pill || !dot || !label) return;

  if (!isCloudEnabled()) {
    dot.className = 'w-2 h-2 rounded-full bg-slate-400';
    label.textContent = 'Local DB';
    pill.title = 'Klik untuk hubungkan Database Online (Supabase)';
    return;
  }
  if (state === 'error') {
    dot.className = 'w-2 h-2 rounded-full bg-amber-400';
    label.textContent = 'Cloud Retry';
  } else if (state === 'synced') {
    dot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    label.textContent = 'Cloud Saved';
    setTimeout(() => {
      if (isCloudEnabled()) {
        dot.className = 'w-2 h-2 rounded-full bg-emerald-400';
        label.textContent = 'Cloud Online';
      }
    }, 1500);
  } else {
    dot.className = 'w-2 h-2 rounded-full bg-emerald-400';
    label.textContent = 'Cloud Online';
  }
}

async function cloudFetchAllVocab() {
  if (!isCloudEnabled()) return [];
  const allRows = [];
  const pageSize = 2000;
  try {
    for (let offset = 0; offset < 10000; offset += pageSize) {
      const batch = await callSupabaseRpc('vocaplay_get_vocab', {
        p_limit: pageSize,
        p_offset: offset
      });
      if (!Array.isArray(batch) || batch.length === 0) break;
      allRows.push(...batch);
      if (batch.length < pageSize) break;
    }
    return allRows;
  } catch (err) {
    console.warn('Cloud vocab fetch skipped:', err.message);
    return [];
  }
}
