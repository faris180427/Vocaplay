/* ==============================================================
   VOCAPLAY — SOUND EFFECTS & NATURAL SPEECH SYNTHESIS
   ============================================================== */

let audioCtx = null;
let sfxEnabled = localStorage.getItem('vocaplay_sfx') !== 'off';
let speechRatePref = parseFloat(localStorage.getItem('vocaplay_speech_rate') || '0.92');
let speechAccentPref = localStorage.getItem('vocaplay_speech_accent') || 'en-US';
let preferredEnglishVoice = null;

function pickBestEnglishVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return null;
  const isUK = speechAccentPref === 'en-GB';
  if (isUK) {
    return (
      voices.find(v => /Google UK English/i.test(v.name)) ||
      voices.find(v => /Microsoft.*(Libby|Sonia|Ryan|Natural).*en-GB/i.test(v.name)) ||
      voices.find(v => v.lang === 'en-GB') ||
      voices.find(v => v.lang && v.lang.startsWith('en')) ||
      null
    );
  }
  return (
    voices.find(v => /Google US English/i.test(v.name)) ||
    voices.find(v => /Microsoft.*Natural.*English/i.test(v.name)) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    null
  );
}

function updateSpeechControlsUI() {
  const speedBtn = document.getElementById('btn-speech-speed');
  const accentBtn = document.getElementById('btn-speech-accent');
  if (speedBtn) speedBtn.textContent = speechRatePref < 0.85 ? '0.75x' : '1.0x';
  if (accentBtn) accentBtn.textContent = speechAccentPref === 'en-GB' ? 'UK' : 'US';
}

function toggleSpeechRate() {
  playSfx('click');
  speechRatePref = speechRatePref < 0.85 ? 0.92 : 0.72;
  localStorage.setItem('vocaplay_speech_rate', String(speechRatePref));
  updateSpeechControlsUI();
  showToast(speechRatePref < 0.85 ? 'Kecepatan suara: Lambat (0.75x)' : 'Kecepatan suara: Normal (1.0x)', '✓');
  if (currentItem) speakText(currentItem.word);
}

function toggleSpeechAccent() {
  playSfx('click');
  speechAccentPref = speechAccentPref === 'en-GB' ? 'en-US' : 'en-GB';
  localStorage.setItem('vocaplay_speech_accent', speechAccentPref);
  preferredEnglishVoice = pickBestEnglishVoice();
  updateSpeechControlsUI();
  showToast(`Aksen suara: ${speechAccentPref === 'en-GB' ? 'British (UK)' : 'American (US)'}`, '✓');
  if (currentItem) speakText(currentItem.word);
}

if ('speechSynthesis' in window && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredEnglishVoice = pickBestEnglishVoice();
  };
}

function updateSfxToggleUI() {
  const btn = document.getElementById('btn-sfx-toggle');
  if (btn) btn.innerHTML = getAppIconSvg(sfxEnabled ? 'volume' : 'volumeX', 'w-4 h-4');
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  localStorage.setItem('vocaplay_sfx', sfxEnabled ? 'on' : 'off');
  updateSfxToggleUI();
  if (sfxEnabled) playSfx('click');
  showToast(sfxEnabled ? 'Efek suara aktif' : 'Efek suara dimatikan', '✓');
}

function getAudioContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playSfx(type) {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (type === 'click') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);
      gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 0.03);
    } else if (type === 'correct') {
      [698.46, 880.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06); gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.22);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
      gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'fanfare') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08); gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.35);
      });
    }
  } catch {}
}

function speakText(text, rate = null) {
  if ('speechSynthesis' in window && text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (!preferredEnglishVoice) preferredEnglishVoice = pickBestEnglishVoice();
    if (preferredEnglishVoice) u.voice = preferredEnglishVoice;
    u.lang = speechAccentPref || 'en-US';
    u.rate = rate !== null ? rate : speechRatePref;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }
}

function replayTargetAudio() {
  if (currentItem) speakText(currentItem.word);
}
