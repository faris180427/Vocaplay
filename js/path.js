/* ==============================================================
   VOCAPLAY — LEARNING PATH (UNIT MAP), MIXED LESSON & MISTAKE RE-QUEUE
   ============================================================== */

const LEARNING_UNITS = [
  {
    id: 'u1',
    title: 'Unit 1: Perkenalan & Kata Inti',
    subtitle: 'Salam dasar, kata ganti, benda sekitar, dan fondasi A1',
    cefr: 'A1',
    color: 'from-sky-500 to-blue-600',
    nodes: [
      { id: 'u1_n1', title: 'Kata Inti Harian', desc: 'Kosakata paling sering dipakai (A1)' },
      { id: 'u1_n2', title: 'Benda & Objek Sekitar', desc: 'Mengenali objek umum harian', kw: /book|table|chair|door|window|phone|pen|bag|key|clock|light|house|room/i },
      { id: 'u1_n3', title: 'Orang & Keluarga', desc: 'Sebutan orang dan relasi dasar', kw: /family|mother|father|friend|child|man|woman|people|name|baby|brother|sister/i },
      { id: 'u1_n4', title: 'Evaluasi Unit 1', desc: 'Uji campuran seluruh materi Unit 1' }
    ]
  },
  {
    id: 'u2',
    title: 'Unit 2: Makanan, Hewan & Alam',
    subtitle: 'Kuliner sehari-hari, fauna, cuaca, dan lingkungan dasar',
    cefr: 'A1',
    color: 'from-cyan-500 to-sky-600',
    nodes: [
      { id: 'u2_n1', title: 'Makanan & Minuman', desc: 'Buah, hidangan, dan minuman harian', kw: /food|apple|water|bread|coffee|tea|milk|fruit|eat|drink|cook|meal|rice|fish/i },
      { id: 'u2_n2', title: 'Hewan & Habitat', desc: 'Nama hewan dan sifatnya', kw: /animal|dog|cat|bird|fish|elephant|horse|lion|tiger|bear|pet|wild/i },
      { id: 'u2_n3', title: 'Cuaca & Alam Sekitar', desc: 'Matahari, hujan, sungai, dan gunung', kw: /sun|rain|water|tree|sky|wind|cold|hot|weather|river|sea|flower|garden/i },
      { id: 'u2_n4', title: 'Evaluasi Unit 2', desc: 'Uji campuran seluruh materi Unit 2' }
    ]
  },
  {
    id: 'u3',
    title: 'Unit 3: Rutinitas & Kehidupan Harian',
    subtitle: 'Aktivitas pagi sampai malam, jadwal, dan hobi',
    cefr: 'A2',
    color: 'from-emerald-500 to-teal-600',
    nodes: [
      { id: 'u3_n1', title: 'Aktivitas Pagi & Malam', desc: 'Kata kerja rutinitas sehari-hari', kw: /wake|sleep|work|study|walk|run|read|write|clean|wash|morning|night/i },
      { id: 'u3_n2', title: 'Waktu & Jadwal', desc: 'Hari, jam, dan frekuensi kegiatan', kw: /time|hour|minute|day|week|month|year|early|late|always|often|never|today/i },
      { id: 'u3_n3', title: 'Hobi & Hiburan', desc: 'Musik, olahraga, film, dan rekreasi', kw: /music|sport|game|movie|film|play|sing|dance|paint|guitar|read|watch|fun/i },
      { id: 'u3_n4', title: 'Evaluasi Unit 3', desc: 'Uji campuran seluruh materi Unit 3' }
    ]
  },
  {
    id: 'u4',
    title: 'Unit 4: Perjalanan & Kota',
    subtitle: 'Transportasi, arah jalan, bandara, hotel, dan belanja',
    cefr: 'A2',
    color: 'from-teal-500 to-emerald-600',
    nodes: [
      { id: 'u4_n1', title: 'Transportasi & Arah', desc: 'Kendaraan dan petunjuk lokasi', kw: /car|bus|train|plane|road|street|map|left|right|near|far|station|drive/i },
      { id: 'u4_n2', title: 'Bandara & Hotel', desc: 'Tiket, paspor, dan akomodasi', kw: /flight|airport|hotel|room|ticket|trip|travel|passport|baggage|visit|stay/i },
      { id: 'u4_n3', title: 'Belanja & Transaksi', desc: 'Harga, toko, pembayaran, dan diskon', kw: /shop|store|buy|sell|pay|price|cost|money|cheap|expensive|market|card/i },
      { id: 'u4_n4', title: 'Evaluasi Unit 4', desc: 'Uji campuran seluruh materi Unit 4' }
    ]
  },
  {
    id: 'u5',
    title: 'Unit 5: Percakapan & Ekspresi Sosial',
    subtitle: 'Menyampaikan opini, emosi, budaya, dan pengalaman',
    cefr: 'B1',
    color: 'from-indigo-500 to-blue-600',
    nodes: [
      { id: 'u5_n1', title: 'Opini & Persetujuan', desc: 'Menyatakan pendapat secara natural', kw: /think|believe|agree|opinion|reason|idea|suggest|prefer|mind|explain|view/i },
      { id: 'u5_n2', title: 'Emosi & Karakter', desc: 'Kata sifat perasaan dan kepribadian', kw: /happy|sad|angry|excited|worried|proud|honest|brave|kind|calm|nervous|feel/i },
      { id: 'u5_n3', title: 'Pengalaman & Cerita', desc: 'Menceritakan kejadian dan kenangan', kw: /story|memory|experience|event|happen|remember|forget|surprise|journey|past/i },
      { id: 'u5_n4', title: 'Evaluasi Unit 5', desc: 'Uji campuran seluruh materi Unit 5' }
    ]
  },
  {
    id: 'u6',
    title: 'Unit 6: Dunia Kerja & Karir',
    subtitle: 'Rapat kantor, wawancara kerja, proyek, dan kolaborasi',
    cefr: 'B1',
    color: 'from-violet-500 to-indigo-600',
    nodes: [
      { id: 'u6_n1', title: 'Kantor & Rapat', desc: 'Kosakata rapat dan lingkungan kerja', kw: /office|meeting|staff|team|manager|schedule|report|email|colleague|desk|task/i },
      { id: 'u6_n2', title: 'Wawancara & Skill', desc: 'Menjelaskan keahlian dan pengalaman', kw: /job|career|interview|skill|resume|apply|hire|salary|company|experience|goal/i },
      { id: 'u6_n3', title: 'Proyek & Tenggat', desc: 'Perencanaan, target, dan solusi', kw: /project|plan|deadline|target|solve|result|progress|deliver|quality|issue/i },
      { id: 'u6_n4', title: 'Evaluasi Unit 6', desc: 'Uji campuran seluruh materi Unit 6' }
    ]
  },
  {
    id: 'u7',
    title: 'Unit 7: Teknologi, Sains & Inovasi',
    subtitle: 'Komputasi, jaringan digital, energi, dan penemuan ilmiah',
    cefr: 'B2',
    color: 'from-blue-600 to-indigo-700',
    nodes: [
      { id: 'u7_n1', title: 'Komputasi & Data', desc: 'Sistem, perangkat lunak, dan data', kw: /data|system|software|network|digital|code|device|screen|connect|update|security/i },
      { id: 'u7_n2', title: 'Sains & Energi', desc: 'Eksperimen, energi, dan fenomena alam', kw: /science|energy|research|theory|method|measure|chemical|space|earth|experiment/i },
      { id: 'u7_n3', title: 'Inovasi Masa Depan', desc: 'Otomasi, desain, dan transformasi', kw: /innovate|create|design|future|modern|machine|robot|electric|develop|advance/i },
      { id: 'u7_n4', title: 'Evaluasi Unit 7', desc: 'Uji campuran seluruh materi Unit 7' }
    ]
  },
  {
    id: 'u8',
    title: 'Unit 8: Bisnis, Ekonomi & Strategi',
    subtitle: 'Keuangan, pasar global, kontrak, dan kepemimpinan',
    cefr: 'B2',
    color: 'from-purple-600 to-violet-700',
    nodes: [
      { id: 'u8_n1', title: 'Keuangan & Anggaran', desc: 'Investasi, profit, pajak, dan biaya', kw: /finance|budget|profit|tax|invest|bank|market|economy|value|capital|fund/i },
      { id: 'u8_n2', title: 'Negosiasi & Kontrak', desc: 'Kesepakatan bisnis dan kemitraan', kw: /contract|deal|client|partner|negotiate|offer|terms|agree|trade|supply|brand/i },
      { id: 'u8_n3', title: 'Kepemimpinan & Visi', desc: 'Strategi tim dan pengambilan keputusan', kw: /lead|strategy|manage|decide|vision|growth|impact|risk|compete|organization/i },
      { id: 'u8_n4', title: 'Evaluasi Unit 8', desc: 'Uji campuran seluruh materi Unit 8' }
    ]
  },
  {
    id: 'u9',
    title: 'Unit 9: Akademik, Riset & Analisis',
    subtitle: 'Metodologi ilmiah, argumen terstruktur, dan penulisan esai',
    cefr: 'C1',
    color: 'from-amber-600 to-orange-700',
    nodes: [
      { id: 'u9_n1', title: 'Metodologi & Bukti', desc: 'Analisis data, hipotesis, dan bukti', kw: /analyze|evidence|hypothesis|concept|factor|context|criteria|source|valid/i },
      { id: 'u9_n2', title: 'Penulisan Esai Formal', desc: 'Transisi logis dan diksi akademik', kw: /furthermore|however|conclude|illustrate|emphasize|contrast|derive|interpret/i },
      { id: 'u9_n3', title: 'Evaluasi Kritis', desc: 'Menilai argumen dan implikasi', kw: /evaluate|assess|imply|perspective|significant|relevant|assume|coherent|complex/i },
      { id: 'u9_n4', title: 'Evaluasi Unit 9', desc: 'Uji campuran seluruh materi Unit 9' }
    ]
  },
  {
    id: 'u10',
    title: 'Unit 10: Penguasaan Lanjut & Retorika',
    subtitle: 'Nuansa makna, diplomasi, debat, dan kosakata tingkat C1',
    cefr: 'C1',
    color: 'from-rose-600 to-red-700',
    nodes: [
      { id: 'u10_n1', title: 'Nuansa & Presisi Kata', desc: 'Pilihan kata tajam dan akurat (C1)' },
      { id: 'u10_n2', title: 'Diplomasi & Debat', desc: 'Persuasi dan komunikasi tingkat tinggi' },
      { id: 'u10_n3', title: 'Kosakata Elit C1', desc: 'Tantangan kosakata lanjutan Oxford' },
      { id: 'u10_n4', title: 'Ujian Grand Master', desc: 'Tantangan puncak Jalur Belajar Vocaplay' }
    ]
  }
];

let activePathCefrFilter = 'ALL';

function setPathCefrFilter(cefr) {
  playSfx('click');
  activePathCefrFilter = cefr;
  renderLearningPath();
}

function getAllPathNodeIds() {
  return LEARNING_UNITS.flatMap(u => u.nodes.map(n => n.id));
}

function renderLearningPath() {
  const container = document.getElementById('learning-path-container');
  const filterBar = document.getElementById('path-cefr-filters');
  const progressText = document.getElementById('path-overall-progress');
  if (!container || !currentUser) return;
  const completed = Array.isArray(currentUser.completedNodes) ? currentUser.completedNodes : [];
  const claimedChests = Array.isArray(currentUser.claimedChests) ? currentUser.claimedChests : [];
  const allIds = getAllPathNodeIds();

  if (progressText) {
    progressText.textContent = `${completed.length} / ${allIds.length} Pelajaran`;
  }

  if (filterBar) {
    filterBar.innerHTML = '';
    ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = lvl === activePathCefrFilter
        ? 'tactile-btn px-3 py-1 rounded-xl bg-sky-500 text-white font-bold text-[11px]'
        : 'tactile-btn px-3 py-1 rounded-xl app-subsurface border border-slate-700/60 text-slate-400 hover:text-sky-400 font-semibold text-[11px]';
      btn.textContent = lvl === 'ALL' ? `Semua (${LEARNING_UNITS.length} Unit)` : `CEFR ${lvl}`;
      btn.onclick = () => setPathCefrFilter(lvl);
      filterBar.appendChild(btn);
    });
  }

  // First uncompleted node is the active unlocked frontier
  const firstUncompletedIdx = allIds.findIndex(id => !completed.includes(id));
  const activeNodeId = firstUncompletedIdx === -1 ? allIds[allIds.length - 1] : allIds[firstUncompletedIdx];

  const visibleUnits = activePathCefrFilter === 'ALL'
    ? LEARNING_UNITS
    : LEARNING_UNITS.filter(u => u.cefr === activePathCefrFilter);

  container.innerHTML = '';

  visibleUnits.forEach((unit) => {
    const uIdx = LEARNING_UNITS.findIndex(u => u.id === unit.id);
    const unitDoneCount = unit.nodes.filter(n => completed.includes(n.id)).length;
    const unitComplete = unitDoneCount === unit.nodes.length;
    const chestClaimed = claimedChests.includes(unit.id);

    const section = document.createElement('div');
    section.className = 'w-full mb-7';

    section.innerHTML = `
      <div class="w-full rounded-2xl bg-gradient-to-r ${unit.color} p-4 text-white shadow-sm mb-4 flex items-center justify-between gap-3">
        <div>
          <div class="text-[10px] font-mono uppercase tracking-wider opacity-85 font-bold">${unit.cefr} • ${unitDoneCount}/${unit.nodes.length} Pelajaran</div>
          <h3 class="text-base font-extrabold tracking-tight">${unit.title}</h3>
          <p class="text-xs opacity-90 mt-0.5">${unit.subtitle}</p>
        </div>
        <span class="code-font text-xs font-extrabold bg-black/20 px-3 py-1 rounded-xl whitespace-nowrap">${Math.round((unitDoneCount / unit.nodes.length) * 100)}%</span>
      </div>
    `;

    const nodesCol = document.createElement('div');
    nodesCol.className = 'flex flex-col items-center gap-3 relative';

    unit.nodes.forEach((node, nIdx) => {
      const isDone = completed.includes(node.id);
      const isActive = node.id === activeNodeId;
      const globalIdx = allIds.indexOf(node.id);
      const isUnlocked = isDone || isActive || (firstUncompletedIdx === -1) || globalIdx <= firstUncompletedIdx || activePathCefrFilter !== 'ALL';

      const offsetCls = nIdx % 3 === 1 ? 'sm:translate-x-8' : (nIdx % 3 === 2 ? 'sm:-translate-x-8' : '');
      const card = document.createElement('button');
      card.type = 'button';
      card.disabled = !isUnlocked;
      card.className = `tactile-btn ${offsetCls} w-full max-w-sm p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-left transition ${
        isActive
          ? 'app-surface border-sky-400 ring-2 ring-sky-400/30 shadow-md'
          : isDone
            ? 'app-surface border-emerald-500/40 hover:border-emerald-400'
            : isUnlocked
              ? 'app-surface border-slate-700/70 hover:border-sky-400/60'
              : 'app-subsurface border-slate-800 opacity-55 cursor-not-allowed'
      }`;

      const badgeHtml = isDone
        ? `<div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0">${getAppIconSvg('check', 'w-5 h-5')}</div>`
        : isActive
          ? `<div class="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">${getAppIconSvg('zap', 'w-5 h-5')}</div>`
          : `<div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">${uIdx + 1}.${nIdx + 1}</div>`;

      const actionLabel = isActive
        ? `<span class="px-2.5 py-1 rounded-lg bg-sky-500 text-white text-[10px] font-extrabold uppercase">Mulai</span>`
        : isDone
          ? `<span class="text-[10px] font-mono font-bold text-emerald-400">Ulangi</span>`
          : isUnlocked
            ? `<span class="text-[10px] font-mono font-bold text-sky-400">Buka</span>`
            : `<span class="text-[10px] font-mono text-slate-500">Terkunci</span>`;

      card.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          ${badgeHtml}
          <div class="min-w-0">
            <div class="text-xs font-extrabold truncate">${node.title}</div>
            <div class="text-[11px] text-slate-400 truncate">${node.desc}</div>
          </div>
        </div>
        ${actionLabel}
      `;
      if (isUnlocked) {
        card.onclick = () => startMixedLessonNode(unit, node);
      }
      nodesCol.appendChild(card);
    });

    // Unit Treasure Chest
    const chestBtn = document.createElement('button');
    chestBtn.type = 'button';
    chestBtn.disabled = !unitComplete || chestClaimed;
    chestBtn.className = `tactile-btn w-full max-w-sm p-3 rounded-2xl border flex items-center justify-between gap-3 text-left transition ${
      unitComplete && !chestClaimed
        ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 ring-2 ring-amber-400/20'
        : chestClaimed
          ? 'app-subsurface border-emerald-500/30 text-emerald-400 opacity-75'
          : 'app-subsurface border-slate-800 text-slate-500 opacity-55 cursor-not-allowed'
    }`;
    chestBtn.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl ${unitComplete && !chestClaimed ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'} flex items-center justify-center flex-shrink-0">
          ${getAppIconSvg('gem', 'w-4 h-4')}
        </div>
        <div>
          <div class="text-xs font-extrabold">Peti Hadiah ${unit.title.split(':')[0]}</div>
          <div class="text-[11px] opacity-80">+25 Diamonds & 2x XP Boost (10 Menit)</div>
        </div>
      </div>
      <span class="text-[10px] font-mono font-bold uppercase">${chestClaimed ? 'Diklaim' : (unitComplete ? 'Klaim!' : 'Selesaikan Unit')}</span>
    `;
    if (unitComplete && !chestClaimed) {
      chestBtn.onclick = () => claimUnitChest(unit.id);
    }
    nodesCol.appendChild(chestBtn);

    section.appendChild(nodesCol);
    container.appendChild(section);
  });
}

function claimUnitChest(unitId) {
  if (!currentUser) return;
  if (!Array.isArray(currentUser.claimedChests)) currentUser.claimedChests = [];
  if (currentUser.claimedChests.includes(unitId)) return;
  currentUser.claimedChests.push(unitId);
  currentUser.coins = (currentUser.coins || 0) + 25;
  activateXpBoost(10);
  saveCurrentAccountState();
  playSfx('fanfare');
  triggerConfetti();
  showToast('Peti dibuka! +25 Diamonds & 2x XP Boost (10 Menit)!', '✓');
  renderLearningPath();
  refreshAllUI();
}

/* ==============================================================
   MIXED LESSON RUNNER (MULTI-TYPE + MISTAKE RE-QUEUE)
   ============================================================== */
let mixedLessonNode = null;
let mixedLessonUnit = null;
let mixedQueue = [];
let mixedMistakeQueue = [];
let mixedTotalInitial = 6;
let mixedDoneCount = 0;
let mixedInReviewPhase = false;
let mixedCurrentTask = null;

function startMixedLessonNode(unit, node) {
  mixedLessonUnit = unit;
  mixedLessonNode = node;
  mixedMistakeQueue = [];
  mixedInReviewPhase = false;
  mixedDoneCount = 0;

  // Build 6 mixed tasks from this unit's CEFR pool (prioritize node thematic keywords if set)
  const cefrPool = VOCAB_DATA.filter(v => v.cefr === unit.cefr);
  const kwPool = node.kw
    ? cefrPool.filter(v => node.kw.test(v.word || '') || node.kw.test(v.definition || '') || node.kw.test(v.category || ''))
    : [];
  const src = kwPool.length >= 6 ? kwPool : (cefrPool.length >= 6 ? cefrPool : VOCAB_DATA);
  const picked = src.slice().sort(() => 0.5 - Math.random()).slice(0, 6);
  const taskTypes = ['listen-choice', 'meaning-choice', 'type-word', 'listen-choice', 'type-word', 'meaning-choice'];

  mixedQueue = picked.map((item, idx) => ({
    type: taskTypes[idx % taskTypes.length],
    item
  }));
  mixedTotalInitial = mixedQueue.length;

  startGame('mixed-lesson');
}

function initMixedLessonUI() {
  if (!mixedQueue.length && !mixedMistakeQueue.length) {
    // Fallback if launched directly
    const defaultUnit = LEARNING_UNITS[0];
    startMixedLessonNode(defaultUnit, defaultUnit.nodes[0]);
    return;
  }
  if (mixedLessonNode) {
    document.getElementById('gameplay-mode-badge').textContent = mixedLessonNode.title;
  }
  if (mixedLessonUnit) {
    document.getElementById('gameplay-level-badge').textContent = mixedLessonUnit.cefr;
  }
  nextMixedLessonTask();
}

function nextMixedLessonTask() {
  const reviewBanner = document.getElementById('mixed-review-phase-pill');
  if (mixedQueue.length === 0) {
    if (mixedMistakeQueue.length > 0) {
      mixedInReviewPhase = true;
      mixedQueue = mixedMistakeQueue.slice();
      mixedMistakeQueue = [];
      if (reviewBanner) reviewBanner.classList.remove('hidden');
      showToast('Fase Perbaikan: Ulangi soal yang sempat salah!', '!');
    } else {
      // Completed node!
      if (currentUser && mixedLessonNode) {
        if (!Array.isArray(currentUser.completedNodes)) currentUser.completedNodes = [];
        if (!currentUser.completedNodes.includes(mixedLessonNode.id)) {
          currentUser.completedNodes.push(mixedLessonNode.id);
          saveCurrentAccountState();
        }
      }
      endGameSession();
      return;
    }
  } else if (!mixedInReviewPhase && reviewBanner) {
    reviewBanner.classList.add('hidden');
  }

  mixedCurrentTask = mixedQueue.shift();
  currentItem = mixedCurrentTask.item;
  const shown = Math.min(mixedDoneCount + 1, mixedTotalInitial);
  document.getElementById('gameplay-round-badge').textContent = mixedInReviewPhase
    ? `Perbaikan (${mixedQueue.length + 1})`
    : `${shown} / ${mixedTotalInitial}`;
  document.getElementById('gameplay-progress-bar').style.width = `${Math.min(100, Math.round((mixedDoneCount / mixedTotalInitial) * 100))}%`;

  renderMixedTask(mixedCurrentTask);
}

function renderMixedTask(task) {
  const promptEl = document.getElementById('mixed-task-prompt');
  const bodyEl = document.getElementById('mixed-task-body');
  if (!promptEl || !bodyEl) return;

  const item = task.item;
  bodyEl.innerHTML = '';

  if (task.type === 'listen-choice' || task.type === 'meaning-choice') {
    const isListen = task.type === 'listen-choice';
    promptEl.innerHTML = isListen
      ? `<div class="flex flex-col items-center">
           <span class="text-[10px] font-mono uppercase text-sky-400 font-bold mb-2">Dengar & Pilih Arti</span>
           <button type="button" onclick="speakText('${item.word.replace(/'/g, "\\'")}')" class="tactile-btn w-14 h-14 rounded-2xl bg-sky-500/15 border-2 border-sky-500 text-sky-400 flex items-center justify-center pulse-audio mb-2">${getAppIconSvg('volume', 'w-6 h-6')}</button>
           <span class="text-xs text-slate-400">Ketuk untuk mendengarkan ulang</span>
         </div>`
      : `<div class="flex flex-col items-center">
           <span class="text-[10px] font-mono uppercase text-indigo-400 font-bold mb-1">Pilih Arti Tepat</span>
           <h4 class="editorial-serif text-3xl font-medium">${item.word}</h4>
           <span class="code-font text-xs text-sky-400 mt-1">${item.phonetic || ''}</span>
         </div>`;

    speakText(item.word);
    const distractors = VOCAB_DATA
      .filter(v => v.id !== item.id && v.meaning !== item.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const choices = [item, ...distractors].sort(() => 0.5 - Math.random());

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full';
    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tactile-btn app-surface border border-slate-700/60 hover:border-sky-400 rounded-xl p-3.5 text-left text-xs font-bold transition';
      btn.textContent = getShortMeaning(ch, 44);
      btn.onclick = () => {
        grid.querySelectorAll('button').forEach(b => b.disabled = true);
        if (ch.id === item.id) {
          btn.classList.add('border-emerald-400', 'bg-emerald-500/15', 'text-emerald-300');
          mixedDoneCount++;
          addSuccessScore(120);
          setTimeout(nextMixedLessonTask, 650);
        } else {
          btn.classList.add('border-rose-400', 'bg-rose-500/15', 'text-rose-300');
          mixedMistakeQueue.push(task);
          handleMistake(item);
          if (lives > 0) setTimeout(nextMixedLessonTask, 1200);
        }
      };
      grid.appendChild(btn);
    });
    bodyEl.appendChild(grid);
  } else {
    // type-word
    promptEl.innerHTML = `
      <div class="flex flex-col items-center">
        <span class="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1">Ketik Bahasa Inggrisnya</span>
        <div class="text-lg font-extrabold mt-1">${getShortMeaning(item, 48)}</div>
        <button type="button" onclick="speakText('${item.word.replace(/'/g, "\\'")}')" class="mt-2 px-3 py-1 rounded-lg app-subsurface border border-slate-700/60 text-sky-400 text-[11px] font-bold inline-flex items-center gap-1.5">${getAppIconSvg('volume', 'w-3.5 h-3.5')} <span>Dengar Petunjuk</span></button>
      </div>
    `;
    speakText(item.word);
    bodyEl.innerHTML = `
      <form onsubmit="submitMixedTypeAnswer(event)" class="w-full max-w-md mx-auto flex gap-2">
        <input type="text" id="mixed-type-input" placeholder="Ketik kata bahasa Inggris..." class="app-input flex-grow px-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none code-font font-bold text-center text-sm" autocomplete="off" autocorrect="off" spellcheck="false">
        <button type="submit" class="tactile-btn px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs">Periksa</button>
      </form>
    `;
    setTimeout(() => document.getElementById('mixed-type-input')?.focus(), 50);
  }
}

function submitMixedTypeAnswer(e) {
  e.preventDefault();
  if (!mixedCurrentTask) return;
  const inp = document.getElementById('mixed-type-input');
  if (!inp) return;
  const val = inp.value.trim().toLowerCase();
  if (!val) return;
  inp.disabled = true;
  const item = mixedCurrentTask.item;
  if (val === item.word.toLowerCase()) {
    mixedDoneCount++;
    addSuccessScore(140);
    setTimeout(nextMixedLessonTask, 600);
  } else {
    mixedMistakeQueue.push(mixedCurrentTask);
    handleMistake(item);
    if (lives > 0) setTimeout(nextMixedLessonTask, 1300);
  }
}
