/* ==============================================================
   VOCAPLAY — ALL 12 INTERACTIVE GAME MODES
   ============================================================== */

/* ---------- 1. FAST VOCAB ---------- */
function nextFastVocabRound() {
  clearInterval(fastVocabTimerInterval);
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  const distractorSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const otherCards = distractorSource.filter(i => i.id !== currentItem.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const roundChoices = [currentItem, ...otherCards].sort(() => 0.5 - Math.random());

  const grid = document.getElementById('fast-vocab-cards-grid');
  grid.innerHTML = '';
  roundChoices.forEach((choice, idx) => {
    const card = document.createElement('button');
    card.dataset.wordId = choice.id;
    card.style.animationDelay = `${idx * 40}ms`;
    if (hasRealImage(choice)) {
      card.className = 'animate-fade-in tactile-btn fast-vocab-card h-40 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-2.5 transition hover:border-indigo-400 focus-ring overflow-hidden shadow-xs';
      card.innerHTML = `
        <div class="w-full h-24 lexical-img-frame mb-1.5">${renderWordImgTag(choice)}</div>
        <div class="flex items-center justify-between w-full px-1 gap-1.5">
          <span class="text-xs font-bold text-slate-800 truncate">${getShortMeaning(choice, 28)}</span>
          <span class="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">${choice.cefr}</span>
        </div>
      `;
    } else {
      card.className = 'animate-fade-in tactile-btn fast-vocab-card app-surface h-32 border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-3.5 transition hover:border-sky-400 focus-ring shadow-xs text-center';
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

  speakText(currentItem.word, 0.88);
  const baseDuration = (CEFR_CONFIG[currentItem.cefr] || CEFR_CONFIG.A1).timerSec;
  fastVocabTimeLeft = baseDuration;
  const bar = document.getElementById('fast-vocab-timer-bar');
  bar.style.width = '100%';

  fastVocabTimerInterval = setInterval(() => {
    fastVocabTimeLeft -= 0.05;
    bar.style.width = `${Math.max(0, (fastVocabTimeLeft / baseDuration) * 100)}%`;
    if (fastVocabTimeLeft <= 0) {
      clearInterval(fastVocabTimerInterval);
      handleMistake(currentItem);
      showToast(`Time up: "${currentItem.word}"`, '⏰');
      highlightFastVocabCorrect();
      advanceOrFinishRound(nextFastVocabRound, 1100);
    }
  }, 50);
}

function handleFastVocabChoice(selected, cardEl) {
  clearInterval(fastVocabTimerInterval);
  document.querySelectorAll('.fast-vocab-card').forEach(c => c.disabled = true);
  if (selected.id === currentItem.id) {
    cardEl.classList.add('border-emerald-500', 'bg-emerald-500/15', 'pop-success');
    addSuccessScore(100);
    showToast(`Matched: ${currentItem.word}`, '✓');
    advanceOrFinishRound(nextFastVocabRound, 650);
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

/* ---------- 2. WORD SPELLER ---------- */
let spellerTargetLetters = [];
let spellerConstructedWord = [];
let spellerTileButtons = [];

function nextWordSpellerRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  spellerTargetLetters = currentItem.word.toLowerCase().split('');
  spellerConstructedWord = [];

  setOptionalImageFrame('speller-image-frame', currentItem);
  document.getElementById('speller-phonetic-text').textContent = currentItem.phonetic || `/${currentItem.word}/`;
  document.getElementById('speller-meaning-text').textContent = `"${currentItem.definition || currentItem.meaning}"`;
  speakText(currentItem.word, 0.88);

  let distractors;
  if (currentItem.distractors && currentItem.distractors.length) {
    distractors = (currentItem.distractors || []).slice(0, currentItem.cefr === 'C1' ? 4 : 2);
  } else {
    const wordLetters = new Set(spellerTargetLetters);
    const pool = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !wordLetters.has(c));
    const count = currentItem.cefr === 'C1' ? 4 : currentItem.cefr === 'B2' ? 3 : 2;
    distractors = pool.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  spellerTileButtons = [...spellerTargetLetters, ...distractors]
    .map((char, idx) => ({ id: `tile_${idx}`, char, used: false }))
    .sort(() => 0.5 - Math.random());
  renderSpellerSlotsAndTiles();
}

function renderSpellerSlotsAndTiles() {
  const slots = document.getElementById('speller-target-slots');
  slots.innerHTML = '';
  for (let i = 0; i < spellerTargetLetters.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'w-9 h-11 rounded-lg border flex items-center justify-center font-bold text-base uppercase transition font-mono';
    if (i < spellerConstructedWord.length) {
      slot.className += ' bg-white border-blue-600 text-blue-700 shadow-xs cursor-pointer hover:bg-slate-50 pop-success';
      slot.textContent = spellerConstructedWord[i].char;
      slot.onclick = () => removeSpellerTileAt(i);
    } else {
      slot.className += ' bg-white border-slate-200 text-slate-300';
      slot.textContent = '·';
    }
    slots.appendChild(slot);
  }

  const deck = document.getElementById('speller-letter-deck');
  deck.innerHTML = '';
  spellerTileButtons.forEach(tile => {
    const btn = document.createElement('button');
    btn.className = `tactile-btn w-9 h-11 rounded-lg font-bold text-base font-mono uppercase transition ${tile.used ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed' : 'bg-white hover:border-slate-400 text-slate-800 border border-slate-200 shadow-xs'}`;
    btn.textContent = tile.char;
    btn.disabled = tile.used;
    btn.onclick = () => handleSpellerTileClick(tile);
    deck.appendChild(btn);
  });
}

function handleSpellerTileClick(tile) {
  if (tile.used || spellerConstructedWord.length >= spellerTargetLetters.length) return;
  playSfx('click');
  tile.used = true;
  spellerConstructedWord.push(tile);
  renderSpellerSlotsAndTiles();
  if (spellerConstructedWord.length === spellerTargetLetters.length) verifySpellerAnswer();
}

function removeSpellerTileAt(idx) {
  playSfx('click');
  const t = spellerConstructedWord.splice(idx, 1)[0];
  if (t) t.used = false;
  renderSpellerSlotsAndTiles();
}

function verifySpellerAnswer() {
  const ans = spellerConstructedWord.map(t => t.char).join('');
  if (ans === spellerTargetLetters.join('')) {
    addSuccessScore(120);
    showToast(`Correct: "${currentItem.word}"`, '✓');
    speakText(currentItem.word, 0.88);
    advanceOrFinishRound(nextWordSpellerRound, 900);
  } else {
    handleMistake(currentItem);
    showToast('Orthography mismatch.', '✕');
    const slots = document.getElementById('speller-target-slots');
    slots.classList.add('shake-anim');
    setTimeout(() => slots.classList.remove('shake-anim'), 350);
  }
}

function useSpellerHint() {
  playSfx('click');
  const idx = spellerConstructedWord.length;
  if (idx >= spellerTargetLetters.length) return;
  const needed = spellerTargetLetters[idx];
  const tile = spellerTileButtons.find(t => !t.used && t.char === needed);
  if (tile) {
    tile.used = true;
    spellerConstructedWord.push(tile);
    score = Math.max(0, score - 20);
    updateHeaderStats();
    renderSpellerSlotsAndTiles();
    if (spellerConstructedWord.length === spellerTargetLetters.length) verifySpellerAnswer();
  }
}

function resetSpellerCurrentRound() {
  playSfx('click');
  spellerConstructedWord = [];
  spellerTileButtons.forEach(t => t.used = false);
  renderSpellerSlotsAndTiles();
}

/* ---------- 3. SENTENCE BUILDER ---------- */
let sentenceOriginalTokens = [];
let sentenceAvailableTokens = [];
let sentencePlacedTokens = [];

function isCleanSentence(v) {
  if (!Array.isArray(v.sentence) || v.sentence.length < 2) return false;
  const joined = v.sentence.join(' ');
  return !/\(=|somebody,|something,|\//.test(joined);
}

function nextSentenceBuilderRound() {
  const rawPool = getFilteredVocab();
  let sentencePool = rawPool.filter(isCleanSentence);
  if (!sentencePool.length) {
    sentencePool = rawPool.filter(v => Array.isArray(v.sentence) && v.sentence.length >= 2);
  }
  if (!sentencePool.length) {
    sentencePool = VOCAB_DATA.filter(isCleanSentence);
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

/* ---------- 4. MEMORY FLIP ---------- */
let flippedCards = [];
let matchedPairsCount = 0;
let totalPairsNeeded = 4;

function initMemoryFlipGame() {
  const pool = getFilteredVocab();
  roundNumber++;
  updateRoundProgressUI();

  const pairCount = 4;
  const selected = [];
  for (let i = 0; i < Math.min(pairCount, pool.length); i++) {
    const w = drawNextWord(pool);
    if (w && !selected.some(s => s.id === w.id)) selected.push(w);
  }
  totalPairsNeeded = selected.length;
  matchedPairsCount = 0;
  flippedCards = [];
  document.getElementById('memory-pairs-count').textContent = `0 / ${totalPairsNeeded}`;

  const deck = [];
  selected.forEach((item, idx) => {
    deck.push({ uid: `t_${idx}`, pairId: item.id, type: 'text', item });
    deck.push({ uid: `i_${idx}`, pairId: item.id, type: 'image', item });
  });
  deck.sort(() => 0.5 - Math.random());

  const grid = document.getElementById('memory-cards-grid');
  grid.innerHTML = '';
  deck.forEach(card => {
    const el = document.createElement('div');
    el.className = 'tactile-btn memory-card-item h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-xs text-center p-2 overflow-hidden';
    el.innerHTML = `<span class="code-font text-xs font-bold text-slate-400">?</span>`;
    el.onclick = () => handleMemoryCardClick(card, el);
    grid.appendChild(el);
  });
}

function handleMemoryCardClick(card, el) {
  if (flippedCards.length >= 2 || el.dataset.matched === 'true' || flippedCards.some(f => f.card.uid === card.uid)) return;
  playSfx('click');
  el.classList.add('bg-slate-50', 'border-slate-400', 'card-flip-in');
  if (card.type === 'image') {
    if (hasRealImage(card.item)) {
      el.innerHTML = `<div class="w-full h-full lexical-img-frame">${renderWordImgTag(card.item)}</div>`;
    } else {
      el.innerHTML = `<div class="flex flex-col items-center justify-center px-1.5"><span class="text-[9px] font-mono uppercase text-sky-400 font-bold mb-0.5">${card.item.category}</span><span class="text-[11px] font-semibold text-slate-800 line-clamp-3 leading-tight">${getShortMeaning(card.item, 48)}</span></div>`;
    }
  } else {
    el.innerHTML = `<span class="code-font text-xs font-bold text-slate-900">${card.item.word}</span>`;
    currentItem = card.item;
    speakText(card.item.word, 0.88);
  }
  flippedCards.push({ card, el });

  if (flippedCards.length === 2) {
    const [a, b] = flippedCards;
    if (a.card.pairId === b.card.pairId) {
      a.el.dataset.matched = 'true';
      b.el.dataset.matched = 'true';
      a.el.className = 'tactile-btn memory-card-item h-28 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex items-center justify-center text-center p-2 overflow-hidden pop-success';
      b.el.className = 'tactile-btn memory-card-item h-28 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex items-center justify-center text-center p-2 overflow-hidden pop-success';
      currentItem = a.card.item;
      matchedPairsCount++;
      document.getElementById('memory-pairs-count').textContent = `${matchedPairsCount} / ${totalPairsNeeded}`;
      addSuccessScore(130);
      flippedCards = [];
      if (matchedPairsCount >= totalPairsNeeded) {
        triggerConfetti();
        advanceOrFinishRound(initMemoryFlipGame, 900);
      }
    } else {
      setTimeout(() => {
        a.el.className = 'tactile-btn memory-card-item h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-xs text-center p-2 overflow-hidden';
        b.el.className = 'tactile-btn memory-card-item h-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-xs text-center p-2 overflow-hidden';
        a.el.innerHTML = `<span class="code-font text-xs font-bold text-slate-400">?</span>`;
        b.el.innerHTML = `<span class="code-font text-xs font-bold text-slate-400">?</span>`;
        handleMistake(a.card.item);
        flippedCards = [];
      }, 750);
    }
  }
}

/* ---------- 5. WORD SCRAMBLE ---------- */
let scrambleTargetWord = '';

function nextWordScrambleRound() {
  const rawPool = getFilteredVocab();
  let validPool = rawPool.filter(v => v.word && v.word.trim().length >= 2);
  if (!validPool.length) validPool = VOCAB_DATA.filter(v => v.word && v.word.trim().length >= 2);
  currentItem = drawNextWord(validPool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  scrambleTargetWord = currentItem.word.toLowerCase();
  const letters = scrambleTargetWord.split('');
  let tries = 0;
  do { letters.sort(() => 0.5 - Math.random()); tries++; } while (letters.join('') === scrambleTargetWord && tries < 10);

  setOptionalImageFrame('scramble-image-frame', currentItem);
  document.getElementById('scramble-jumbled-word').textContent = letters.join(' ').toUpperCase();
  document.getElementById('scramble-meaning-clue').textContent = `Definition: ${currentItem.definition}`;

  const input = document.getElementById('scramble-user-input');
  input.value = '';
  input.focus();
}

function checkScrambleAnswer() {
  const input = document.getElementById('scramble-user-input');
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  if (val === scrambleTargetWord) {
    speakText(scrambleTargetWord, 0.88);
    addSuccessScore(140);
    showToast(`Anagram resolved: ${scrambleTargetWord}`, '✓');
    advanceOrFinishRound(nextWordScrambleRound, 850);
  } else {
    handleMistake(currentItem);
    showToast('Incorrect anagram transcription.', '✕');
    input.classList.add('shake-anim', 'border-rose-500');
    setTimeout(() => input.classList.remove('shake-anim', 'border-rose-500'), 400);
  }
}

function useScrambleHint() {
  if (!scrambleTargetWord) return;
  playSfx('click');
  const input = document.getElementById('scramble-user-input');
  input.value = scrambleTargetWord.slice(0, 2).toUpperCase();
  score = Math.max(0, score - 15);
  updateHeaderStats();
  input.focus();
}

/* ---------- 6. ODD ONE OUT ---------- */
function nextOddOneOutRound() {
  roundNumber++;
  updateRoundProgressUI();

  const tierPool = currentCEFR === 'ALL' ? VOCAB_DATA : VOCAB_DATA.filter(v => v.cefr === currentCEFR);
  const byCat = {};
  VOCAB_DATA.forEach(v => {
    if (!byCat[v.category]) byCat[v.category] = [];
    byCat[v.category].push(v);
  });

  const validCats = Object.keys(byCat).filter(c => byCat[c].length >= 3);
  const tierCats = validCats.filter(c => tierPool.some(w => w.category === c));
  const chosenPoolCats = tierCats.length ? tierCats : validCats;
  const mainCat = chosenPoolCats[Math.floor(Math.random() * chosenPoolCats.length)];
  const otherCats = Object.keys(byCat).filter(c => c !== mainCat);
  const otherCat = otherCats[Math.floor(Math.random() * otherCats.length)];

  const mainCandidates = [
    ...tierPool.filter(v => v.category === mainCat),
    ...byCat[mainCat].filter(v => !tierPool.some(t => t.id === v.id))
  ];
  const mainItems = mainCandidates.slice(0, 6).sort(() => 0.5 - Math.random()).slice(0, 3);
  const oddCandidates = tierPool.filter(v => v.category === otherCat);
  const oddPool = oddCandidates.length ? oddCandidates : byCat[otherCat];
  const oddItem = oddPool[Math.floor(Math.random() * oddPool.length)];
  currentItem = oddItem;

  const roundItems = [...mainItems, oddItem].sort(() => 0.5 - Math.random());
  document.getElementById('odd-out-prompt').textContent = `Which item does NOT belong to "${mainCat}"?`;

  const grid = document.getElementById('odd-out-cards-grid');
  grid.innerHTML = '';
  roundItems.forEach(item => {
    const card = document.createElement('button');
    if (hasRealImage(item)) {
      card.className = 'animate-fade-in tactile-btn h-36 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-between p-2 transition hover:border-slate-400 focus-ring overflow-hidden shadow-xs';
      card.innerHTML = `
        <div class="w-full h-20 lexical-img-frame mb-1">${renderWordImgTag(item)}</div>
        <span class="text-xs font-bold text-slate-800">${item.word}</span>
        <span class="text-[10px] text-slate-400 font-mono">${item.cefr}</span>
      `;
    } else {
      card.className = 'animate-fade-in tactile-btn app-surface h-28 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-3 transition hover:border-sky-400 focus-ring shadow-xs gap-1';
      card.innerHTML = `
        <span class="text-sm font-extrabold tracking-tight">${item.word}</span>
        <span class="text-[10px] text-slate-400 font-mono">${item.phonetic || ('/' + item.word + '/')} • ${item.cefr}</span>
      `;
    }
    card.onclick = () => {
      grid.querySelectorAll('button').forEach(b => b.disabled = true);
      if (item.id === oddItem.id) {
        card.classList.add('border-emerald-500', 'bg-emerald-500/15', 'pop-success');
        addSuccessScore(120);
        showToast(`Outlier: "${oddItem.word}" (${oddItem.category})`, '✓');
        advanceOrFinishRound(nextOddOneOutRound, 850);
      } else {
        card.classList.add('border-rose-500', 'bg-rose-500/15', 'shake-anim');
        handleMistake(oddItem);
        showToast(`"${item.word}" belongs to ${mainCat}.`, '✕');
        advanceOrFinishRound(nextOddOneOutRound, 1000);
      }
    };
    grid.appendChild(card);
  });
}

/* ---------- 7. ACOUSTIC DICTATION ---------- */
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
  showToast(`${currentItem.word.length} letters, starts with "${currentItem.word[0].toUpperCase()}"`, '💡');
  document.getElementById('dictation-user-input').focus();
}

/* ---------- 8. MEANING HUNTER ---------- */
function nextMeaningHunterRound() {
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  const hasSyn = Boolean(currentItem.synonym && currentItem.synonym.trim());
  const hasAnt = Boolean(currentItem.antonym && currentItem.antonym.trim());
  const useAntonym = hasAnt && Math.random() > 0.65;
  const useSynonym = hasSyn && !useAntonym;
  const useDefMatch = !useAntonym && !useSynonym;

  const correctChoice = useAntonym
    ? currentItem.antonym
    : (useSynonym ? currentItem.synonym : currentItem.meaning);

  document.getElementById('hunter-relation-type').textContent = useAntonym
    ? 'Find Antonym (Opposite)'
    : (useDefMatch ? 'Match Meaning (Bahasa Indonesia)' : 'Find Synonym (Similar)');
  document.getElementById('hunter-target-word').textContent = currentItem.word;
  document.getElementById('hunter-target-meaning').textContent = useDefMatch
    ? `${currentItem.phonetic || ('/' + currentItem.word + '/')} • ${currentItem.category || 'General'}`
    : `"${currentItem.definition || currentItem.meaning}"`;

  const otherSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const distractors = [];
  const usedTexts = new Set([String(correctChoice).toLowerCase()]);
  for (let i = 0; i < 24 && distractors.length < 3; i++) {
    const candidate = otherSource[Math.floor(Math.random() * otherSource.length)];
    if (!candidate || candidate.id === currentItem.id) continue;
    const text = useAntonym
      ? (candidate.antonym || candidate.synonym || candidate.meaning)
      : (useDefMatch ? candidate.meaning : (candidate.synonym || candidate.meaning));
    if (text && !usedTexts.has(text.toLowerCase())) {
      usedTexts.add(text.toLowerCase());
      distractors.push(text);
    }
  }

  const options = [{ text: correctChoice, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))]
    .sort(() => 0.5 - Math.random());

  const grid = document.getElementById('hunter-options-grid');
  grid.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'animate-fade-in tactile-btn p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 font-semibold text-xs text-slate-800 shadow-xs';
    btn.textContent = opt.text;
    btn.onclick = () => {
      grid.querySelectorAll('button').forEach(b => b.disabled = true);
      if (opt.correct) {
        btn.classList.add('bg-emerald-500/15', 'border-emerald-500', 'pop-success');
        addSuccessScore(125);
        showToast(`Verified: ${opt.text}`, '✓');
        advanceOrFinishRound(nextMeaningHunterRound, 800);
      } else {
        btn.classList.add('bg-rose-500/15', 'border-rose-500', 'shake-anim');
        handleMistake(currentItem);
        showToast(`Answer: "${correctChoice}"`, '✕');
        advanceOrFinishRound(nextMeaningHunterRound, 1100);
      }
    };
    grid.appendChild(btn);
  });
}

/* ---------- 9. BALLOON CATCHER ---------- */
function nextBalloonCatcherRound() {
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  document.getElementById('balloon-target-prompt').textContent = `Tangkap: "${getShortMeaning(currentItem, 56)}"`;
  const playground = document.getElementById('balloon-playground');
  playground.innerHTML = '';

  const otherSource = pool.length >= 4 ? pool : VOCAB_DATA;
  const otherWords = otherSource.filter(v => v.id !== currentItem.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const balloons = [currentItem, ...otherWords].sort(() => 0.5 - Math.random());

  const fallDurations = [3.8, 4.4, 5.0, 4.1];
  balloons.forEach((item, idx) => {
    const balloon = document.createElement('button');
    const leftPct = 4 + (idx * 23) + Math.floor(Math.random() * 8);
    const duration = fallDurations[idx];

    balloon.className = 'balloon-falling tactile-btn px-3.5 py-2 rounded-2xl bg-white border border-slate-300 shadow-md text-slate-800 font-semibold text-xs flex items-center gap-2 hover:border-indigo-500';
    balloon.style.left = `${leftPct}%`;
    balloon.style.animationDuration = `${duration}s`;
    balloon.style.animationDelay = `${idx * 0.5}s`;
    balloon.innerHTML = hasRealImage(item)
      ? `<div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">${renderWordImgTag(item, 'w-full h-full object-cover')}</div><span class="code-font font-bold">${item.word}</span>`
      : `<span class="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0"></span><span class="code-font font-bold text-sm">${item.word}</span>`;

    let answered = false;
    balloon.onclick = () => {
      if (answered) return;
      answered = true;
      balloon.style.animationPlayState = 'paused';
      if (item.id === currentItem.id) {
        balloon.classList.add('bg-emerald-50', 'border-emerald-600', 'pop-success');
        addSuccessScore(130);
        showToast(`Tertangkap: "${currentItem.word}"`, '✓');
        speakText(currentItem.word);
        setTimeout(() => { playground.innerHTML = ''; advanceOrFinishRound(nextBalloonCatcherRound, 400); }, 500);
      } else {
        balloon.classList.add('bg-rose-50', 'border-rose-500', 'shake-anim');
        handleMistake(currentItem);
        showToast('Target salah!', '✕');
      }
    };

    balloon.addEventListener('animationend', () => {
      if (!answered) {
        answered = true;
        balloon.remove();
        if (item.id === currentItem.id) {
          handleMistake(item);
          showToast(`Target lolos: "${item.word}"!`, '💨');
          playground.innerHTML = '';
          advanceOrFinishRound(nextBalloonCatcherRound, 500);
        } else if (playground.querySelectorAll('.balloon-falling').length === 0) {
          advanceOrFinishRound(nextBalloonCatcherRound, 400);
        }
      }
    });

    playground.appendChild(balloon);
  });
}

/* ---------- 10. VOICE DUEL ---------- */
function nextVoiceDuelRound() {
  currentItem = drawNextWord(getFilteredVocab());
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  setOptionalImageFrame('duel-image-frame', currentItem);
  document.getElementById('duel-target-word').textContent = currentItem.word;
  document.getElementById('duel-phonetic').textContent = currentItem.phonetic;
  document.getElementById('duel-meaning').textContent = `"${currentItem.definition}"`;
  document.getElementById('duel-status-text').textContent = 'Tap microphone and articulate clearly';
  document.getElementById('duel-result-feedback').innerHTML = '';
  speakText(currentItem.word, 0.88);
}

function triggerDuelSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Web Speech Recognition requires Chrome/Edge on localhost.', '⚠️'); return; }
  playSfx('click');
  const recognizer = new SR();
  recognizer.lang = 'en-US';
  recognizer.interimResults = false;

  const micBtn = document.getElementById('btn-duel-mic');
  const statusText = document.getElementById('duel-status-text');
  const resultBox = document.getElementById('duel-result-feedback');
  statusText.textContent = 'Listening... Articulate now.';
  micBtn.classList.add('ring-2', 'ring-blue-600');
  recognizer.start();

  recognizer.onresult = (event) => {
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    const target = currentItem.word.toLowerCase();
    micBtn.classList.remove('ring-2', 'ring-blue-600');
    if (spoken.includes(target)) {
      statusText.textContent = `Match confirmed: "${spoken}"`;
      resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-200">✓ Articulation Verified</span>`;
      addSuccessScore(160);
      unlockBadge('voice_master');
      triggerConfetti();
      advanceOrFinishRound(nextVoiceDuelRound, 1100);
    } else {
      statusText.textContent = `Heard: "${spoken}"`;
      resultBox.innerHTML = `<span class="px-2.5 py-0.5 bg-rose-50 text-rose-800 text-xs font-mono font-bold rounded border border-rose-200">Target: "${target}"</span>`;
      handleMistake(currentItem);
    }
  };
  recognizer.onerror = () => { micBtn.classList.remove('ring-2', 'ring-blue-600'); statusText.textContent = 'Audio error. Retry.'; };
  recognizer.onend = () => micBtn.classList.remove('ring-2', 'ring-blue-600');
}

/* ---------- 11. PENEMBAK KATA (WORD SHOOTER) ---------- */
function startWordShooterGame() {
  stopAllActiveGameTimers();
  shooterActiveWords = [];
  shooterDestroyed = 0;
  roundNumber = 0;
  updateRoundProgressUI();
  document.getElementById('shooter-destroyed-label').textContent = `Destroyed: 0 / ${MAX_ROUNDS}`;

  const arena = document.getElementById('shooter-arena');
  arena.querySelectorAll('.shooter-falling-item').forEach(el => el.remove());

  const input = document.getElementById('shooter-type-input');
  input.value = '';
  input.focus();

  spawnShooterWord();
  shooterSpawnInterval = setInterval(() => {
    if (shooterActiveWords.length < 3 && (shooterDestroyed + shooterActiveWords.length) < MAX_ROUNDS) {
      spawnShooterWord();
    }
  }, 2400);

  shooterInterval = setInterval(tickShooterArena, 50);
}

function spawnShooterWord() {
  const pool = getFilteredVocab();
  const item = drawNextWord(pool);
  if (!item) return;

  const arena = document.getElementById('shooter-arena');
  const el = document.createElement('div');
  const leftPct = 10 + Math.floor(Math.random() * 62);
  el.className = 'shooter-falling-item absolute px-3 py-1.5 rounded-xl bg-slate-900/90 border border-sky-400/60 shadow-lg text-center pointer-events-none transition-colors';
  el.style.left = `${leftPct}%`;
  el.style.top = '8px';
  el.innerHTML = `
    <div class="code-font text-sm font-extrabold text-white tracking-wide shooter-word-label">${item.word}</div>
    <div class="text-[10px] text-sky-300 max-w-[140px] truncate">${getShortMeaning(item, 24)}</div>
  `;
  arena.appendChild(el);
  shooterActiveWords.push({
    item,
    el,
    y: 8,
    speed: 0.95 + Math.min(0.6, shooterDestroyed * 0.08)
  });
}

function tickShooterArena() {
  const arena = document.getElementById('shooter-arena');
  if (!arena || currentMode !== 'word-shooter') return;
  const maxBottom = arena.clientHeight - 54;

  for (let i = shooterActiveWords.length - 1; i >= 0; i--) {
    const obj = shooterActiveWords[i];
    obj.y += obj.speed;
    obj.el.style.top = `${obj.y}px`;

    if (obj.y >= maxBottom) {
      obj.el.remove();
      shooterActiveWords.splice(i, 1);
      handleMistake(obj.item);
      showToast(`Missed "${obj.item.word}"!`, '💥');
      if (lives > 0 && shooterActiveWords.length === 0) spawnShooterWord();
    }
  }
}

function handleShooterInput(rawVal) {
  const val = (rawVal || '').trim().toLowerCase();
  const input = document.getElementById('shooter-type-input');

  shooterActiveWords.forEach(obj => {
    const label = obj.el.querySelector('.shooter-word-label');
    if (!label) return;
    const w = obj.item.word.toLowerCase();
    if (val && w.startsWith(val)) {
      label.innerHTML = `<span class="text-emerald-400 underline">${w.slice(0, val.length)}</span>${w.slice(val.length)}`;
      obj.el.classList.add('border-emerald-400');
    } else {
      label.textContent = obj.item.word;
      obj.el.classList.remove('border-emerald-400');
    }
  });

  const hitIdx = shooterActiveWords.findIndex(obj => obj.item.word.toLowerCase() === val);
  if (hitIdx !== -1) {
    const hit = shooterActiveWords[hitIdx];
    currentItem = hit.item;
    hit.el.innerHTML = `<div class="text-2xl pop-success">💥</div>`;
    setTimeout(() => hit.el.remove(), 220);
    shooterActiveWords.splice(hitIdx, 1);

    input.value = '';
    shooterDestroyed++;
    roundNumber = shooterDestroyed;
    updateRoundProgressUI();
    document.getElementById('shooter-destroyed-label').textContent = `Destroyed: ${shooterDestroyed} / ${MAX_ROUNDS}`;

    addSuccessScore(140);
    speakText(hit.item.word, 0.9);
    showToast(`Boom! "${hit.item.word}"`, '🚀');

    if (shooterDestroyed >= MAX_ROUNDS) {
      stopAllActiveGameTimers();
      setTimeout(endGameSession, 450);
    } else if (shooterActiveWords.length === 0) {
      spawnShooterWord();
    }
  }
}

function speakShooterFirstWord() {
  if (shooterActiveWords.length > 0) speakText(shooterActiveWords[0].item.word, 0.88);
}

/* ---------- 12. UJIAN KILAT TOEIC / IELTS ---------- */
function nextExamQuizRound() {
  clearInterval(examTimerInterval);
  const pool = getFilteredVocab();
  currentItem = drawNextWord(pool);
  if (!currentItem) return;
  roundNumber++;
  updateRoundProgressUI();

  document.getElementById('exam-badge').textContent = currentExamType === 'ielts' ? 'IELTS Academic Simulation' : 'TOEIC Business Simulation';

  const fullSentence = Array.isArray(currentItem.sentence) ? currentItem.sentence.join(' ') : '';
  const wordRegex = new RegExp(`\\b${currentItem.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  const canCloze = fullSentence && isCleanSentence(currentItem) && wordRegex.test(fullSentence) && (roundNumber % 2 === 1);

  const otherSource = pool.length >= 4 ? pool : VOCAB_DATA;
  let options = [];

  if (canCloze) {
    const maskedSentence = fullSentence.replace(wordRegex, '________');
    document.getElementById('exam-target-word').textContent = maskedSentence;
    document.getElementById('exam-phonetic').textContent = `${currentItem.category} (${currentItem.cefr}) • Fill in the blank`;
    document.getElementById('exam-question-prompt').textContent = `Clue: ${currentItem.definition || currentItem.meaning}`;

    const correctWord = currentItem.word;
    const distractors = [];
    const used = new Set([correctWord.toLowerCase()]);
    for (let i = 0; i < 40 && distractors.length < 3; i++) {
      const cand = otherSource[Math.floor(Math.random() * otherSource.length)];
      if (!cand || cand.id === currentItem.id || !cand.word) continue;
      if (!used.has(cand.word.toLowerCase())) {
        used.add(cand.word.toLowerCase());
        distractors.push(cand.word);
      }
    }
    options = [{ text: correctWord, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))]
      .sort(() => 0.5 - Math.random());
  } else {
    document.getElementById('exam-target-word').textContent = currentItem.word;
    document.getElementById('exam-phonetic').textContent = `${currentItem.phonetic || ('/' + currentItem.word + '/')} • ${currentItem.category} (${currentItem.cefr})`;
    document.getElementById('exam-question-prompt').textContent = 'Choose the accurate definition or equivalent:';

    const correctDef = currentItem.definition || currentItem.meaning;
    const distractors = [];
    const used = new Set([correctDef.toLowerCase()]);
    for (let i = 0; i < 30 && distractors.length < 3; i++) {
      const cand = otherSource[Math.floor(Math.random() * otherSource.length)];
      if (!cand || cand.id === currentItem.id) continue;
      const text = cand.definition || cand.meaning;
      if (text && !used.has(text.toLowerCase())) {
        used.add(text.toLowerCase());
        distractors.push(text);
      }
    }
    options = [{ text: correctDef, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))]
      .sort(() => 0.5 - Math.random());
  }

  const grid = document.getElementById('exam-options-grid');
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'animate-fade-in tactile-btn app-surface text-left p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 text-xs font-medium flex items-start gap-2.5';
    btn.innerHTML = `<span class="code-font font-bold text-sky-400">${letters[idx]}.</span><span>${opt.text}</span>`;
    btn.onclick = () => {
      clearInterval(examTimerInterval);
      grid.querySelectorAll('button').forEach(b => b.disabled = true);
      if (opt.correct) {
        btn.classList.add('border-emerald-500', 'bg-emerald-500/15', 'pop-success');
        addSuccessScore(150);
        showToast('Correct answer!', '✓');
        advanceOrFinishRound(nextExamQuizRound, 750);
      } else {
        btn.classList.add('border-rose-500', 'bg-rose-500/15', 'shake-anim');
        grid.querySelectorAll('button').forEach((b, i) => {
          if (options[i] && options[i].correct) b.classList.add('border-emerald-500', 'bg-emerald-500/15');
        });
        handleMistake(currentItem);
        showToast('Incorrect option.', '✕');
        advanceOrFinishRound(nextExamQuizRound, 1200);
      }
    };
    grid.appendChild(btn);
  });

  examTimeLeft = 15;
  const timerEl = document.getElementById('exam-timer-text');
  if (timerEl) timerEl.textContent = `${examTimeLeft}s`;
  examTimerInterval = setInterval(() => {
    examTimeLeft--;
    if (timerEl) timerEl.textContent = `${Math.max(0, examTimeLeft)}s`;
    if (examTimeLeft <= 0) {
      clearInterval(examTimerInterval);
      handleMistake(currentItem);
      showToast('Time expired!', '⏰');
      advanceOrFinishRound(nextExamQuizRound, 900);
    }
  }, 1000);
}
