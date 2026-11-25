/* ==============================================================
   VOCAPLAY — CORE INTERACTIVE GAMES (5 CLASSIC MODES)
   1. Fast Vocab + Mystery Reveal 3x3
   2. Sentence & Grammar Builder
   3. Acoustic Dictation
   4. Voice Duel + Speaking Phrases
   5. Penembak Kata (ZType-Style Canvas Shooter)
   ============================================================== */

/* ---------- PACE MODE (ZEN / ARCADE) & FAST VOCAB + MYSTERY REVEAL ---------- */
let gamePaceMode = localStorage.getItem('vocaplay_pace') || 'arcade';
let fastVocabSubmode = 'speed';
let mysteryRevealInterval = null;
let mysteryRevealedCount = 0;

function updateGamePaceUI() {
  const btn = document.getElementById('btn-game-pace');
  if (!btn) return;
  const isZen = gamePaceMode === 'zen';
  btn.textContent = isZen ? 'Zen' : 'Arcade';
  btn.className = isZen
    ? 'tactile-btn px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/40 font-mono text-[10px] font-bold text-emerald-400'
    : 'tactile-btn px-2 py-1 rounded-lg app-subsurface border border-slate-200 font-mono text-[10px] font-bold text-sky-400 hover:border-sky-400';
}

function toggleGamePaceMode() {
  playSfx('click');
  gamePaceMode = gamePaceMode === 'zen' ? 'arcade' : 'zen';
  localStorage.setItem('vocaplay_pace', gamePaceMode);
  updateGamePaceUI();
  showToast(gamePaceMode === 'zen' ? 'Mode Santai (Zen): Tanpa tekanan timer' : 'Mode Cepat (Arcade): Timer & refleks aktif', '✓');
  if (currentMode === 'fast-vocab' && gamePaceMode === 'zen') {
    clearInterval(fastVocabTimerInterval);
    const bar = document.getElementById('fast-vocab-timer-bar');
    if (bar) bar.style.width = '100%';
  }
}

function setFastVocabSubmode(mode) {
  playSfx('click');
  fastVocabSubmode = mode === 'mystery' ? 'mystery' : 'speed';
  const tSpeed = document.getElementById('fv-tab-speed');
  const tMyst = document.getElementById('fv-tab-mystery');
  if (tSpeed) tSpeed.className = fastVocabSubmode === 'speed' ? 'tactile-btn px-3 py-1 rounded-xl bg-sky-500 text-white font-bold text-[11px]' : 'tactile-btn px-3 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px]';
  if (tMyst) tMyst.className = fastVocabSubmode === 'mystery' ? 'tactile-btn px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px]' : 'tactile-btn px-3 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px]';
  roundNumber = Math.max(0, roundNumber - 1);
  nextFastVocabRound();
}

function setupMysteryRevealBox(item) {
  clearInterval(mysteryRevealInterval);
  mysteryRevealedCount = 0;
  const under = document.getElementById('mystery-under-content');
  const tilesGrid = document.getElementById('mystery-tiles-grid');
  const bonusPill = document.getElementById('mystery-bonus-pill');
  if (!under || !tilesGrid) return;

  if (hasRealImage(item)) {
    under.innerHTML = renderWordImgTag(item, 'w-full h-full object-cover rounded-xl');
  } else {
    under.innerHTML = `
      <span class="text-[10px] font-mono uppercase text-sky-400 font-bold">${item.category || 'Vocabulary'} • ${item.cefr || 'A1'}</span>
      <div class="editorial-serif text-xl font-bold text-white mt-1">${item.word}</div>
      <div class="text-[11px] text-slate-400 mt-1 line-clamp-2">${item.definition || ''}</div>
    `;
  }

  tilesGrid.innerHTML = '';
  const tiles = [];
  for (let i = 0; i < 9; i++) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'bg-slate-800/95 hover:bg-slate-700 border border-slate-700/70 rounded-md flex items-center justify-center font-mono text-[10px] text-slate-500 transition-opacity duration-300';
    tile.textContent = '?';
    tile.onclick = () => revealMysteryTile(tile);
    tilesGrid.appendChild(tile);
    tiles.push(tile);
  }

  const updateBonus = () => {
    const pts = Math.max(80, 200 - mysteryRevealedCount * 15);
    if (bonusPill) bonusPill.textContent = `Bonus: +${pts} pts`;
  };
  const revealMysteryTile = (t) => {
    if (!t || t.dataset.open === '1') return;
    t.dataset.open = '1';
    t.classList.add('opacity-0', 'pointer-events-none');
    mysteryRevealedCount++;
    updateBonus();
  };
  updateBonus();

  // Buka 1 kotak awal langsung + 1 kotak tiap 1.4 detik
  const order = tiles.slice().sort(() => 0.5 - Math.random());
  revealMysteryTile(order.pop());
  mysteryRevealInterval = setInterval(() => {
    const next = order.find(t => t.dataset.open !== '1');
    if (next) revealMysteryTile(next);
    else clearInterval(mysteryRevealInterval);
  }, 1400);
}

function nextFastVocabRound() {
  clearInterval(fastVocabTimerInterval);
  clearInterval(mysteryRevealInterval);
  updateGamePaceUI();
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  const speedHdr = document.getElementById('fv-speed-header');
  const mystBox = document.getElementById('mystery-reveal-box');
  if (speedHdr) speedHdr.classList.toggle('hidden', fastVocabSubmode === 'mystery');
  if (mystBox) mystBox.classList.toggle('hidden', fastVocabSubmode !== 'mystery');
  if (fastVocabSubmode === 'mystery') setupMysteryRevealBox(currentItem);

  const distractorSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const otherCards = distractorSource.filter(i => i.id !== currentItem.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const roundChoices = [currentItem, ...otherCards].sort(() => 0.5 - Math.random());

  const grid = document.getElementById('fast-vocab-cards-grid');
  grid.innerHTML = '';
  roundChoices.forEach((choice, idx) => {
    const card = document.createElement('button');
    card.dataset.wordId = choice.id;
    card.style.animationDelay = `${idx * 40}ms`;
    if (hasRealImage(choice) && fastVocabSubmode !== 'mystery') {
      card.className = 'animate-fade-in tactile-btn fast-vocab-card h-40 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-2.5 transition hover:border-indigo-400 focus-ring overflow-hidden shadow-xs';
      card.innerHTML = `
        <div class="w-full h-24 lexical-img-frame mb-1.5">${renderWordImgTag(choice)}</div>
        <div class="flex items-center justify-between w-full px-1 gap-1.5">
          <span class="text-xs font-bold text-slate-800 truncate">${getShortMeaning(choice, 28)}</span>
          <span class="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">${choice.cefr}</span>
        </div>
      `;
    } else {
      card.className = 'animate-fade-in tactile-btn fast-vocab-card app-surface h-28 border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-3.5 transition hover:border-sky-400 focus-ring shadow-xs text-center';
      card.innerHTML = `
        <div class="w-full flex items-center justify-between">
          <span class="text-[10px] font-mono uppercase text-slate-400 font-bold">${choice.category}</span>
          <span class="text-[10px] text-sky-400 bg-sky-500/15 border border-sky-400/30 px-1.5 py-0.5 rounded font-mono font-bold">${choice.cefr}</span>
        </div>
        <div class="text-xs sm:text-sm font-bold leading-snug line-clamp-2 my-auto">${getShortMeaning(choice, 54)}</div>
        <div class="w-8 h-1 rounded-full bg-sky-500/40"></div>
      `;
    }
    card.onclick = () => handleFastVocabChoice(choice, card);
    grid.appendChild(card);
  });

  speakText(currentItem.word);
  const baseDuration = (CEFR_CONFIG[currentItem.cefr] || CEFR_CONFIG.A1).timerSec;
  fastVocabTimeLeft = baseDuration;
  const bar = document.getElementById('fast-vocab-timer-bar');
  bar.style.width = '100%';

  if (gamePaceMode === 'zen' || fastVocabSubmode === 'mystery') return;

  fastVocabTimerInterval = setInterval(() => {
    fastVocabTimeLeft -= 0.05;
    bar.style.width = `${Math.max(0, (fastVocabTimeLeft / baseDuration) * 100)}%`;
    if (fastVocabTimeLeft <= 0) {
      clearInterval(fastVocabTimerInterval);
      handleMistake(currentItem);
      showToast(`Waktu habis: "${currentItem.word}"`, '!');
      highlightFastVocabCorrect();
      advanceOrFinishRound(nextFastVocabRound, 1100);
    }
  }, 50);
}

function handleFastVocabChoice(selected, cardEl) {
  clearInterval(fastVocabTimerInterval);
  clearInterval(mysteryRevealInterval);
  document.querySelectorAll('.fast-vocab-card').forEach(c => c.disabled = true);
  if (fastVocabSubmode === 'mystery') {
    document.querySelectorAll('#mystery-tiles-grid button').forEach(t => t.classList.add('opacity-0', 'pointer-events-none'));
  }
  if (selected.id === currentItem.id) {
    cardEl.classList.add('border-emerald-500', 'bg-emerald-500/15', 'pop-success');
    const pts = fastVocabSubmode === 'mystery' ? Math.max(80, 200 - mysteryRevealedCount * 15) : 100;
    addSuccessScore(pts);
    showToast(`Cocok: ${currentItem.word}`, '✓');
    advanceOrFinishRound(nextFastVocabRound, 700);
  } else {
    cardEl.classList.add('border-rose-500', 'bg-rose-500/15', 'shake-anim');
    handleMistake(currentItem);
    highlightFastVocabCorrect();
    advanceOrFinishRound(nextFastVocabRound, 1100);
  }
}

function highlightFastVocabCorrect() {
  document.querySelectorAll('.fast-vocab-card').forEach(c => {
    if (c.dataset.wordId === currentItem.id) c.classList.add('border-emerald-500', 'bg-emerald-500/15');
  });
}

/* ---------- 2. SENTENCE & GRAMMAR BUILDER ---------- */
let sentenceOriginalTokens = [];
let sentenceAvailableTokens = [];
let sentencePlacedTokens = [];
let activeGrammarTopic = 'deck';

const GRAMMAR_TOPIC_BANKS = {
  is_are: [
    { id: 'gr_ia1', word: 'is', cefr: 'A1', category: 'Grammar', sentence: ['She', 'is', 'a very', 'talented', 'engineer'], sentenceIndo: 'Dia adalah seorang insinyur yang sangat berbakat.' },
    { id: 'gr_ia2', word: 'are', cefr: 'A1', category: 'Grammar', sentence: ['They', 'are', 'studying', 'English', 'together'], sentenceIndo: 'Mereka sedang belajar bahasa Inggris bersama.' },
    { id: 'gr_ia3', word: 'is', cefr: 'A1', category: 'Grammar', sentence: ['The coffee', 'is', 'still', 'very hot'], sentenceIndo: 'Kopinya masih sangat panas.' },
    { id: 'gr_ia4', word: 'are', cefr: 'A1', category: 'Grammar', sentence: ['My keys', 'are', 'on the', 'wooden table'], sentenceIndo: 'Kunci saya ada di atas meja kayu.' }
  ],
  have_has: [
    { id: 'gr_hh1', word: 'has', cefr: 'A1', category: 'Grammar', sentence: ['He', 'has', 'an important', 'meeting', 'today'], sentenceIndo: 'Dia memiliki rapat penting hari ini.' },
    { id: 'gr_hh2', word: 'have', cefr: 'A1', category: 'Grammar', sentence: ['We', 'have', 'finished', 'our', 'project'], sentenceIndo: 'Kami sudah menyelesaikan proyek kami.' },
    { id: 'gr_hh3', word: 'has', cefr: 'A2', category: 'Grammar', sentence: ['This city', 'has', 'a modern', 'train system'], sentenceIndo: 'Kota ini memiliki sistem kereta yang modern.' },
    { id: 'gr_hh4', word: 'have', cefr: 'A1', category: 'Grammar', sentence: ['I', 'have', 'two cups', 'of tea', 'every day'], sentenceIndo: 'Saya minum dua cangkir teh setiap hari.' }
  ],
  past: [
    { id: 'gr_pt1', word: 'visited', cefr: 'A2', category: 'Grammar', sentence: ['We', 'visited', 'the science', 'museum', 'yesterday'], sentenceIndo: 'Kami mengunjungi museum sains kemarin.' },
    { id: 'gr_pt2', word: 'bought', cefr: 'A2', category: 'Grammar', sentence: ['She', 'bought', 'a new', 'laptop', 'last week'], sentenceIndo: 'Dia membeli laptop baru minggu lalu.' },
    { id: 'gr_pt3', word: 'went', cefr: 'A2', category: 'Grammar', sentence: ['They', 'went', 'to Bali', 'by plane'], sentenceIndo: 'Mereka pergi ke Bali naik pesawat.' },
    { id: 'gr_pt4', word: 'wrote', cefr: 'B1', category: 'Grammar', sentence: ['He', 'wrote', 'a clear', 'report', 'last night'], sentenceIndo: 'Dia menulis laporan yang jelas tadi malam.' }
  ],
  can: [
    { id: 'gr_cn1', word: 'can', cefr: 'A1', category: 'Grammar', sentence: ['She', 'can', 'speak', 'three', 'languages'], sentenceIndo: 'Dia bisa berbicara tiga bahasa.' },
    { id: 'gr_cn2', word: 'cannot', cefr: 'A1', category: 'Grammar', sentence: ['I', 'cannot', 'find', 'my wallet', 'anywhere'], sentenceIndo: 'Saya tidak bisa menemukan dompet saya di mana pun.' },
    { id: 'gr_cn3', word: 'can', cefr: 'A2', category: 'Grammar', sentence: ['Can you', 'explain', 'this rule', 'again?'], sentenceIndo: 'Bisakah kamu menjelaskan aturan ini lagi?' },
    { id: 'gr_cn4', word: 'can', cefr: 'B1', category: 'Grammar', sentence: ['We', 'can', 'solve', 'this problem', 'faster'], sentenceIndo: 'Kita bisa menyelesaikan masalah ini lebih cepat.' }
  ],
  routines: [
    { id: 'gr_rt1', word: 'wake', cefr: 'A1', category: 'Routines', sentence: ['I usually', 'wake up', 'at six', 'every morning'], sentenceIndo: 'Saya biasanya bangun pukul enam setiap pagi.' },
    { id: 'gr_rt2', word: 'chef', cefr: 'A2', category: 'Jobs', sentence: ['A chef', 'cooks', 'delicious meals', 'in a restaurant'], sentenceIndo: 'Seorang koki memasak makanan lezat di restoran.' },
    { id: 'gr_rt3', word: 'doctor', cefr: 'A1', category: 'Jobs', sentence: ['A doctor', 'helps', 'sick people', 'at the hospital'], sentenceIndo: 'Seorang dokter membantu orang sakit di rumah sakit.' },
    { id: 'gr_rt4', word: 'brush', cefr: 'A1', category: 'Routines', sentence: ['She', 'brushes', 'her teeth', 'before sleeping'], sentenceIndo: 'Dia menyikat giginya sebelum tidur.' }
  ]
};

const GRAMMAR_TOPIC_LABELS = [
  { id: 'deck', label: 'Dek Aktif' },
  { id: 'is_are', label: 'Is / Are' },
  { id: 'have_has', label: 'Have / Has' },
  { id: 'past', label: 'Past Tense' },
  { id: 'can', label: 'Can / Can\'t' },
  { id: 'routines', label: 'Routines & Jobs' }
];

function renderGrammarTopicPills() {
  const box = document.getElementById('grammar-topic-pills');
  if (!box) return;
  box.innerHTML = '';
  GRAMMAR_TOPIC_LABELS.forEach(t => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = t.id === activeGrammarTopic
      ? 'tactile-btn px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px]'
      : 'tactile-btn px-2.5 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px]';
    btn.textContent = t.label;
    btn.onclick = () => {
      playSfx('click');
      activeGrammarTopic = t.id;
      roundNumber = Math.max(0, roundNumber - 1);
      nextSentenceBuilderRound();
    };
    box.appendChild(btn);
  });
}

function isCleanSentence(v) {
  if (!Array.isArray(v.sentence) || v.sentence.length < 2) return false;
  const joined = v.sentence.join(' ');
  return !/\(=|somebody,|something,|\//.test(joined);
}

function nextSentenceBuilderRound() {
  renderGrammarTopicPills();
  let sentencePool = [];
  if (activeGrammarTopic !== 'deck' && GRAMMAR_TOPIC_BANKS[activeGrammarTopic]) {
    sentencePool = GRAMMAR_TOPIC_BANKS[activeGrammarTopic];
  } else {
    const rawPool = getFilteredVocab();
    sentencePool = rawPool.filter(isCleanSentence);
    if (!sentencePool.length) {
      sentencePool = rawPool.filter(v => Array.isArray(v.sentence) && v.sentence.length >= 2);
    }
    if (!sentencePool.length) {
      sentencePool = VOCAB_DATA.filter(isCleanSentence);
    }
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
      btn.className = 'tactile-btn px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs shadow-xs flex items-center gap-1.5 pop-success';
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

/* ---------- 3. ACOUSTIC DICTATION ---------- */
function nextListeningDictationRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  document.getElementById('dictation-phonetic').textContent = currentItem.phonetic;
  const input = document.getElementById('dictation-user-input');
  input.value = '';
  input.focus();
  speakText(currentItem.word, 0.88);
}

function checkDictationAnswer() {
  const input = document.getElementById('dictation-user-input');
  if (!input || !currentItem) return;
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  if (val === currentItem.word.toLowerCase()) {
    addSuccessScore(130);
    showToast(`Correct spelling: "${currentItem.word}"`, '✓');
    speakText(currentItem.word, 0.88);
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
  showToast(`${currentItem.word.length} huruf, diawali "${currentItem.word[0].toUpperCase()}"`, '!');
  document.getElementById('dictation-user-input').focus();
}

/* ---------- 4. VOICE DUEL (KATA TUNGGAL & SPEAKING PHRASES) ---------- */
let voiceDuelSubmode = 'word';
let voiceDuelTargetPhrase = '';

const SPEAKING_PHRASE_BANK = [
  { text: 'I usually wake up at seven', indo: 'Saya biasanya bangun jam tujuh.' },
  { text: 'She is reading a good book', indo: 'Dia sedang membaca buku yang bagus.' },
  { text: 'Can I have a cup of coffee', indo: 'Bolehkah saya pesan secangkir kopi?' },
  { text: 'They went to the park yesterday', indo: 'Mereka pergi ke taman kemarin.' },
  { text: 'We are learning English every day', indo: 'Kami belajar bahasa Inggris setiap hari.' },
  { text: 'He has an important meeting today', indo: 'Dia memiliki rapat penting hari ini.' }
];

function setVoiceDuelSubmode(mode) {
  playSfx('click');
  voiceDuelSubmode = mode === 'phrase' ? 'phrase' : 'word';
  const tWord = document.getElementById('vd-tab-word');
  const tPhrase = document.getElementById('vd-tab-phrase');
  if (tWord) tWord.className = voiceDuelSubmode === 'word' ? 'tactile-btn px-3 py-1 rounded-xl bg-sky-500 text-white font-bold text-[11px]' : 'tactile-btn px-3 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px]';
  if (tPhrase) tPhrase.className = voiceDuelSubmode === 'phrase' ? 'tactile-btn px-3 py-1 rounded-xl bg-fuchsia-600 text-white font-bold text-[11px]' : 'tactile-btn px-3 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px]';
  roundNumber = Math.max(0, roundNumber - 1);
  nextVoiceDuelRound();
}

function renderDuelPhraseWords(phrase, spokenTokens = null) {
  const box = document.getElementById('duel-phrase-words');
  if (!box) return;
  box.innerHTML = '';
  phrase.split(/\s+/).forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = spokenTokens && spokenTokens.includes(clean);
    const span = document.createElement('span');
    span.className = matched
      ? 'px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-sm transition'
      : 'px-2 py-0.5 rounded-lg app-subsurface border border-slate-700/60 text-slate-200 font-semibold text-sm transition';
    span.textContent = w;
    box.appendChild(span);
  });
}

function nextVoiceDuelRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  const wordEl = document.getElementById('duel-target-word');
  const phraseEl = document.getElementById('duel-phrase-words');
  const phonEl = document.getElementById('duel-phonetic');
  const meanEl = document.getElementById('duel-meaning');
  const subEl = document.getElementById('duel-mode-subtitle');

  if (voiceDuelSubmode === 'phrase') {
    const pick = SPEAKING_PHRASE_BANK[Math.floor(Math.random() * SPEAKING_PHRASE_BANK.length)];
    voiceDuelTargetPhrase = pick.text;
    setOptionalImageFrame('duel-image-frame', null);
    if (subEl) subEl.textContent = 'Speaking Phrases (Highlight per Kata)';
    if (wordEl) wordEl.classList.add('hidden');
    if (phraseEl) {
      phraseEl.classList.remove('hidden');
      renderDuelPhraseWords(voiceDuelTargetPhrase, null);
    }
    if (phonEl) phonEl.textContent = '';
    if (meanEl) meanEl.textContent = `"${pick.indo}"`;
    document.getElementById('duel-status-text').textContent = 'Tekan mikrofon lalu ucapkan kalimat di atas';
    document.getElementById('duel-result-feedback').innerHTML = '';
    speakText(voiceDuelTargetPhrase);
  } else {
    voiceDuelTargetPhrase = '';
    setOptionalImageFrame('duel-image-frame', currentItem);
    if (subEl) subEl.textContent = 'Uji Artikulasi Suara';
    if (wordEl) {
      wordEl.classList.remove('hidden');
      wordEl.textContent = currentItem.word;
    }
    if (phraseEl) phraseEl.classList.add('hidden');
    if (phonEl) phonEl.textContent = currentItem.phonetic;
    if (meanEl) meanEl.textContent = `"${currentItem.definition}"`;
    document.getElementById('duel-status-text').textContent = 'Tekan mikrofon dan ucapkan dengan jelas';
    document.getElementById('duel-result-feedback').innerHTML = '';
    speakText(currentItem.word);
  }
}

function triggerDuelSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusText = document.getElementById('duel-status-text');
  const resultBox = document.getElementById('duel-result-feedback');
  if (!SR) {
    showToast('Browser ini belum mendukung Speech Recognition.', '!');
    if (statusText) statusText.textContent = 'Mikrofon tidak didukung di browser ini (gunakan Chrome/Edge).';
    if (resultBox) {
      resultBox.innerHTML = `<button type="button" onclick="startGame('listening-dictation')" class="tactile-btn px-3.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 font-bold text-xs">Beralih ke Dikte Akustik →</button>`;
    }
    return;
  }
  playSfx('click');
  const recognizer = new SR();
  recognizer.lang = (typeof speechAccentPref !== 'undefined' && speechAccentPref) ? speechAccentPref : 'en-US';
  recognizer.interimResults = false;

  const micBtn = document.getElementById('btn-duel-mic');
  statusText.textContent = 'Mendengarkan... Ucapkan sekarang.';
  micBtn.classList.add('ring-2', 'ring-sky-500');
  recognizer.start();

  recognizer.onresult = (event) => {
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    micBtn.classList.remove('ring-2', 'ring-sky-500');

    if (voiceDuelSubmode === 'phrase' && voiceDuelTargetPhrase) {
      const targetWords = voiceDuelTargetPhrase.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(Boolean);
      const spokenTokens = spoken.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(Boolean);
      renderDuelPhraseWords(voiceDuelTargetPhrase, spokenTokens);
      const hitCount = targetWords.filter(tw => spokenTokens.includes(tw)).length;
      const pct = Math.round((hitCount / Math.max(1, targetWords.length)) * 100);
      if (pct >= 70) {
        statusText.textContent = `Terdengar: "${spoken}"`;
        resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold rounded border border-emerald-400/30">✓ ${pct}% Kalimat Akurat</span>`;
        addSuccessScore(180);
        unlockBadge('voice_master');
        triggerConfetti();
        advanceOrFinishRound(nextVoiceDuelRound, 1200);
      } else {
        statusText.textContent = `Terdengar: "${spoken}" (${pct}% cocok)`;
        resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-amber-500/15 text-amber-400 text-xs font-mono font-bold rounded border border-amber-400/30">Coba ucapkan lagi lebih jelas</span>`;
        playSfx('wrong');
      }
      return;
    }

    const target = currentItem.word.toLowerCase();
    if (spoken.includes(target)) {
      statusText.textContent = `Cocok: "${spoken}"`;
      resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold rounded border border-emerald-400/30">✓ Pelafalan Akurat</span>`;
      addSuccessScore(160);
      unlockBadge('voice_master');
      triggerConfetti();
      advanceOrFinishRound(nextVoiceDuelRound, 1100);
    } else {
      statusText.textContent = `Terdengar: "${spoken}"`;
      resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-rose-500/15 text-rose-400 text-xs font-mono font-bold rounded border border-rose-400/30">Target: "${target}"</span>`;
      handleMistake(currentItem);
    }
  };
  recognizer.onerror = () => { micBtn.classList.remove('ring-2', 'ring-sky-500'); statusText.textContent = 'Gagal membaca mikrofon. Coba lagi.'; };
  recognizer.onend = () => micBtn.classList.remove('ring-2', 'ring-sky-500');
}

/* ---------- 11. PENEMBAK KATA (ZTYPE-STYLE CANVAS ARCADE SHOOTER) ---------- */
let shooterAnimFrame = null;
let shooterParticles = [];
let shooterLasers = [];
let shooterFloaters = [];
let shooterStars = [];
let shooterLockedId = null;
let shooterTurretAngle = -Math.PI / 2;
let shooterShakeFrames = 0;
let shooterLastTick = 0;

function startWordShooterGame() {
  stopAllActiveGameTimers();
  shooterActiveWords = [];
  shooterParticles = [];
  shooterLasers = [];
  shooterFloaters = [];
  shooterLockedId = null;
  shooterTurretAngle = -Math.PI / 2;
  shooterShakeFrames = 0;
  shooterDestroyed = 0;
  roundNumber = 0;
  updateRoundProgressUI();

  const label = document.getElementById('shooter-destroyed-label');
  if (label) label.textContent = `Target: 0 / ${MAX_ROUNDS}`;
  const comboPill = document.getElementById('shooter-combo-pill');
  if (comboPill) comboPill.classList.add('hidden');

  const arena = document.getElementById('shooter-arena');
  arena.querySelectorAll('.shooter-falling-item').forEach(el => el.remove());

  const canvas = document.getElementById('shooter-canvas');
  if (canvas) {
    canvas.width = arena.clientWidth || 600;
    canvas.height = arena.clientHeight || 320;
    shooterStars = Array.from({ length: 34 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      v: Math.random() * 0.25 + 0.1,
      a: Math.random() * 0.5 + 0.2
    }));
  }

  const input = document.getElementById('shooter-type-input');
  if (input) {
    input.value = '';
    input.focus();
  }

  spawnShooterWord();
  shooterSpawnInterval = setInterval(() => {
    if (shooterActiveWords.length < 3 && (shooterDestroyed + shooterActiveWords.length) < MAX_ROUNDS) {
      spawnShooterWord();
    }
  }, 2300);

  shooterLastTick = performance.now();
  shooterAnimFrame = requestAnimationFrame(loopShooterCanvas);
}

function spawnShooterWord() {
  const pool = getFilteredVocab();
  const item = drawNextWord(pool);
  if (!item) return;

  const arena = document.getElementById('shooter-arena');
  if (!arena) return;
  const el = document.createElement('div');
  // Alokasi jalur horizontal anti-tumpang-tindih (4 jalur)
  const lanes = [6, 27, 48, 66];
  const busyLanes = new Set(
    shooterActiveWords.filter(w => w.y < 110).map(w => w.laneIdx)
  );
  const freeLanes = lanes.map((_, idx) => idx).filter(idx => !busyLanes.has(idx));
  const laneIdx = freeLanes.length
    ? freeLanes[Math.floor(Math.random() * freeLanes.length)]
    : Math.floor(Math.random() * lanes.length);
  const leftPct = lanes[laneIdx] + Math.floor(Math.random() * 4);
  el.className = 'shooter-falling-item absolute px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg text-center pointer-events-none transition-colors';
  el.style.left = `${leftPct}%`;
  el.style.top = '10px';
  el.innerHTML = `
    <div class="code-font text-sm font-extrabold text-white tracking-wider shooter-word-label">${item.word}</div>
    <div class="text-[10px] text-sky-300/90 max-w-[140px] truncate">${getShortMeaning(item, 22)}</div>
  `;
  arena.appendChild(el);
  shooterActiveWords.push({
    uid: `sw_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    item,
    el,
    laneIdx,
    y: 10,
    typedLen: 0,
    speed: 0.48 + Math.min(0.45, shooterDestroyed * 0.055)
  });
}

function getShooterTargetCenter(obj, arena) {
  const rect = obj.el.getBoundingClientRect();
  const aRect = arena.getBoundingClientRect();
  return {
    x: (rect.left - aRect.left) + rect.width / 2,
    y: (rect.top - aRect.top) + rect.height / 2
  };
}

function spawnShooterBurst(x, y, count = 18, color = '#38BDF8') {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const spd = Math.random() * 3.6 + 1.2;
    shooterParticles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      r: Math.random() * 2.5 + 1.2,
      color: i % 3 === 0 ? '#34D399' : color,
      alpha: 1
    });
  }
}

function loopShooterCanvas(now) {
  if (currentMode !== 'word-shooter') return;
  const arena = document.getElementById('shooter-arena');
  const canvas = document.getElementById('shooter-canvas');
  if (!arena || !canvas) return;

  const dt = Math.min(2.2, Math.max(0.5, (now - shooterLastTick) / 16.67));
  shooterLastTick = now;

  if (canvas.width !== arena.clientWidth || canvas.height !== arena.clientHeight) {
    canvas.width = arena.clientWidth;
    canvas.height = arena.clientHeight;
  }

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const turretX = W / 2;
  const turretY = H - 22;
  const maxBottom = H - 56;

  // Move falling words (pelan 0.55x saat Mode Zen)
  const paceMult = gamePaceMode === 'zen' ? 0.55 : 1.0;
  for (let i = shooterActiveWords.length - 1; i >= 0; i--) {
    const obj = shooterActiveWords[i];
    obj.y += obj.speed * paceMult * dt;
    obj.el.style.top = `${obj.y}px`;

    if (obj.y >= maxBottom) {
      const pos = getShooterTargetCenter(obj, arena);
      spawnShooterBurst(pos.x, pos.y, 14, '#FB7185');
      shooterShakeFrames = 8;
      if (shooterLockedId === obj.uid) {
        shooterLockedId = null;
        const inp = document.getElementById('shooter-type-input');
        if (inp) inp.value = '';
      }
      obj.el.remove();
      shooterActiveWords.splice(i, 1);
      handleMistake(obj.item);
      showToast(`Terlewat: "${obj.item.word}"`, '✕');
      if (lives > 0 && shooterActiveWords.length === 0) spawnShooterWord();
    }
  }

  // Smooth turret aim toward locked target (or lowest target)
  const lockedObj = shooterActiveWords.find(o => o.uid === shooterLockedId)
    || shooterActiveWords.slice().sort((a, b) => b.y - a.y)[0];
  if (lockedObj) {
    const pos = getShooterTargetCenter(lockedObj, arena);
    const desired = Math.atan2(pos.y - turretY, pos.x - turretX);
    shooterTurretAngle += (desired - shooterTurretAngle) * 0.22;
  }

  // Render Canvas
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  if (shooterShakeFrames > 0) {
    shooterShakeFrames--;
    ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
  }

  // Starfield
  shooterStars.forEach(s => {
    s.y += s.v * dt;
    if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
    ctx.fillStyle = `rgba(148, 163, 184, ${s.a})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Subtle defense line
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.22)';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(16, maxBottom + 18);
  ctx.lineTo(W - 16, maxBottom + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  // Lasers
  for (let i = shooterLasers.length - 1; i >= 0; i--) {
    const l = shooterLasers[i];
    l.alpha -= 0.09 * dt;
    if (l.alpha <= 0) { shooterLasers.splice(i, 1); continue; }
    ctx.strokeStyle = `rgba(56, 189, 248, ${l.alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(248, 250, 252, ${l.alpha * 0.85})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
  }

  // Particles
  for (let i = shooterParticles.length - 1; i >= 0; i--) {
    const p = shooterParticles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.alpha -= 0.032 * dt;
    if (p.alpha <= 0) { shooterParticles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Floating score popups
  for (let i = shooterFloaters.length - 1; i >= 0; i--) {
    const f = shooterFloaters[i];
    f.y -= 0.7 * dt;
    f.alpha -= 0.025 * dt;
    if (f.alpha <= 0) { shooterFloaters.splice(i, 1); continue; }
    ctx.fillStyle = `rgba(52, 211, 153, ${f.alpha})`;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y);
  }

  // Rotating vector turret at bottom center
  ctx.save();
  ctx.translate(turretX, turretY);
  ctx.rotate(shooterTurretAngle + Math.PI / 2);
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(11, 10);
  ctx.lineTo(0, 5);
  ctx.lineTo(-11, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
  shooterAnimFrame = requestAnimationFrame(loopShooterCanvas);
}

function handleShooterInput(rawVal) {
  const val = (rawVal || '').trim().toLowerCase();
  const input = document.getElementById('shooter-type-input');
  const arena = document.getElementById('shooter-arena');
  const canvas = document.getElementById('shooter-canvas');

  // Determine or keep locked target
  let target = shooterActiveWords.find(o => o.uid === shooterLockedId);
  if (target && val && !target.item.word.toLowerCase().startsWith(val)) {
    target = null;
    shooterLockedId = null;
  }
  if (!target && val) {
    const matches = shooterActiveWords
      .filter(o => o.item.word.toLowerCase().startsWith(val))
      .sort((a, b) => b.y - a.y);
    if (matches.length) {
      target = matches[0];
      shooterLockedId = target.uid;
    }
  }

  // Update visual highlight on all words
  shooterActiveWords.forEach(obj => {
    const label = obj.el.querySelector('.shooter-word-label');
    if (!label) return;
    const w = obj.item.word.toLowerCase();
    const isLocked = target && obj.uid === target.uid && val && w.startsWith(val);
    if (isLocked) {
      label.innerHTML = `<span class="text-emerald-400">${w.slice(0, val.length)}</span><span class="text-white">${w.slice(val.length)}</span>`;
      obj.el.classList.add('border-sky-400', 'ring-2', 'ring-sky-400/40');
      obj.el.classList.remove('border-slate-700/80');
    } else {
      label.textContent = obj.item.word;
      obj.el.classList.remove('border-sky-400', 'ring-2', 'ring-sky-400/40');
      obj.el.classList.add('border-slate-700/80');
    }
  });

  // Fire laser per new correct letter!
  if (target && val.length > target.typedLen && arena && canvas) {
    target.typedLen = val.length;
    const pos = getShooterTargetCenter(target, arena);
    shooterLasers.push({
      x1: canvas.width / 2,
      y1: canvas.height - 26,
      x2: pos.x,
      y2: pos.y,
      alpha: 1
    });
    spawnShooterBurst(pos.x, pos.y, 5, '#38BDF8');
    playSfx('laser', streak);
  }

  // Word completely destroyed!
  if (target && target.item.word.toLowerCase() === val) {
    const hitIdx = shooterActiveWords.findIndex(o => o.uid === target.uid);
    if (hitIdx !== -1) {
      const pos = getShooterTargetCenter(target, arena);
      spawnShooterBurst(pos.x, pos.y, 24, '#38BDF8');
      shooterFloaters.push({ x: pos.x, y: pos.y, text: streak >= 4 ? 'FEVER +280' : '+140', alpha: 1 });
      shooterShakeFrames = 5;
      playSfx('explode');

      currentItem = target.item;
      target.el.remove();
      shooterActiveWords.splice(hitIdx, 1);
      shooterLockedId = null;

      if (input) input.value = '';
      shooterDestroyed++;
      roundNumber = shooterDestroyed;
      updateRoundProgressUI();
      document.getElementById('shooter-destroyed-label').textContent = `Target: ${shooterDestroyed} / ${MAX_ROUNDS}`;

      addSuccessScore(140);
      const comboPill = document.getElementById('shooter-combo-pill');
      if (comboPill) comboPill.classList.toggle('hidden', streak < 3);

      speakText(target.item.word);

      if (shooterDestroyed >= MAX_ROUNDS) {
        stopAllActiveGameTimers();
        setTimeout(endGameSession, 450);
      } else if (shooterActiveWords.length === 0) {
        spawnShooterWord();
      }
    }
  }
}

function speakShooterFirstWord() {
  if (shooterActiveWords.length > 0) speakText(shooterActiveWords[0].item.word, 0.88);
}
