/* ==============================================================
   VOCAPLAY — PROFILE, DAILY MISSIONS, WEAK WORDS & BADGES
   ============================================================== */

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

  renderMasteryBreakdown();
  updateWeakWordsUI();
}

function renderMasteryBreakdown() {
  if (!currentUser) return;
  const masteredSet = new Set(currentUser.masteredWords || []);
  const total = VOCAB_DATA.length || 1;
  const masteredCount = VOCAB_DATA.filter(v => masteredSet.has(v.id)).length;
  const pct = Math.min(100, Math.round((masteredCount / total) * 100));

  const pill = document.getElementById('mastery-summary-pill');
  const bar = document.getElementById('mastery-overall-bar');
  const grid = document.getElementById('mastery-cefr-breakdown');
  if (pill) pill.textContent = `${masteredCount.toLocaleString()} / ${total.toLocaleString()} (${pct}%)`;
  if (bar) bar.style.width = `${pct}%`;
  if (!grid) return;

  grid.innerHTML = '';
  ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
    const tierWords = VOCAB_DATA.filter(v => v.cefr === lvl);
    const tierMastered = tierWords.filter(v => masteredSet.has(v.id)).length;
    const tierPct = tierWords.length ? Math.round((tierMastered / tierWords.length) * 100) : 0;
    const cell = document.createElement('div');
    cell.className = 'p-2 rounded-xl app-subsurface border border-slate-200 text-center';
    cell.innerHTML = `
      <div class="text-[10px] font-mono font-bold text-sky-400">${lvl}</div>
      <div class="code-font text-[11px] font-bold mt-0.5">${tierMastered}/${tierWords.length}</div>
      <div class="w-full bg-slate-200 h-1 rounded-full mt-1 overflow-hidden">
        <div class="bg-emerald-500 h-full" style="width:${tierPct}%"></div>
      </div>
    `;
    grid.appendChild(cell);
  });
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
      chip.textContent = `${w.word} (${getShortMeaning(w, 26)})`;
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

function openAchievementsModal() {
  playSfx('click');
  document.getElementById('modal-achievements').classList.remove('hidden');
  renderAchievementsList();
}

function closeAchievementsModal() {
  playSfx('click');
  document.getElementById('modal-achievements').classList.add('hidden');
}

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

function checkMilestoneBadges() {
  if (!currentUser) return;
  const mastered = (currentUser.masteredWords || []).length;
  const games = currentUser.gamesPlayed || 0;
  const streakDays = currentUser.streak || 0;
  const xp = currentUser.xp || 0;

  if (mastered >= 25) unlockBadge('words_25');
  if (mastered >= 100) unlockBadge('words_100');
  if (mastered >= 500) unlockBadge('words_500');
  if (mastered >= 1000) unlockBadge('words_1000');
  if (games >= 5) unlockBadge('games_5');
  if (games >= 20) unlockBadge('games_20');
  if (streakDays >= 3) unlockBadge('streak_3_days');
  if (streakDays >= 7) unlockBadge('streak_7_days');
  if (xp >= 500) unlockBadge('xp_500');
  if (xp >= 2000) unlockBadge('xp_2000');
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
