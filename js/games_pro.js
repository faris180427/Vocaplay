/* ==============================================================
   VOCAPLAY — STUDIO-GRADE GAMES (WORDLE, CONNECTIONS, BOSS, ROLEPLAY)
   ============================================================== */

/* ==============================================================
   12. VOCAB WORDLE (TEKA-TEKI TEBAK KATA 5 HURUF)
   ============================================================== */
let wordleTargetItem = null;
let wordleTargetWord = '';
let wordleGuesses = [];
let wordleCurrentInput = '';
let wordleMaxTries = 6;
let wordleFinished = false;
let wordleHintStage = 0;

const WORDLE_FALLBACK_WORDS = [
  { id: 'wd_1', word: 'apple', cefr: 'A1', category: 'Food', phonetic: '/ˈæp.əl/', meaning: 'Apel', definition: 'A crisp sweet fruit.' },
  { id: 'wd_2', word: 'brain', cefr: 'B1', category: 'Body', phonetic: '/breɪn/', meaning: 'Otak', definition: 'The organ inside the head that controls thought.' },
  { id: 'wd_3', word: 'cloud', cefr: 'A2', category: 'Nature', phonetic: '/klaʊd/', meaning: 'Awan', definition: 'A visible mass of water vapor in the sky.' },
  { id: 'wd_4', word: 'dream', cefr: 'A2', category: 'Mind', phonetic: '/driːm/', meaning: 'Mimpi', definition: 'Images and feelings experienced while sleeping.' },
  { id: 'wd_5', word: 'focus', cefr: 'B1', category: 'Academic', phonetic: '/ˈfoʊ.kəs/', meaning: 'Fokus', definition: 'Center of interest or concentrated attention.' },
  { id: 'wd_6', word: 'light', cefr: 'A1', category: 'Nature', phonetic: '/laɪt/', meaning: 'Cahaya', definition: 'Natural agent that makes things visible.' },
  { id: 'wd_7', word: 'ocean', cefr: 'A2', category: 'Nature', phonetic: '/ˈoʊ.ʃən/', meaning: 'Samudra', definition: 'A very large expanse of sea.' },
  { id: 'wd_8', word: 'smart', cefr: 'A2', category: 'Adjectives', phonetic: '/smɑːrt/', meaning: 'Cerdas', definition: 'Having quick-witted intelligence.' },
  { id: 'wd_9', word: 'train', cefr: 'A1', category: 'Travel', phonetic: '/treɪn/', meaning: 'Kereta', definition: 'A series of connected railway cars.' },
  { id: 'wd_10', word: 'voice', cefr: 'A2', category: 'Speaking', phonetic: '/vɔɪs/', meaning: 'Suara', definition: 'Sound produced by the vocal organs.' }
];

function startVocabWordleGame() {
  stopAllActiveGameTimers();
  const pool = getFilteredVocab().filter(v => /^[a-z]{5}$/i.test((v.word || '').trim()));
  const allFive = VOCAB_DATA.filter(v => /^[a-z]{5}$/i.test((v.word || '').trim()));
  const source = pool.length ? pool : (allFive.length ? allFive : WORDLE_FALLBACK_WORDS);

  wordleTargetItem = source[Math.floor(Math.random() * source.length)];
  wordleTargetWord = wordleTargetItem.word.toLowerCase();
  currentItem = wordleTargetItem;
  wordleGuesses = [];
  wordleCurrentInput = '';
  wordleFinished = false;
  wordleHintStage = 0;

  roundNumber = 1;
  document.getElementById('gameplay-round-badge').textContent = '1 / 6';
  document.getElementById('gameplay-progress-bar').style.width = '16%';

  const rawMeaning = wordleTargetItem.meaning || wordleTargetItem.definition || 'Kosakata bahasa Inggris';
  const safeMeaning = rawMeaning.replace(new RegExp(wordleTargetWord, 'gi'), '_____');
  const hintBox = document.getElementById('wordle-hint-box');
  if (hintBox) {
    hintBox.innerHTML = `<span class="text-sky-400 font-bold">Arti:</span> <span class="font-semibold">${safeMeaning}</span> <span class="text-slate-500 ml-1">• ${wordleTargetItem.cefr || 'A2'}</span>`;
  }
  const hintBtn = document.getElementById('btn-wordle-hint');
  if (hintBtn) {
    hintBtn.disabled = false;
    hintBtn.textContent = 'Buka Huruf Awal';
  }
  const msgEl = document.getElementById('wordle-status-msg');
  if (msgEl) msgEl.textContent = 'Tebak kata bahasa Inggris 5 huruf sesuai arti di atas.';

  renderWordleBoard();
  renderWordleKeyboard();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
}

function revealWordleHint() {
  if (!wordleTargetItem || wordleFinished) return;
  playSfx('click');
  wordleHintStage++;
  const rawMeaning = wordleTargetItem.meaning || wordleTargetItem.definition || 'Kosakata bahasa Inggris';
  const safeMeaning = rawMeaning.replace(new RegExp(wordleTargetWord, 'gi'), '_____');
  const firstCh = wordleTargetWord[0].toUpperCase();
  const lastCh = wordleTargetWord[4].toUpperCase();
  const hintBox = document.getElementById('wordle-hint-box');
  const hintBtn = document.getElementById('btn-wordle-hint');

  if (wordleHintStage === 1) {
    if (hintBox) {
      hintBox.innerHTML = `<span class="text-sky-400 font-bold">Arti:</span> ${safeMeaning} • <span class="code-font text-amber-400 font-bold">${firstCh} _ _ _ _</span>`;
    }
    if (hintBtn) hintBtn.textContent = 'Buka Huruf Akhir';
  } else {
    if (hintBox) {
      hintBox.innerHTML = `<span class="text-sky-400 font-bold">Arti:</span> ${safeMeaning} • <span class="code-font text-amber-400 font-bold">${firstCh} _ _ _ ${lastCh}</span>`;
    }
    if (hintBtn) {
      hintBtn.textContent = 'Petunjuk Maksimal';
      hintBtn.disabled = true;
    }
  }
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
}

function evaluateWordleGuess(guess, target) {
  const res = Array(5).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      res[i] = 'correct';
      targetArr[i] = null;
      guessArr[i] = null;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (guessArr[i]) {
      const idx = targetArr.indexOf(guessArr[i]);
      if (idx !== -1) {
        res[i] = 'present';
        targetArr[idx] = null;
      }
    }
  }
  return res;
}

function renderWordleBoard() {
  const board = document.getElementById('wordle-board');
  if (!board) return;
  board.innerHTML = '';

  for (let r = 0; r < wordleMaxTries; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'grid grid-cols-5 gap-2';
    const isSubmitted = r < wordleGuesses.length;
    const isCurrent = r === wordleGuesses.length && !wordleFinished;
    const word = isSubmitted ? wordleGuesses[r].word : (isCurrent ? wordleCurrentInput : '');
    const states = isSubmitted ? wordleGuesses[r].states : [];

    for (let c = 0; c < 5; c++) {
      const ch = (word[c] || '').toUpperCase();
      const cell = document.createElement('div');
      let cls = 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center code-font text-base sm:text-lg font-extrabold border-2 transition-all select-none ';
      if (isSubmitted) {
        if (states[c] === 'correct') cls += 'bg-emerald-500 border-emerald-400 text-white shadow-sm';
        else if (states[c] === 'present') cls += 'bg-amber-500 border-amber-400 text-white shadow-sm';
        else cls += 'bg-slate-700/80 border-slate-600 text-slate-300';
      } else if (ch) {
        cls += 'app-surface border-sky-400 text-sky-400 scale-[1.03]';
      } else {
        cls += 'app-subsurface border-slate-700/60 text-slate-500';
      }
      cell.className = cls;
      cell.textContent = ch;
      rowDiv.appendChild(cell);
    }
    board.appendChild(rowDiv);
  }
}

function renderWordleKeyboard() {
  const kb = document.getElementById('wordle-keyboard');
  if (!kb) return;
  const letterState = {};
  const rank = { absent: 1, present: 2, correct: 3 };
  wordleGuesses.forEach(g => {
    g.word.split('').forEach((ch, idx) => {
      const st = g.states[idx];
      if (!letterState[ch] || rank[st] > rank[letterState[ch]]) letterState[ch] = st;
    });
  });

  const rows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['ENTER','z','x','c','v','b','n','m','DEL']
  ];
  kb.innerHTML = '';
  rows.forEach(r => {
    const rowEl = document.createElement('div');
    rowEl.className = 'flex justify-center gap-1 sm:gap-1.5';
    r.forEach(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isAction = key === 'ENTER' || key === 'DEL';
      const st = letterState[key];
      let colorCls = 'app-surface border border-slate-700/60 text-slate-200 hover:border-sky-400';
      if (st === 'correct') colorCls = 'bg-emerald-500 border-emerald-400 text-white';
      else if (st === 'present') colorCls = 'bg-amber-500 border-amber-400 text-white';
      else if (st === 'absent') colorCls = 'bg-slate-800/60 border-slate-800 text-slate-500';
      if (key === 'ENTER') colorCls = 'bg-sky-500 hover:bg-sky-600 text-white border-sky-400';

      btn.className = `tactile-btn ${isAction ? 'px-2.5 sm:px-3.5 text-[10px]' : 'w-7 sm:w-9 text-xs'} h-10 rounded-lg font-mono font-bold uppercase transition ${colorCls}`;
      btn.textContent = key === 'DEL' ? '⌫' : key;
      btn.onclick = () => handleWordleKey(key);
      rowEl.appendChild(btn);
    });
    kb.appendChild(rowEl);
  });
}

function isPlausibleEnglishWord(guess) {
  if (!/^[a-z]{5}$/.test(guess)) return false;
  if (guess === wordleTargetWord) return true;
  // Cek langsung di korpus 4.080+ kata Vocaplay
  if (VOCAB_DATA.some(v => (v.word || '').toLowerCase() === guess)) return true;
  // Tolak tebakan asal tanpa vokal atau 3+ huruf kembar berturut-turut (misal "aaaaa", "bcdfg")
  if (!/[aeiouy]/.test(guess)) return false;
  if (/(.)\1\1/.test(guess)) return false;
  return true;
}

function handleWordleKey(key) {
  if (wordleFinished || currentMode !== 'vocab-wordle') return;
  if (key === 'DEL' || key === 'Backspace') {
    if (wordleCurrentInput.length > 0) {
      wordleCurrentInput = wordleCurrentInput.slice(0, -1);
      playSfx('click');
      renderWordleBoard();
    }
    return;
  }
  if (key === 'ENTER' || key === 'Enter') {
    if (wordleCurrentInput.length < 5) {
      showToast('Masukkan tepat 5 huruf terlebih dahulu.', '!');
      return;
    }
    const guess = wordleCurrentInput.toLowerCase();
    if (!isPlausibleEnglishWord(guess)) {
      playSfx('wrong');
      showToast(`"${guess.toUpperCase()}" bukan pola kata bahasa Inggris yang valid.`, '!');
      return;
    }
    const states = evaluateWordleGuess(guess, wordleTargetWord);
    wordleGuesses.push({ word: guess, states });
    wordleCurrentInput = '';

    const triesUsed = wordleGuesses.length;
    document.getElementById('gameplay-round-badge').textContent = `${triesUsed} / ${wordleMaxTries}`;
    document.getElementById('gameplay-progress-bar').style.width = `${Math.round((triesUsed / wordleMaxTries) * 100)}%`;

    renderWordleBoard();
    renderWordleKeyboard();

    const msgEl = document.getElementById('wordle-status-msg');
    if (guess === wordleTargetWord) {
      wordleFinished = true;
      const bonus = Math.max(100, (7 - triesUsed) * 50) - (wordleHintStage * 20);
      addSuccessScore(Math.max(80, bonus));
      speakText(wordleTargetWord);
      triggerConfetti();
      if (msgEl) msgEl.innerHTML = `<span class="text-emerald-400 font-bold">Tepat! "${wordleTargetItem.word}" = ${wordleTargetItem.meaning}</span>`;
      setTimeout(endGameSession, 1300);
    } else if (triesUsed >= wordleMaxTries) {
      wordleFinished = true;
      lives = 0;
      handleMistake(wordleTargetItem);
      speakText(wordleTargetWord);
      if (msgEl) msgEl.innerHTML = `<span class="text-rose-400 font-bold">Kata yang benar: "${wordleTargetItem.word}" (${wordleTargetItem.meaning})</span>`;
      setTimeout(endGameSession, 1600);
    } else {
      playSfx('click');
      if (msgEl) msgEl.textContent = `Sisa ${wordleMaxTries - triesUsed} percobaan lagi.`;
    }
    return;
  }
  if (/^[a-z]$/i.test(key) && wordleCurrentInput.length < 5) {
    wordleCurrentInput += key.toLowerCase();
    playSfx('click');
    renderWordleBoard();
  }
}

/* ==============================================================
   13. WORD CONNECTIONS 4x4 (ALA NYT CONNECTIONS)
   ============================================================== */
let connGroups = [];
let connCards = [];
let connSelectedIds = new Set();
let connSolvedGroups = [];
let connMistakesLeft = 4;

const CONN_COLORS = [
  { bg: 'bg-emerald-500/15', border: 'border-emerald-400/40', text: 'text-emerald-400' },
  { bg: 'bg-sky-500/15', border: 'border-sky-400/40', text: 'text-sky-400' },
  { bg: 'bg-amber-500/15', border: 'border-amber-400/40', text: 'text-amber-400' },
  { bg: 'bg-violet-500/15', border: 'border-violet-400/40', text: 'text-violet-400' }
];

function startWordConnectionsGame() {
  stopAllActiveGameTimers();
  connSelectedIds = new Set();
  connSolvedGroups = [];
  connMistakesLeft = 4;
  lives = 4;
  updateHeaderStats();

  // Hindari kategori gramatikal yang terlalu luas/ambigu (Nouns/Verbs/Adjectives/General)
  const vagueCats = new Set(['General', 'Nouns', 'Verbs', 'Adjectives', 'Adverbs', 'Expressions', 'Custom']);
  const byCat = {};
  VOCAB_DATA.forEach(item => {
    const cat = item.category || 'General';
    if (!byCat[cat]) byCat[cat] = [];
    if (!byCat[cat].some(w => w.word.toLowerCase() === item.word.toLowerCase())) {
      byCat[cat].push(item);
    }
  });

  const concreteCats = Object.keys(byCat).filter(c => !vagueCats.has(c) && byCat[c].length >= 4);
  const fallbackCats = Object.keys(byCat).filter(c => vagueCats.has(c) && byCat[c].length >= 4);
  const validCats = [
    ...concreteCats.sort(() => 0.5 - Math.random()),
    ...fallbackCats.sort(() => 0.5 - Math.random())
  ].slice(0, 4);

  connGroups = validCats.map((cat, idx) => ({
    id: idx,
    category: cat,
    color: CONN_COLORS[idx % CONN_COLORS.length],
    items: byCat[cat].sort(() => 0.5 - Math.random()).slice(0, 4)
  }));

  connCards = connGroups.flatMap(g =>
    g.items.map(item => ({ ...item, groupId: g.id, groupName: g.category }))
  ).sort(() => 0.5 - Math.random());

  roundNumber = 0;
  document.getElementById('gameplay-round-badge').textContent = '0 / 4';
  document.getElementById('gameplay-progress-bar').style.width = '5%';
  renderConnectionsBoard();
}

function renderConnectionsBoard() {
  const solvedEl = document.getElementById('conn-solved-groups');
  const gridEl = document.getElementById('conn-cards-grid');
  const infoEl = document.getElementById('conn-mistakes-label');
  if (!solvedEl || !gridEl) return;

  if (infoEl) infoEl.textContent = `Sisa Kesalahan: ${connMistakesLeft}`;

  solvedEl.innerHTML = '';
  connSolvedGroups.forEach(g => {
    const banner = document.createElement('div');
    banner.className = `w-full p-3 rounded-2xl ${g.color.bg} border ${g.color.border} text-center animate-fade-in`;
    banner.innerHTML = `
      <div class="text-xs font-extrabold uppercase tracking-wider ${g.color.text}">${g.category}</div>
      <div class="text-[11px] text-slate-300 mt-0.5 font-mono">${g.items.map(i => `${i.word} (${getShortMeaning(i, 16)})`).join(' • ')}</div>
    `;
    solvedEl.appendChild(banner);
  });

  gridEl.innerHTML = '';
  connCards.forEach(card => {
    const isSel = connSelectedIds.has(card.id);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `tactile-btn h-16 sm:h-18 px-2 py-2 rounded-xl border text-center flex flex-col items-center justify-center transition ${
      isSel
        ? 'bg-sky-500 text-white border-sky-400 ring-2 ring-sky-400/40 scale-[0.98]'
        : 'app-surface border-slate-700/60 hover:border-sky-400/70'
    }`;
    btn.innerHTML = `
      <span class="text-xs sm:text-sm font-extrabold tracking-tight leading-tight">${card.word}</span>
      <span class="text-[9px] font-mono ${isSel ? 'text-sky-100' : 'text-slate-400'} mt-0.5">${card.cefr || 'A1'}</span>
    `;
    btn.onclick = () => {
      playSfx('click');
      if (connSelectedIds.has(card.id)) {
        connSelectedIds.delete(card.id);
      } else {
        if (connSelectedIds.size >= 4) return;
        connSelectedIds.add(card.id);
        speakText(card.word);
      }
      renderConnectionsBoard();
    };
    gridEl.appendChild(btn);
  });

  const submitBtn = document.getElementById('btn-conn-submit');
  if (submitBtn) submitBtn.disabled = connSelectedIds.size !== 4;
}

function shuffleConnectionsCards() {
  playSfx('click');
  connCards.sort(() => 0.5 - Math.random());
  renderConnectionsBoard();
}

function clearConnectionsSelection() {
  playSfx('click');
  connSelectedIds.clear();
  renderConnectionsBoard();
}

function submitConnectionsGroup() {
  if (connSelectedIds.size !== 4) return;
  const picked = connCards.filter(c => connSelectedIds.has(c.id));
  const counts = {};
  picked.forEach(c => { counts[c.groupId] = (counts[c.groupId] || 0) + 1; });
  const maxMatch = Math.max(...Object.values(counts));

  if (maxMatch === 4) {
    const gid = picked[0].groupId;
    const grp = connGroups.find(g => g.id === gid);
    if (grp) {
      connSolvedGroups.push(grp);
      connCards = connCards.filter(c => c.groupId !== gid);
      connSelectedIds.clear();
      currentItem = grp.items[0];
      addSuccessScore(180);

      roundNumber = connSolvedGroups.length;
      document.getElementById('gameplay-round-badge').textContent = `${roundNumber} / 4`;
      document.getElementById('gameplay-progress-bar').style.width = `${Math.round((roundNumber / 4) * 100)}%`;
      showToast(`Kategori terbuka: ${grp.category}!`, '✓');
      renderConnectionsBoard();

      if (connSolvedGroups.length >= 4) {
        triggerConfetti();
        setTimeout(endGameSession, 900);
      }
    }
  } else {
    connMistakesLeft--;
    lives = connMistakesLeft;
    updateHeaderStats();
    playSfx('wrong');
    if (maxMatch === 3) {
      showToast('Hampir benar! 3 dari 4 kata sudah satu kelompok.', '!');
    } else {
      showToast('Belum cocok. Cari 4 kata dengan kategori makna sama.', '✕');
    }
    if (connMistakesLeft <= 0) {
      // Reveal remaining groups
      connGroups.forEach(g => {
        if (!connSolvedGroups.some(s => s.id === g.id)) connSolvedGroups.push(g);
      });
      connCards = [];
      connSelectedIds.clear();
      renderConnectionsBoard();
      setTimeout(endGameSession, 1400);
    } else {
      renderConnectionsBoard();
    }
  }
}

/* ==============================================================
   14. LEXICON BOSS BATTLE (MINI TURN-BASED RPG — 5 LEVEL BOSS)
   ============================================================== */
const BOSS_ROSTER = [
  { level: 1, cefr: 'A1', name: 'Bronze Scout', tier: 'Level 1 • A1', maxHp: 80, dmg: 14, bar: 'bg-emerald-500', bonusXP: 120 },
  { level: 2, cefr: 'A2', name: 'Iron Sentinel', tier: 'Level 2 • A2', maxHp: 100, dmg: 18, bar: 'bg-sky-500', bonusXP: 150 },
  { level: 3, cefr: 'B1', name: 'Crimson Knight', tier: 'Level 3 • B1', maxHp: 120, dmg: 20, bar: 'bg-amber-500', bonusXP: 190 },
  { level: 4, cefr: 'B2', name: 'Shadow Lexicon', tier: 'Level 4 • B2', maxHp: 140, dmg: 24, bar: 'bg-violet-500', bonusXP: 240 },
  { level: 5, cefr: 'C1', name: 'Obsidian Overlord', tier: 'Level 5 • C1', maxHp: 170, dmg: 28, bar: 'bg-rose-500', bonusXP: 320 }
];

let bossStageIdx = 0;
let bossHp = 80;
let bossMaxHp = 80;
let playerHp = 100;
let bossSkillCharge = 0;

function startBossBattleGame(levelIdx = null) {
  stopAllActiveGameTimers();
  const cleared = (currentUser && Array.isArray(currentUser.bossClearedLevels)) ? currentUser.bossClearedLevels : [];
  let startIdx = 0;
  if (typeof levelIdx === 'number') {
    startIdx = Math.max(0, Math.min(BOSS_ROSTER.length - 1, levelIdx));
  } else {
    // Mulai otomatis dari level pertama yang belum dikalahkan
    const nextUnclear = BOSS_ROSTER.findIndex(b => !cleared.includes(b.level));
    startIdx = nextUnclear !== -1 ? nextUnclear : 0;
  }
  playerHp = 100;
  bossSkillCharge = 0;
  loadBossStage(startIdx);
}

function renderBossLevelPills() {
  const box = document.getElementById('boss-level-pills');
  if (!box) return;
  const cleared = (currentUser && Array.isArray(currentUser.bossClearedLevels)) ? currentUser.bossClearedLevels : [];
  box.innerHTML = '';
  BOSS_ROSTER.forEach((b, idx) => {
    const isActive = idx === bossStageIdx;
    const isCleared = cleared.includes(b.level);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isActive
      ? 'tactile-btn px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] shadow-xs transition flex items-center gap-1'
      : (isCleared
        ? 'tactile-btn px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 font-bold text-[11px] transition flex items-center gap-1'
        : 'tactile-btn px-3 py-1.5 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px] transition flex items-center gap-1');
    btn.innerHTML = `<span>Lv.${b.level} ${b.cefr}</span>${isCleared ? '<span class="text-[10px]">✓</span>' : ''}`;
    btn.onclick = () => {
      playSfx('click');
      playerHp = 100;
      bossSkillCharge = 0;
      loadBossStage(idx);
    };
    box.appendChild(btn);
  });
}

function loadBossStage(idx) {
  bossStageIdx = idx;
  const b = BOSS_ROSTER[idx] || BOSS_ROSTER[0];
  bossMaxHp = b.maxHp;
  bossHp = b.maxHp;
  roundNumber = idx + 1;
  document.getElementById('gameplay-level-badge').textContent = `LV.${b.level} ${b.cefr}`;
  document.getElementById('gameplay-round-badge').textContent = `Boss ${idx + 1} / ${BOSS_ROSTER.length}`;
  document.getElementById('gameplay-progress-bar').style.width = `${Math.round(((idx + 1) / BOSS_ROSTER.length) * 100)}%`;
  const log = document.getElementById('boss-combat-log');
  if (log) log.textContent = `Menghadapi ${b.name} (${b.cefr}) — Pilih arti yang tepat untuk menyerang!`;
  renderBossLevelPills();
  updateBossHudUI();
  nextBossBattleTurn();
}

function updateBossHudUI() {
  const b = BOSS_ROSTER[bossStageIdx] || BOSS_ROSTER[0];
  const nameEl = document.getElementById('boss-name-label');
  const tierEl = document.getElementById('boss-tier-badge');
  const bossHpText = document.getElementById('boss-hp-text');
  const bossHpBar = document.getElementById('boss-hp-bar');
  const playerHpText = document.getElementById('player-hp-text');
  const playerHpBar = document.getElementById('player-hp-bar');
  const skillBtn = document.getElementById('btn-boss-skill');

  if (nameEl) nameEl.textContent = b.name;
  if (tierEl) tierEl.textContent = b.tier;
  if (bossHpText) bossHpText.textContent = `${Math.max(0, bossHp)} / ${bossMaxHp} HP`;
  if (bossHpBar) {
    bossHpBar.style.width = `${Math.max(0, Math.round((bossHp / bossMaxHp) * 100))}%`;
    bossHpBar.className = `${b.bar} h-full transition-all duration-300`;
  }
  if (playerHpText) playerHpText.textContent = `${Math.max(0, playerHp)} / 100 HP`;
  if (playerHpBar) playerHpBar.style.width = `${Math.max(0, playerHp)}%`;

  if (skillBtn) {
    const ready = bossSkillCharge >= 3;
    skillBtn.disabled = !ready;
    skillBtn.textContent = ready ? 'Aktifkan Ultimate (-45 HP & +20 HP)' : `Charge Ultimate (${bossSkillCharge}/3)`;
    skillBtn.className = ready
      ? 'tactile-btn w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition'
      : 'w-full py-2 rounded-xl app-subsurface border border-slate-700/60 text-slate-500 font-bold text-xs cursor-not-allowed';
  }
}

function triggerBossUltimate() {
  if (bossSkillCharge < 3 || currentMode !== 'boss-battle') return;
  bossSkillCharge = 0;
  bossHp = Math.max(0, bossHp - 45);
  playerHp = Math.min(100, playerHp + 20);
  playSfx('explode');
  triggerConfetti();
  const log = document.getElementById('boss-combat-log');
  if (log) log.innerHTML = `<span class="text-amber-400 font-bold">ULTIMATE HIT! -45 HP ke Boss & +20 HP dipulihkan!</span>`;
  updateBossHudUI();
  if (bossHp <= 0) handleBossDefeated();
}

function handleBossDefeated() {
  const b = BOSS_ROSTER[bossStageIdx] || BOSS_ROSTER[0];
  playSfx('fanfare');
  addSuccessScore(b.bonusXP || 180);
  if (currentUser) {
    if (!Array.isArray(currentUser.bossClearedLevels)) currentUser.bossClearedLevels = [];
    if (!currentUser.bossClearedLevels.includes(b.level)) {
      currentUser.bossClearedLevels.push(b.level);
      saveCurrentAccountState();
    }
  }
  renderBossLevelPills();
  const log = document.getElementById('boss-combat-log');
  if (bossStageIdx + 1 < BOSS_ROSTER.length) {
    if (log) log.innerHTML = `<span class="text-emerald-400 font-bold">Level ${b.level} (${b.name}) dikalahkan! Lanjut ke Level ${b.level + 1}...</span>`;
    playerHp = Math.min(100, playerHp + 30);
    setTimeout(() => loadBossStage(bossStageIdx + 1), 1200);
  } else {
    if (log) log.innerHTML = `<span class="text-emerald-400 font-bold">SEMUA 5 LEVEL BOSS DIKALAHKAN! Kemenangan mutlak!</span>`;
    triggerConfetti();
    setTimeout(endGameSession, 1200);
  }
}

function nextBossBattleTurn() {
  const b = BOSS_ROSTER[bossStageIdx] || BOSS_ROSTER[0];
  // Ambil kosakata sesuai level CEFR Boss saat ini (A1 -> C1)
  const levelPool = VOCAB_DATA.filter(v => v.cefr === b.cefr);
  const pool = levelPool.length >= 4 ? levelPool : getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;

  const distractors = pool
    .filter(v => v.id !== currentItem.id && v.meaning !== currentItem.meaning)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const options = [currentItem, ...distractors].sort(() => 0.5 - Math.random());

  const wordEl = document.getElementById('boss-question-word');
  const phonEl = document.getElementById('boss-question-phonetic');
  const grid = document.getElementById('boss-options-grid');
  if (wordEl) wordEl.textContent = currentItem.word;
  if (phonEl) phonEl.textContent = currentItem.phonetic || '';
  speakText(currentItem.word);

  if (!grid) return;
  grid.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tactile-btn app-surface border border-slate-700/60 hover:border-sky-400 rounded-xl p-3 text-left text-xs font-bold transition';
    btn.textContent = getShortMeaning(opt, 44);
    btn.onclick = () => {
      grid.querySelectorAll('button').forEach(b => b.disabled = true);
      const log = document.getElementById('boss-combat-log');
      const card = document.getElementById('boss-card-container');
      if (opt.id === currentItem.id) {
        const isCrit = streak >= 2;
        const dmg = isCrit ? 40 : 28;
        bossHp = Math.max(0, bossHp - dmg);
        bossSkillCharge = Math.min(3, bossSkillCharge + 1);
        btn.classList.add('border-emerald-400', 'bg-emerald-500/15', 'text-emerald-300');
        if (card) { card.classList.add('shake-anim'); setTimeout(() => card.classList.remove('shake-anim'), 300); }
        addSuccessScore(isCrit ? 170 : 120);
        if (log) log.innerHTML = `<span class="text-emerald-400 font-bold">${isCrit ? 'CRITICAL HIT! ' : ''}Serangan berhasil (-${dmg} HP Boss)</span>`;
        updateBossHudUI();
        if (bossHp <= 0) {
          handleBossDefeated();
        } else {
          setTimeout(nextBossBattleTurn, 750);
        }
      } else {
        const b = BOSS_ROSTER[bossStageIdx] || BOSS_ROSTER[0];
        playerHp = Math.max(0, playerHp - b.dmg);
        bossSkillCharge = 0;
        btn.classList.add('border-rose-400', 'bg-rose-500/15', 'text-rose-300');
        handleMistake(currentItem);
        if (log) log.innerHTML = `<span class="text-rose-400 font-bold">${b.name} menyerang balik! (-${b.dmg} HP Kamu)</span>`;
        updateBossHudUI();
        if (playerHp <= 0) {
          lives = 0;
          setTimeout(endGameSession, 900);
        } else {
          setTimeout(nextBossBattleTurn, 1100);
        }
      }
    };
    grid.appendChild(btn);
  });
}

/* ==============================================================
   15. DIALOGUE QUEST (MINI-ROLEPLAY PERCAKAPAN NYATA)
   ============================================================== */
const ROLEPLAY_SCENARIOS = [
  {
    id: 'coffee',
    title: 'Kafe di London',
    npc: 'Barista Emma',
    steps: [
      {
        npcText: 'Good morning! Welcome to Covent Coffee. What can I get started for you today?',
        npcIndo: 'Selamat pagi! Selamat datang di Covent Coffee. Mau pesan apa hari ini?',
        options: [
          { text: "I'd like an iced oat latte, please.", correct: true, reply: 'Great choice! Would you like that in a regular or large cup?' },
          { text: 'I am sleeping on the table now.', correct: false, reply: 'Haha, sounds like you really need caffeine! Try ordering a drink politely.' },
          { text: 'Give coffee fast immediately.', correct: false, reply: 'Whoa, a bit too blunt! In English cafes, "I\'d like..., please" sounds much friendlier.' }
        ]
      },
      {
        npcText: 'Would you like that to have here or to take away?',
        npcIndo: 'Apakah mau diminum di sini atau dibawa pulang?',
        options: [
          { text: 'To take away, please. I am heading to work.', correct: true, reply: 'No problem at all! I will put a lid on it for you.' },
          { text: 'Yes, yesterday was raining.', correct: false, reply: 'Hmm, that does not answer whether you are staying or taking it to go.' },
          { text: 'Throw it in the river.', correct: false, reply: 'Oh no, please do not waste good coffee! Pick a natural cafe response.' }
        ]
      },
      {
        npcText: 'That will be £4.50. Do you prefer paying by card or cash?',
        npcIndo: 'Totalnya £4.50. Mau bayar pakai kartu atau tunai?',
        options: [
          { text: 'By card, please. Can I tap here?', correct: true, reply: 'Yes, right on the reader. All set—enjoy your latte and have a lovely day!' },
          { text: 'I forgot my shoes at home.', correct: false, reply: 'Oh dear, but how would you like to pay for your latte?' },
          { text: 'Card is a green vegetable.', correct: false, reply: 'Not quite! Try asking to pay by card politely.' }
        ]
      }
    ]
  },
  {
    id: 'airport',
    title: 'Cek-in Bandara',
    npc: 'Petugas Liam',
    steps: [
      {
        npcText: 'Hello! May I see your passport and booking confirmation, please?',
        npcIndo: 'Halo! Boleh saya lihat paspor dan konfirmasi tiket Anda?',
        options: [
          { text: 'Certainly, here is my passport and e-ticket.', correct: true, reply: 'Thank you! Are you checking any luggage today?' },
          { text: 'My passport is eating breakfast.', correct: false, reply: 'I think you meant to hand it over! Try "Certainly, here is..."' },
          { text: 'Where is the swimming pool?', correct: false, reply: 'Let us finish your check-in first! Hand over your passport politely.' }
        ]
      },
      {
        npcText: 'Would you prefer a window seat or an aisle seat?',
        npcIndo: 'Anda lebih suka kursi dekat jendela atau dekat lorong?',
        options: [
          { text: 'A window seat, if one is still available.', correct: true, reply: 'Lucky you—seat 14A is open! Here is your boarding pass.' },
          { text: 'I want to sit on the wing.', correct: false, reply: 'Haha, safety rules forbid that! Choose window or aisle politely.' },
          { text: 'No seat, I will jog.', correct: false, reply: 'That would be a long flight! Ask for a window or aisle seat.' }
        ]
      },
      {
        npcText: 'Your flight boards at Gate 12 in forty minutes. Have a pleasant journey!',
        npcIndo: 'Pesawat Anda boarding di Gate 12 dalam 40 menit. Selamat menikmati perjalanan!',
        options: [
          { text: 'Thank you so much for your help!', correct: true, reply: 'My pleasure! Safe travels!' },
          { text: 'Gate 12 is my favorite fruit.', correct: false, reply: 'Wait—that does not make sense! Thank the staff politely.' },
          { text: 'Close the airport immediately.', correct: false, reply: 'We cannot do that! A warm thank you works best here.' }
        ]
      }
    ]
  },
  {
    id: 'interview',
    title: 'Wawancara Kerja',
    npc: 'HR Manager Sarah',
    steps: [
      {
        npcText: 'Thanks for coming in today. Could you briefly tell me about your strengths?',
        npcIndo: 'Terima kasih sudah hadir. Bisa ceritakan singkat tentang kelebihan Anda?',
        options: [
          { text: 'I am a fast learner and enjoy solving complex problems with a team.', correct: true, reply: 'That is exactly the mindset we look for here.' },
          { text: 'I hate working and love sleeping.', correct: false, reply: 'Honest, maybe—but not ideal for a job interview! Highlight a real strength.' },
          { text: 'My favorite color is Tuesday.', correct: false, reply: 'Try answering directly about your work strengths.' }
        ]
      },
      {
        npcText: 'How do you usually handle tight deadlines under pressure?',
        npcIndo: 'Bagaimana Anda biasanya menghadapi tenggat waktu yang ketat?',
        options: [
          { text: 'I prioritize key tasks, stay organized, and communicate early if blockers appear.', correct: true, reply: 'Very structured approach. Communication really prevents last-minute surprises.' },
          { text: 'I turn off my laptop and disappear.', correct: false, reply: 'That would worry any manager! Show how you stay calm and organized.' },
          { text: 'Deadlines are just imaginary numbers.', correct: false, reply: 'Clients definitely treat deadlines seriously! Try a professional answer.' }
        ]
      },
      {
        npcText: 'Do you have any questions for us before we wrap up?',
        npcIndo: 'Apakah Anda punya pertanyaan untuk kami sebelum sesi berakhir?',
        options: [
          { text: 'Yes, what does a successful first 90 days look like in this role?', correct: true, reply: 'Fantastic question! We value curiosity and clarity. We will be in touch soon!' },
          { text: 'No, goodbye forever.', correct: false, reply: 'Asking a thoughtful question always leaves a strong final impression.' },
          { text: 'Can I borrow your car?', correct: false, reply: 'Definitely save that for never! Ask something about the role or team.' }
        ]
      }
    ]
  }
];

let roleplayScenarioIdx = 0;
let roleplayStepIdx = 0;
let roleplayShowTrans = false;

function startDialogueQuestGame(scenarioIndex = 0) {
  stopAllActiveGameTimers();
  roleplayScenarioIdx = scenarioIndex % ROLEPLAY_SCENARIOS.length;
  roleplayStepIdx = 0;
  roleplayShowTrans = false;
  renderRoleplayScenarioPills();
  renderRoleplayStep();
}

function renderRoleplayScenarioPills() {
  const box = document.getElementById('roleplay-scenario-pills');
  if (!box) return;
  box.innerHTML = '';
  ROLEPLAY_SCENARIOS.forEach((sc, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = idx === roleplayScenarioIdx
      ? 'px-3 py-1 rounded-xl bg-sky-500 text-white font-bold text-[11px] transition'
      : 'px-3 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px] transition';
    btn.textContent = sc.title;
    btn.onclick = () => {
      playSfx('click');
      startDialogueQuestGame(idx);
    };
    box.appendChild(btn);
  });
}

function toggleRoleplayTranslation() {
  playSfx('click');
  roleplayShowTrans = !roleplayShowTrans;
  const transEl = document.getElementById('roleplay-npc-indo');
  if (transEl) transEl.classList.toggle('hidden', !roleplayShowTrans);
}

function renderRoleplayStep() {
  const sc = ROLEPLAY_SCENARIOS[roleplayScenarioIdx];
  const step = sc.steps[roleplayStepIdx];
  if (!step) return;

  roundNumber = roleplayStepIdx + 1;
  document.getElementById('gameplay-round-badge').textContent = `${roundNumber} / ${sc.steps.length}`;
  document.getElementById('gameplay-progress-bar').style.width = `${Math.round((roundNumber / sc.steps.length) * 100)}%`;

  document.getElementById('roleplay-npc-name').textContent = `${sc.npc} • ${sc.title}`;
  document.getElementById('roleplay-npc-text').textContent = step.npcText;
  const transEl = document.getElementById('roleplay-npc-indo');
  if (transEl) {
    transEl.textContent = step.npcIndo;
    transEl.classList.toggle('hidden', !roleplayShowTrans);
  }
  const feedbackEl = document.getElementById('roleplay-feedback');
  if (feedbackEl) feedbackEl.innerHTML = '';

  const audioBtn = document.getElementById('btn-roleplay-audio');
  if (audioBtn) audioBtn.onclick = () => speakText(step.npcText);
  speakText(step.npcText);

  const optsEl = document.getElementById('roleplay-options-list');
  if (!optsEl) return;
  optsEl.innerHTML = '';
  const shuffled = step.options.slice().sort(() => 0.5 - Math.random());

  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tactile-btn w-full app-surface border border-slate-700/60 hover:border-sky-400 rounded-xl p-3.5 text-left text-xs font-semibold transition';
    btn.textContent = opt.text;
    btn.onclick = () => {
      if (opt.correct) {
        optsEl.querySelectorAll('button').forEach(b => b.disabled = true);
        btn.classList.add('border-emerald-400', 'bg-emerald-500/15', 'text-emerald-300');
        addSuccessScore(150);
        if (feedbackEl) {
          feedbackEl.innerHTML = `<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-300 text-left animate-fade-in"><strong>${sc.npc}:</strong> "${opt.reply}"</div>`;
        }
        speakText(opt.reply);
        if (roleplayStepIdx + 1 < sc.steps.length) {
          roleplayStepIdx++;
          setTimeout(renderRoleplayStep, 1700);
        } else {
          triggerConfetti();
          setTimeout(endGameSession, 1700);
        }
      } else {
        btn.disabled = true;
        btn.classList.add('border-rose-400/60', 'bg-rose-500/10', 'text-rose-300', 'opacity-70');
        playSfx('wrong');
        if (feedbackEl) {
          feedbackEl.innerHTML = `<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-300 text-left animate-fade-in"><strong>${sc.npc}:</strong> "${opt.reply}"</div>`;
        }
      }
    };
    optsEl.appendChild(btn);
  });
}
