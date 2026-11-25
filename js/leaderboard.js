/* ==============================================================
   VOCAPLAY — LIVE LEADERBOARD & PODIUM
   ============================================================== */

let cloudLbFetching = false;

function setLeaderboardPeriod(period) {
  playSfx('click');
  leaderboardPeriod = period;
  ['weekly', 'monthly', 'alltime'].forEach(p => {
    const btn = document.getElementById(`lb-tab-${p}`);
    if (btn) {
      btn.className = p === period
        ? 'flex-1 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs transition'
        : 'flex-1 py-1.5 rounded-xl text-slate-500 font-medium text-xs transition';
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
    cloudRows.forEach(r => byUsername.set(r.username.toLowerCase(), { ...r, isRegistered: true, isNpc: false }));
    if (cloudRows.length < 3) {
      NPC_COMPETITORS.forEach(npc => {
        if (!byUsername.has(npc.username)) byUsername.set(npc.username, { ...npc, isNpc: true });
      });
    }
  } else {
    NPC_COMPETITORS.forEach(npc => byUsername.set(npc.username, { ...npc, isNpc: true }));
    Object.values(loadAllAccounts()).forEach(acc => {
      byUsername.set(acc.username.toLowerCase(), {
        username: acc.username,
        name: acc.name,
        avatar: acc.avatar || 'av-sky',
        cefr: acc.cefr || 'A1',
        xp: acc.xp || 0,
        weeklyXP: acc.weeklyXP || 0,
        monthlyXP: acc.monthlyXP || 0,
        isRegistered: true,
        isNpc: false
      });
    });
  }

  if (currentUser) {
    byUsername.set(currentUser.username.toLowerCase(), {
      username: currentUser.username,
      name: currentUser.name,
      avatar: currentUser.avatar || 'av-sky',
      cefr: currentUser.cefr || 'A1',
      xp: currentUser.xp || 0,
      weeklyXP: currentUser.weeklyXP || 0,
      monthlyXP: currentUser.monthlyXP || 0,
      isGuest: currentUser.isGuest,
      isNpc: false
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
  const isOnline = typeof isCloudEnabled === 'function' && isCloudEnabled();
  const hasNpc = ranked.some(r => r.isNpc);
  const modeTag = isOnline
    ? (hasNpc ? 'Online + Bot Latihan' : 'Online')
    : 'Lokal + Bot Latihan';
  const myXP = me ? me.displayXP : 0;
  const leagueName = myXP >= 1000 ? 'Obsidian League' : (myXP >= 500 ? 'Sapphire League' : (myXP >= 250 ? 'Gold League' : (myXP >= 100 ? 'Silver League' : 'Bronze League')));
  const zoneLabel = me && me.rank <= 3 ? 'Zona Promosi (Top 3)' : 'Zona Aman';
  if (bannerName && me) bannerName.textContent = `${leagueName} • Peringkat #${me.rank} (${modeTag})`;
  if (bannerSub && me) {
    const periodLabel = leaderboardPeriod === 'weekly' ? 'Minggu Ini' : leaderboardPeriod === 'monthly' ? 'Bulan Ini' : 'Sepanjang Waktu';
    bannerSub.textContent = hasNpc
      ? `${me.displayXP} XP • ${zoneLabel} (${periodLabel}) • Termasuk bot latihan`
      : `${me.displayXP} XP • ${zoneLabel} (${periodLabel})`;
  }

  const podium = document.getElementById('leaderboard-podium');
  const list = document.getElementById('leaderboard-list');
  if (!podium || !list) return;

  const top3 = [ranked[1], ranked[0], ranked[2]].filter(Boolean);
  podium.innerHTML = '';
  top3.forEach(entry => {
    const isFirst = entry.rank === 1;
    const col = document.createElement('div');
    col.className = 'flex flex-col items-center';
    const ring = entry.isMe ? 'ring-2 ring-sky-400' : '';
    const barColor = isFirst
      ? 'bg-indigo-600 text-white h-24 w-20'
      : (entry.rank === 2 ? 'bg-sky-500/20 text-sky-400 h-16 w-16 border border-sky-400/30' : 'bg-slate-700/40 text-slate-300 h-14 w-16 border border-slate-600/30');
    col.innerHTML = `
      ${isFirst ? `<div class="text-amber-400 mb-1">${getAppIconSvg('crown', 'w-5 h-5')}</div>` : ''}
      <div class="${isFirst ? 'w-14 h-14' : 'w-11 h-11'} ${ring}">
        ${getAvatarMarkup(entry.avatar, entry.name, isFirst ? 'w-14 h-14 rounded-2xl text-sm' : 'w-11 h-11 rounded-xl text-xs')}
      </div>
      <span class="text-xs font-bold mt-1.5 max-w-[92px] truncate flex items-center justify-center gap-1">${entry.isMe ? 'You' : escapeHtml(entry.name)}${entry.isNpc ? '<span class="text-[8px] font-mono uppercase bg-slate-500/25 text-slate-300 px-1 py-0.2 rounded">BOT</span>' : ''}</span>
      <span class="code-font text-[10px] ${isFirst ? 'text-amber-400 font-extrabold' : 'text-sky-400 font-bold'}">${entry.displayXP} XP</span>
      <div class="${barColor} rounded-t-2xl flex items-center justify-center text-xl font-black mt-2 shadow-sm font-mono">${entry.rank}</div>
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
        ${getAvatarMarkup(entry.avatar, entry.name, 'w-8 h-8 rounded-xl')}
        <div>
          <span class="text-xs font-bold">${escapeHtml(entry.name)} ${entry.isMe ? '<span class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded ml-1 font-bold">YOU</span>' : (entry.isNpc ? '<span class="text-[9px] font-mono uppercase bg-slate-500/20 text-slate-400 border border-slate-500/30 px-1.5 py-0.5 rounded ml-1">BOT</span>' : '')}</span>
          <span class="text-[10px] text-slate-400 block font-mono">CEFR ${entry.cefr}</span>
        </div>
      </div>
      <span class="code-font text-xs font-bold ${entry.isMe ? 'text-sky-400' : 'text-slate-400'}">${entry.displayXP} XP</span>
    `;
    list.appendChild(row);
  });
}
