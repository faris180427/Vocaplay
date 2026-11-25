/* ==============================================================
   VOCAPLAY — DECK PICKER, CATEGORY PILLS & SHUFFLE-BAG QUEUE
   ============================================================== */

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
  if (iconEl) iconEl.innerHTML = getAppIconSvg(deck.icon, 'w-6 h-6');
  if (titleEl) titleEl.textContent = deck.title;

  currentCategory = 'All';
  initCategoryPills();
  updateAvailableCorpusCount();
  if (!silent) showToast(`Dek aktif: ${deck.title}`, '✓');
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
    ? [...VOCAB_DECKS, { id: 'weak_vault', title: 'Memory Vault (Kata Lemah)', desc: 'Latih ulang kata yang pernah salah', color: 'from-rose-500 to-red-600', icon: 'zap', tag: 'Review', cefr: 'MIX' }]
    : VOCAB_DECKS;

  allDecks.forEach(deck => {
    const count = getDeckVocab(deck.id, VOCAB_DATA, weakList).length;
    const isActive = deck.id === activeDeckId;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `tactile-btn app-surface text-left rounded-2xl p-4 border transition flex items-start gap-3.5 ${isActive ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-200 hover:border-sky-400/60'}`;
    card.innerHTML = `
      <div class="w-12 h-14 rounded-xl bg-gradient-to-br ${deck.color} text-white flex flex-col items-center justify-center shadow-sm flex-shrink-0">
        ${getAppIconSvg(deck.icon, 'w-6 h-6')}
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
