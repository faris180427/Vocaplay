/* ==============================================================
   VOCAPLAY — UI, NAVIGATION, THEME, MODALS & BOOTSTRAP
   ============================================================== */

function initTheme() {
  const saved = localStorage.getItem('vocaplay_theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('theme-dark', isDark);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) btn.innerHTML = getAppIconSvg(isDark ? 'sun' : 'moon', 'w-4 h-4');
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

  ['tab-learn', 'tab-path', 'tab-decks', 'tab-quests', 'tab-leaderboard', 'tab-profile', 'screen-gameplay', 'screen-results'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.remove('animate-fade-in');
    void target.offsetWidth;
    target.classList.add('animate-fade-in');
  }

  ['learn', 'path', 'decks', 'quests', 'leaderboard', 'profile'].forEach(name => {
    const btn = document.getElementById(`nav-btn-${name}`);
    if (btn) btn.className = name === tabId ? 'flex flex-col items-center text-indigo-400 p-1' : 'flex flex-col items-center text-slate-400 p-1';
    const side = document.getElementById(`side-btn-${name}`);
    if (side) side.className = name === tabId
      ? 'sidebar-link-active flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left'
      : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition text-left';
  });

  ['listening', 'speaking', 'vocab'].forEach(s => {
    const el = document.getElementById(`side-btn-${s}`);
    if (el) el.className = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition text-left';
  });

  if (tabId === 'path' && typeof renderLearningPath === 'function') renderLearningPath();
  if (tabId === 'decks') renderDecksHub();
  if (tabId === 'leaderboard') renderLeaderboard();
  if (tabId === 'profile') renderProfile();
  if (tabId === 'quests') renderQuests();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterHubSection(section) {
  switchAppTab('learn');
  ['all', 'vocab', 'listening', 'speaking'].forEach(s => {
    const pill = document.getElementById(`hub-pill-${s}`);
    if (pill) {
      pill.className = s === section
        ? 'tactile-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white'
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

  const nameText = currentUser.isGuest ? 'Masuk' : currentUser.name;
  const headAvatar = document.getElementById('header-account-avatar');
  if (headAvatar) headAvatar.innerHTML = getAvatarMarkup(currentUser.avatar, currentUser.name, 'w-6 h-6 rounded-lg text-[10px]');
  document.getElementById('header-account-name').textContent = nameText;

  const sideAvatar = document.getElementById('sidebar-account-avatar');
  const sideLabel = document.getElementById('sidebar-account-label');
  if (sideAvatar) sideAvatar.innerHTML = getAvatarMarkup(currentUser.avatar, currentUser.name, 'w-7 h-7 rounded-xl text-xs');
  if (sideLabel) sideLabel.textContent = currentUser.isGuest ? 'MASUK / DAFTAR' : `${currentUser.name} (${xp} XP)`;

  const streakBanner = document.getElementById('banner-streak-text');
  if (streakBanner) {
    streakBanner.innerHTML = `<span class="inline-flex items-center gap-1">${getAppIconSvg('flame', 'w-3.5 h-3.5 text-amber-400')} <span>${currentUser.streak || 0} Days Streak</span></span>`;
  }
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

function updateDailyRecommendationCard() {
  const tagEl = document.getElementById('daily-rec-tag');
  const titleEl = document.getElementById('daily-rec-title');
  const descEl = document.getElementById('daily-rec-desc');
  const btnEl = document.getElementById('daily-rec-btn');
  if (!tagEl || !titleEl || !descEl || !btnEl) return;

  const weakCount = currentUser && Array.isArray(currentUser.weakWords) ? currentUser.weakWords.length : 0;
  if (weakCount > 0) {
    tagEl.textContent = 'Prioritas Memory Vault (SRS)';
    titleEl.textContent = `Latih Ulang ${weakCount} Kata Sulit`;
    descEl.textContent = 'Jawab benar 3 kali bertahap agar kata benar-benar melekat di ingatan.';
    btnEl.textContent = 'Latih Kata Sulit →';
    btnEl.onclick = () => practiceWeakWords();
    return;
  }

  const dailyModes = [
    { mode: 'vocab-wordle', title: 'Vocab Wordle — Teka-Teki 5 Huruf', desc: 'Asah logika ejaan bahasa Inggris dengan petunjuk warna hijau & kuning.' },
    { mode: 'word-shooter', title: 'Penembak Kata — Arcade Laser', desc: 'Kunci target kata yang jatuh dan ledakkan tiap huruf dengan kombo laser.' },
    { mode: 'word-connections', title: 'Word Connections — Puzzle 4x4', desc: 'Kelompokkan 16 kata acak menjadi 4 kategori makna tersembunyi.' },
    { mode: 'boss-battle', title: 'Lexicon Boss Battle — Mini RPG', desc: 'Kalahkan 3 Boss beruntun dengan Critical Hit dan serangan Ultimate.' },
    { mode: 'dialogue-quest', title: 'Dialogue Quest — Roleplay Nyata', desc: 'Latih percakapan bahasa Inggris di kafe London, bandara, & wawancara kerja.' }
  ];
  const dayIdx = new Date().getDate() % dailyModes.length;
  const pick = dailyModes[dayIdx];
  tagEl.textContent = 'Rekomendasi Hari Ini';
  titleEl.textContent = pick.title;
  descEl.textContent = pick.desc;
  btnEl.textContent = 'Mulai Sekarang →';
  btnEl.onclick = () => startGame(pick.mode);
}

/* ---------- 2x XP BOOST (10 MENIT) ---------- */
let xpBoostInterval = null;

function isXpBoostActive() {
  return Boolean(currentUser && currentUser.xpBoostUntil && Date.now() < currentUser.xpBoostUntil);
}

function activateXpBoost(minutes = 10) {
  if (!currentUser) return;
  const now = Date.now();
  const base = Math.max(now, currentUser.xpBoostUntil || 0);
  currentUser.xpBoostUntil = base + minutes * 60 * 1000;
  saveCurrentAccountState();
  updateXpBoostUI();
}

function updateXpBoostUI() {
  const pill = document.getElementById('xp-boost-pill');
  const timerEl = document.getElementById('xp-boost-timer');
  if (!pill || !timerEl) return;

  if (!isXpBoostActive()) {
    pill.classList.add('hidden');
    pill.classList.remove('flex');
    clearInterval(xpBoostInterval);
    xpBoostInterval = null;
    return;
  }

  pill.classList.remove('hidden');
  pill.classList.add('flex');
  const renderRemaining = () => {
    if (!isXpBoostActive()) {
      pill.classList.add('hidden');
      pill.classList.remove('flex');
      clearInterval(xpBoostInterval);
      xpBoostInterval = null;
      return;
    }
    const remSec = Math.max(0, Math.ceil((currentUser.xpBoostUntil - Date.now()) / 1000));
    const m = String(Math.floor(remSec / 60)).padStart(2, '0');
    const s = String(remSec % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
  };
  renderRemaining();
  if (!xpBoostInterval) xpBoostInterval = setInterval(renderRemaining, 1000);
}

function refreshAllUI() {
  updateHeaderStats();
  updateDailyRecommendationCard();
  updateXpBoostUI();
  if (typeof updateSpeechControlsUI === 'function') updateSpeechControlsUI();
  if (typeof updateGamePaceUI === 'function') updateGamePaceUI();
  renderProfile();
  renderQuests();
  renderLeaderboard();
}

/* ---------- CONFETTI & TOAST ---------- */
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 45 }, () => ({
    x: canvas.width / 2, y: canvas.height / 2, r: Math.random() * 3 + 2,
    color: ['#38BDF8', '#6366F1', '#F59E0B', '#10B981'][Math.floor(Math.random() * 4)],
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

/* ---------- LEXICON DICTIONARY MODAL ---------- */
let notebookDeckFilter = null;

function openNotebookModal(deckId = null) {
  playSfx('click');
  notebookDeckFilter = deckId || null;
  const titleEl = document.querySelector('#modal-notebook h3');
  const subEl = document.querySelector('#modal-notebook p');
  if (notebookDeckFilter) {
    const deck = VOCAB_DECKS.find(d => d.id === notebookDeckFilter) || { title: 'Memory Vault (Kata Lemah)', desc: 'Daftar kata yang perlu dilatih ulang.' };
    if (titleEl) titleEl.textContent = `Daftar Kata: ${deck.title}`;
    if (subEl) subEl.innerHTML = `${deck.desc} • <button type="button" onclick="openNotebookModal(null)" class="text-sky-400 font-bold hover:underline">Lihat Semua 4.080+ Kata</button>`;
  } else {
    if (titleEl) titleEl.textContent = 'Kamus & Lexicon Laboratory';
    if (subEl) subEl.textContent = 'Cari dari 4.080+ kata CEFR A1–C1 lengkap dengan fonetik dan contoh kalimat.';
  }
  const searchInp = document.getElementById('notebook-search-input');
  if (searchInp && notebookDeckFilter) searchInp.value = '';
  const cefrSel = document.getElementById('notebook-cefr-filter');
  if (cefrSel && notebookDeckFilter) cefrSel.value = 'ALL';
  const statusSel = document.getElementById('notebook-status-filter');
  if (statusSel && notebookDeckFilter) statusSel.value = 'ALL';

  document.getElementById('modal-notebook').classList.remove('hidden');
  filterNotebookWords();
  unlockBadge('lexicon_keeper');
}

function openDeckWordList(deckId) {
  openNotebookModal(deckId);
}

function openNotebookWithStatus(status) {
  const sel = document.getElementById('notebook-status-filter');
  if (sel) sel.value = status || 'ALL';
  openNotebookModal();
}

function closeNotebookModal() {
  playSfx('click');
  document.getElementById('modal-notebook').classList.add('hidden');
}

function renderNotebookList(items) {
  const list = document.getElementById('notebook-words-list');
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">Tidak ada kata yang cocok dengan filter ini.</div>`;
    return;
  }
  const masteredSet = new Set(currentUser ? (currentUser.masteredWords || []) : []);
  const weakSet = new Set(currentUser ? (currentUser.weakWords || []).map(w => w.id) : []);
  const MAX_SHOW = 80;
  const info = document.createElement('div');
  info.className = 'py-2 px-2 text-[11px] font-mono text-slate-500 bg-slate-50 rounded-lg mb-2 flex justify-between';
  info.innerHTML = `<span>Menampilkan ${Math.min(items.length, MAX_SHOW)} dari ${items.length.toLocaleString()} kata</span><span>Filter di atas</span>`;
  list.appendChild(info);

  items.slice(0, MAX_SHOW).forEach(item => {
    const isLearned = masteredSet.has(item.id);
    const isWeak = weakSet.has(item.id);
    const statusBadge = isWeak
      ? `<span class="text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-400/30 px-1.5 py-0.5 rounded">Perlu Latihan</span>`
      : (isLearned
        ? `<span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-1.5 py-0.5 rounded">Dipelajari</span>`
        : `<span class="text-[10px] font-bold text-slate-400 bg-slate-500/15 border border-slate-400/20 px-1.5 py-0.5 rounded">Belum</span>`);

    const row = document.createElement('div');
    row.className = 'py-3 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition gap-3';
    row.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-14 h-14 rounded-xl overflow-hidden lexical-img-frame flex-shrink-0 border border-slate-200">${renderWordImgTag(item, 'w-full h-full object-cover', true)}</div>
        <div>
          <div class="flex items-center flex-wrap gap-1.5">
            <span class="font-bold text-slate-900 dark:text-slate-100 text-sm">${escapeHtml(item.word)}</span>
            <span class="code-font text-[10px] font-bold text-sky-400 bg-sky-500/15 px-1 rounded border border-sky-400/30">${escapeHtml(item.cefr)}</span>
            ${statusBadge}
            <span class="code-font text-xs text-slate-500">${escapeHtml(item.phonetic)}</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">${escapeHtml(item.definition)}</p>
          <span class="text-[11px] text-slate-400 font-medium">${escapeHtml(item.meaning)} • ${escapeHtml(item.category)}</span>
        </div>
      </div>
      <button data-word="${escapeHtml(item.word)}" onclick="speakText(this.dataset.word)" class="tactile-btn p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 dark:text-slate-300 text-xs flex-shrink-0" title="Dengarkan">${getAppIconSvg('volume', 'w-3.5 h-3.5')}</button>
    `;
    list.appendChild(row);
  });
}

function filterNotebookWords() {
  const q = document.getElementById('notebook-search-input').value.toLowerCase();
  const cefrFilter = document.getElementById('notebook-cefr-filter').value;
  const statusEl = document.getElementById('notebook-status-filter');
  const statusFilter = statusEl ? statusEl.value : 'ALL';
  const masteredSet = new Set(currentUser ? (currentUser.masteredWords || []) : []);
  const weakList = currentUser ? (currentUser.weakWords || []) : [];
  const weakSet = new Set(weakList.map(w => w.id));

  const sourcePool = notebookDeckFilter
    ? getDeckVocab(notebookDeckFilter, VOCAB_DATA, weakList)
    : VOCAB_DATA;

  const filtered = sourcePool.filter(v => {
    const matchText = v.word.toLowerCase().includes(q) || (v.meaning || '').toLowerCase().includes(q) || (v.category || '').toLowerCase().includes(q);
    const matchCefr = cefrFilter === 'ALL' || v.cefr === cefrFilter;
    const matchStatus = statusFilter === 'ALL'
      || (statusFilter === 'learned' && masteredSet.has(v.id))
      || (statusFilter === 'unlearned' && !masteredSet.has(v.id))
      || (statusFilter === 'weak' && weakSet.has(v.id));
    return matchText && matchCefr && matchStatus;
  });
  renderNotebookList(filtered);
}

/* ---------- VOICE LAB MODAL ---------- */
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
  speakText(item.word, 0.88);
  drawWaveform(false);
}

function loadNextVoiceLabWord() {
  playSfx('click');
  const pool = currentCEFR === 'ALL' ? VOCAB_DATA : VOCAB_DATA.filter(v => v.cefr === currentCEFR);
  loadVoiceLabWord(pool[Math.floor(Math.random() * pool.length)] || VOCAB_DATA[0]);
}

function startSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Speech Recognition not supported in this browser.', '!'); return; }
  playSfx('click');
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  const micBtn = document.getElementById('btn-start-mic');
  const statusText = document.getElementById('voicelab-status-text');
  const badge = document.getElementById('voicelab-result-badge');
  statusText.textContent = 'Listening... Articulate word.';
  micBtn.classList.add('ring-2', 'ring-sky-500');
  drawWaveform(true);
  recognition.start();

  recognition.onresult = (event) => {
    drawWaveform(false);
    micBtn.classList.remove('ring-2', 'ring-sky-500');
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    const target = voiceLabCurrentItem.word.toLowerCase();
    if (spoken.includes(target)) {
      playSfx('correct');
      statusText.textContent = `Acoustic match: "${spoken}"`;
      badge.innerHTML = `<span class="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold rounded border border-emerald-400/30">✓ Calibrated (+30 XP)</span>`;
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
      badge.innerHTML = `<span class="px-2.5 py-0.5 bg-rose-500/15 text-rose-400 text-xs font-mono font-bold rounded border border-rose-400/30">Expected: "${target}"</span>`;
    }
  };
  recognition.onerror = () => { drawWaveform(false); micBtn.classList.remove('ring-2', 'ring-sky-500'); statusText.textContent = 'Microphone error.'; };
  recognition.onend = () => { drawWaveform(false); micBtn.classList.remove('ring-2', 'ring-sky-500'); };
}

/* ---------- CUSTOM WORD MODAL ---------- */
function openCustomWordModal() { playSfx('click'); document.getElementById('modal-custom-word').classList.remove('hidden'); }
function closeCustomWordModal() { playSfx('click'); document.getElementById('modal-custom-word').classList.add('hidden'); }

function handleSaveCustomWord(e) {
  e.preventDefault();
  const word = document.getElementById('cust-word').value.trim().toLowerCase();
  const cefr = document.getElementById('cust-cefr').value;
  const tag = (document.getElementById('cust-tag') ? document.getElementById('cust-tag').value.trim() : '') || 'Vocabulary';
  const meaning = document.getElementById('cust-meaning').value.trim();
  const def = document.getElementById('cust-def').value.trim();
  const rawSentence = document.getElementById('cust-sentence').value.trim();

  const newEntry = {
    id: `custom_${Date.now()}`, word, cefr, category: tag, emoji: '', image: '',
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
  unlockBadge('custom_creator');
  playSfx('fanfare');
  showToast(`Custom word "${word}" saved to your account!`, '✓');
  e.target.reset();
}

/* ---------- CLOUD STATUS & KEYBOARD SHORTCUTS ---------- */
function refreshCloudBadges() {
  if (typeof updateCloudStatusPill === 'function') updateCloudStatusPill('auto');
}

/* ---------- FLASHCARD BELAJAR CEPAT ---------- */
let flashcardDeck = [];
let flashcardIndex = 0;
let flashcardFlipped = false;

function openFlashcardModal() {
  playSfx('click');
  const pool = getFilteredVocab();
  flashcardDeck = pool.slice().sort(() => 0.5 - Math.random()).slice(0, 5);
  if (!flashcardDeck.length) flashcardDeck = VOCAB_DATA.slice(0, 5);
  flashcardIndex = 0;
  flashcardFlipped = false;
  renderFlashcardCard();
  document.getElementById('modal-flashcard').classList.remove('hidden');
}

function closeFlashcardModal() {
  playSfx('click');
  document.getElementById('modal-flashcard').classList.add('hidden');
}

function renderFlashcardCard() {
  const item = flashcardDeck[flashcardIndex];
  if (!item) return;
  document.getElementById('flashcard-counter').textContent = `Kartu ${flashcardIndex + 1} / ${flashcardDeck.length}`;
  document.getElementById('fc-cefr').textContent = item.cefr || 'A1';
  document.getElementById('fc-word').textContent = item.word || '';
  document.getElementById('fc-phonetic').textContent = item.phonetic || '';
  document.getElementById('fc-meaning').textContent = item.meaning || '';
  document.getElementById('fc-definition').textContent = item.definition || '';
  const ex = Array.isArray(item.sentence) ? item.sentence.join(' ') : (item.sentenceIndo || '');
  document.getElementById('fc-example').textContent = ex ? `"${ex}"` : '';
  document.getElementById('fc-back-content').classList.toggle('hidden', !flashcardFlipped);
  document.getElementById('fc-tap-hint').classList.toggle('hidden', flashcardFlipped);
  speakText(item.word);
}

function flipFlashcard() {
  playSfx('click');
  flashcardFlipped = !flashcardFlipped;
  document.getElementById('fc-back-content').classList.toggle('hidden', !flashcardFlipped);
  document.getElementById('fc-tap-hint').classList.toggle('hidden', flashcardFlipped);
}

function speakCurrentFlashcard() {
  const item = flashcardDeck[flashcardIndex];
  if (item) speakText(item.word);
}

function nextFlashcard() {
  playSfx('click');
  flashcardIndex = (flashcardIndex + 1) % flashcardDeck.length;
  flashcardFlipped = false;
  renderFlashcardCard();
}

function prevFlashcard() {
  playSfx('click');
  flashcardIndex = (flashcardIndex - 1 + flashcardDeck.length) % flashcardDeck.length;
  flashcardFlipped = false;
  renderFlashcardCard();
}

function closeAllOpenModals() {
  ['modal-flashcard', 'modal-deck-picker', 'modal-notebook', 'modal-voicelab', 'modal-achievements', 'modal-custom-word', 'modal-auth', 'modal-edit-profile'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) {
      el.classList.add('hidden');
      if (id === 'modal-voicelab') {
        if (recognition) recognition.stop();
        cancelAnimationFrame(waveAnimId);
      }
      if (id === 'modal-auth' && typeof resetPasswordFieldsVisibility === 'function') {
        resetPasswordFieldsVisibility();
      }
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllOpenModals();
});

/* ---------- APP BOOTSTRAP ---------- */
window.onload = function() {
  initTheme();
  updateSfxToggleUI();
  if (typeof updateSpeechControlsUI === 'function') updateSpeechControlsUI();
  loadSessionUser();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  setTimeout(() => {
    refreshCloudBadges();
    if (typeof isCloudEnabled === 'function' && isCloudEnabled()) {
      updateCloudStatusPill('online');
      if (typeof cloudFetchLeaderboard === 'function') {
        cloudFetchLeaderboard('weekly').catch(() => {});
      }
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
