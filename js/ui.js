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
  if (target) {
    target.classList.remove('hidden');
    target.classList.remove('animate-fade-in');
    void target.offsetWidth;
    target.classList.add('animate-fade-in');
  }

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

function refreshAllUI() {
  updateHeaderStats();
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
function openNotebookModal() {
  playSfx('click');
  document.getElementById('modal-notebook').classList.remove('hidden');
  filterNotebookWords();
  unlockBadge('lexicon_keeper');
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
      ? `<span class="text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-400/30 px-1.5 py-0.5 rounded">⚠️ Perlu Latihan</span>`
      : (isLearned
        ? `<span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-1.5 py-0.5 rounded">✓ Dipelajari</span>`
        : `<span class="text-[10px] font-bold text-slate-400 bg-slate-500/15 border border-slate-400/20 px-1.5 py-0.5 rounded">Belum</span>`);

    const row = document.createElement('div');
    row.className = 'py-3 flex items-start justify-between hover:bg-slate-50 px-2 rounded-xl transition gap-3';
    row.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-14 h-14 rounded-xl overflow-hidden lexical-img-frame flex-shrink-0 border border-slate-200">${renderWordImgTag(item, 'w-full h-full object-cover', true)}</div>
        <div>
          <div class="flex items-center flex-wrap gap-1.5">
            <span class="font-bold text-slate-900 text-sm">${item.word}</span>
            <span class="code-font text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded border border-blue-200">${item.cefr}</span>
            ${statusBadge}
            <span class="code-font text-xs text-slate-500">${item.phonetic}</span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">${item.definition}</p>
          <span class="text-[11px] text-slate-400 font-medium">${item.meaning} • ${item.category}</span>
        </div>
      </div>
      <button onclick="speakText('${item.word.replace(/'/g, "\\'")}')" class="tactile-btn p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs flex-shrink-0">🔊</button>
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
  const weakSet = new Set(currentUser ? (currentUser.weakWords || []).map(w => w.id) : []);

  const filtered = VOCAB_DATA.filter(v => {
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

/* ---------- CUSTOM WORD MODAL ---------- */
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
  unlockBadge('custom_creator');
  playSfx('fanfare');
  showToast(`Custom word "${word}" saved to your account!`, emoji);
  e.target.reset();
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
      statusEl.textContent = '✓ Terhubung ke Supabase PostgreSQL!';
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
    statusEl.textContent = `Gagal terhubung: ${err.message}.`;
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

/* ---------- APP BOOTSTRAP ---------- */
window.onload = function() {
  initTheme();
  updateSfxToggleUI();
  loadSessionUser();
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
