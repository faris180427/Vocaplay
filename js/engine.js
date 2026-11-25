/* ==============================================================
   VOCAPLAY — GAME SESSION ENGINE, SCORING & KEYBOARD SHORTCUTS
   ============================================================== */

let mistakeBannerTimer = null;

function hideMistakeReview() {
  clearTimeout(mistakeBannerTimer);
  const el = document.getElementById('mistake-review-banner');
  if (el) el.classList.add('hidden');
}

function showMistakeReview(item) {
  if (!item) return;
  const el = document.getElementById('mistake-review-banner');
  if (!el) return;
  document.getElementById('mistake-review-word').textContent = item.word || '';
  document.getElementById('mistake-review-phonetic').textContent = item.phonetic || '';
  document.getElementById('mistake-review-meaning').textContent = item.meaning || item.definition || '';
  const audioBtn = document.getElementById('mistake-review-audio');
  if (audioBtn) audioBtn.onclick = () => speakText(item.word);
  el.classList.remove('hidden');
  clearTimeout(mistakeBannerTimer);
  mistakeBannerTimer = setTimeout(hideMistakeReview, 3500);
}

function stopAllActiveGameTimers() {
  clearInterval(fastVocabTimerInterval);
  if (typeof mysteryRevealInterval !== 'undefined') clearInterval(mysteryRevealInterval);
  clearInterval(shooterInterval);
  clearInterval(shooterSpawnInterval);
  if (typeof shooterAnimFrame !== 'undefined' && shooterAnimFrame) {
    cancelAnimationFrame(shooterAnimFrame);
    shooterAnimFrame = null;
  }
  hideMistakeReview();
}

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
  streak++;
  playSfx('correct', streak);
  totalQuestionsAnswered++;
  correctAnswersCount++;

  const tier = (currentItem && currentItem.cefr) || (currentCEFR === 'ALL' ? 'B1' : currentCEFR);
  const conf = CEFR_CONFIG[tier] || CEFR_CONFIG.A1;
  const streakMultiplier = streak >= 5 ? 2.0 : (streak >= 3 ? 1.5 : 1.0);
  if (streak >= 5) unlockBadge('streak_5');

  const earned = Math.round(points * conf.xpMult * streakMultiplier);
  const boostMult = (typeof isXpBoostActive === 'function' && isXpBoostActive()) ? 2 : 1;
  const xpGain = Math.round(15 * conf.xpMult) * boostMult;
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
    // Spaced Repetition (SRS) bertahap: butuh 3x jawaban benar untuk lulus dari Memory Vault
    if (currentItem && Array.isArray(currentUser.weakWords)) {
      const idx = currentUser.weakWords.findIndex(w => w.id === currentItem.id);
      if (idx !== -1) {
        const entry = currentUser.weakWords[idx];
        const nextStage = (entry.srsStage || 0) + 1;
        if (nextStage >= 3) {
          currentUser.weakWords.splice(idx, 1);
          showToast(`"${currentItem.word}" lulus Memory Vault (3/3)!`, '✓');
        } else {
          entry.srsStage = nextStage;
          entry.lastReviewed = getTodayISO();
        }
      }
    }
    saveCurrentAccountState();
  }

  updateHeaderStats();
  unlockBadge('first_word');
  if (tier === 'C1') unlockBadge('c1_conqueror');
  if (typeof checkMilestoneBadges === 'function') checkMilestoneBadges();

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
    if (item) {
      const existing = currentUser.weakWords.find(w => w.id === item.id);
      if (existing) {
        existing.srsStage = 0; // Reset progress SRS jika salah lagi
        existing.lastReviewed = getTodayISO();
      } else {
        currentUser.weakWords.push({ ...item, srsStage: 0, lastReviewed: getTodayISO() });
      }
    }
    saveCurrentAccountState();
  }
  if (item) {
    reviewWordsList.add(item);
    showMistakeReview(item);
  }

  updateHeaderStats();
  const streakBanner = document.getElementById('streak-banner');
  if (streakBanner) streakBanner.classList.add('opacity-0');

  if (lives <= 0) {
    clearInterval(fastVocabTimerInterval);
    setTimeout(endGameSession, 600);
  }
}

function startGame(mode, keepWeakFlag = false) {
  playSfx('click');
  getAudioContext();
  stopAllActiveGameTimers();
  if (!keepWeakFlag) isPracticingWeakWords = false;
  currentMode = mode;
  score = 0;
  lives = 3;
  if (currentUser && (currentUser.extraShields || 0) > 0) {
    currentUser.extraShields--;
    lives = 4;
    saveCurrentAccountState();
    showToast('Extra Shield aktif (+1 Nyawa ekstra)!', '✓');
  }
  streak = 0;
  sessionXP = 0;
  sessionDiamonds = 0;
  totalQuestionsAnswered = 0;
  correctAnswersCount = 0;
  roundNumber = 0;
  sessionStartTime = Date.now();
  reviewWordsList.clear();

  updateHeaderStats();

  ['tab-learn', 'tab-path', 'tab-decks', 'tab-quests', 'tab-leaderboard', 'tab-profile', 'screen-results'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const gameplay = document.getElementById('screen-gameplay');
  gameplay.classList.remove('hidden');
  gameplay.classList.remove('animate-fade-in');
  void gameplay.offsetWidth;
  gameplay.classList.add('animate-fade-in');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const modeNames = {
    'fast-vocab': 'Fast Vocab',
    'sentence-builder': 'Sentence Builder',
    'listening-dictation': 'Acoustic Dictation',
    'voice-duel': 'Voice Duel',
    'word-shooter': 'Penembak Kata',
    'vocab-wordle': 'Vocab Wordle',
    'word-connections': 'Word Connections',
    'boss-battle': 'Lexicon Boss Battle',
    'dialogue-quest': 'Dialogue Quest',
    'mixed-lesson': 'Jalur Belajar'
  };
  document.getElementById('gameplay-mode-badge').textContent = modeNames[mode] || mode;
  document.getElementById('gameplay-level-badge').textContent = isPracticingWeakWords ? 'WEAK' : currentCEFR;

  [
    'subgame-fast-vocab', 'subgame-sentence-builder', 'subgame-listening-dictation',
    'subgame-voice-duel', 'subgame-word-shooter', 'subgame-vocab-wordle',
    'subgame-word-connections', 'subgame-boss-battle', 'subgame-dialogue-quest',
    'subgame-mixed-lesson'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const activeSub = document.getElementById(`subgame-${mode}`);
  if (activeSub) activeSub.classList.remove('hidden');

  if (mode === 'fast-vocab') nextFastVocabRound();
  else if (mode === 'sentence-builder') nextSentenceBuilderRound();
  else if (mode === 'listening-dictation') nextListeningDictationRound();
  else if (mode === 'voice-duel') nextVoiceDuelRound();
  else if (mode === 'word-shooter') startWordShooterGame();
  else if (mode === 'vocab-wordle') startVocabWordleGame();
  else if (mode === 'word-connections') startWordConnectionsGame();
  else if (mode === 'boss-battle') startBossBattleGame();
  else if (mode === 'dialogue-quest') startDialogueQuestGame(0);
  else if (mode === 'mixed-lesson') initMixedLessonUI();
}

function endGameSession() {
  stopAllActiveGameTimers();
  playSfx('fanfare');
  triggerConfetti();

  const elapsedSec = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
  const mins = Math.floor(elapsedSec / 60);
  const secs = String(elapsedSec % 60).padStart(2, '0');

  const isWin = lives > 0;
  const maxLives = currentMode === 'memory-flip' ? 6 : 3;
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
    if (isWin && lives === maxLives) {
      currentUser.perfectGames++;
      unlockBadge('perfect_game');
    }
    if (isWin) {
      unlockBadge('lesson_done');
      if (currentMode === 'word-shooter') unlockBadge('shooter_ace');
    }

    currentUser.dailyMission.xpToday += bonusXP;
    currentUser.dailyMission.diamondsToday += bonusGems;
    currentUser.dailyMission.gamesToday++;

    const today = getTodayISO();
    if (currentUser.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000);
      const yISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (currentUser.lastActiveDate === yISO) {
        currentUser.streak = (currentUser.streak || 0) + 1;
      } else if ((currentUser.streakFreezes || 0) > 0 && (currentUser.streak || 0) > 0) {
        currentUser.streakFreezes--;
        currentUser.streak = (currentUser.streak || 0) + 1;
        showToast('Streak Freeze melindungi streak-mu!', '✓');
      } else {
        currentUser.streak = 1;
      }
      currentUser.lastActiveDate = today;
    }
    currentUser.weekDaysActive[getMondayDayIndex()] = true;

    // Personal Best per mode
    if (!currentUser.highScores || typeof currentUser.highScores !== 'object') {
      currentUser.highScores = {};
    }
    const prevBest = currentUser.highScores[currentMode] || 0;
    const isNewRecord = score > prevBest && score > 0;
    if (isNewRecord) currentUser.highScores[currentMode] = score;
    const pbEl = document.getElementById('results-personal-best');
    if (pbEl) {
      pbEl.textContent = isNewRecord
        ? `Rekor Baru! ${score} pts`
        : `Rekor Tertinggi: ${Math.max(prevBest, score)} pts`;
    }

    saveCurrentAccountState();
    if (typeof checkMilestoneBadges === 'function') checkMilestoneBadges();
  }

  refreshAllUI();
  const ranked = getRankedEntries('weekly');
  const me = ranked.find(r => r.isMe);

  document.getElementById('results-title').textContent = isWin ? 'Sesi Selesai!' : 'Latihan Berakhir';
  document.getElementById('results-subtitle').textContent = currentUser && !currentUser.isGuest
    ? `Progres disimpan ke akun @${currentUser.username}`
    : 'Progres tersimpan di perangkat ini.';
  const guestCta = document.getElementById('results-guest-cta');
  if (guestCta) guestCta.classList.toggle('hidden', !(currentUser && currentUser.isGuest));
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
      chip.innerHTML = `<span class="code-font font-bold text-slate-800">${w.word}</span> <span class="text-slate-400 text-[11px]">(${getShortMeaning(w, 26)})</span>`;
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
  const resEl = document.getElementById('screen-results');
  resEl.classList.remove('hidden');
  resEl.classList.add('animate-fade-in');
}

document.addEventListener('keydown', (e) => {
  const gameplayVisible = !document.getElementById('screen-gameplay')?.classList.contains('hidden');
  if (!gameplayVisible) return;

  if (currentMode === 'vocab-wordle' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (e.key === 'Enter' || e.key === 'Backspace' || /^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      handleWordleKey(e.key);
      return;
    }
  }

  if (e.key === 'Enter') {
    const active = document.activeElement?.id;
    if (currentMode === 'listening-dictation' && active === 'dictation-user-input') checkDictationAnswer();
    else if (currentMode === 'sentence-builder') checkSentenceSolution();
  }
});
