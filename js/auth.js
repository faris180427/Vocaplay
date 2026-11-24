/* ==============================================================
   VOCAPLAY — ACCOUNT AUTHENTICATION & PROFILE EDIT
   ============================================================== */

function loadSessionUser() {
  const sessionUsername = localStorage.getItem(STORAGE_SESSION_KEY);
  const accounts = loadAllAccounts();
  let loaded = null;

  if (sessionUsername && sessionUsername !== 'guest' && accounts[sessionUsername.toLowerCase()]) {
    loaded = accounts[sessionUsername.toLowerCase()];
  } else if (sessionUsername === 'guest') {
    try {
      loaded = JSON.parse(localStorage.getItem(STORAGE_GUEST_KEY) || 'null');
    } catch { loaded = null; }
  }

  const firstVisit = !sessionUsername;
  if (!loaded) {
    loaded = createFreshProfile({ username: 'guest', name: 'Guest Player', avatar: '👤', isGuest: true });
  }
  applyUserToApp(loaded);

  if (firstVisit) {
    setTimeout(() => openAuthModal('login'), 250);
  }
}

function applyUserToApp(userObj) {
  normalizeDailyMission(userObj);
  currentUser = userObj;
  VOCAB_DATA = [...(userObj.customWords || []), ...getCombinedBaseVocab()];
  currentCEFR = userObj.cefr || 'A1';
  activeDeckId = userObj.deckId || 'ox_a1';
  wordQueues = {};
  setActiveDeck(activeDeckId, true);
  refreshAllUI();
}

function renderAvatarPicker(containerId, hiddenInputId, selectedEmoji) {
  const box = document.getElementById(containerId);
  const hidden = document.getElementById(hiddenInputId);
  if (!box || !hidden) return;
  hidden.value = selectedEmoji;
  box.innerHTML = '';
  AVATAR_CHOICES.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const active = emoji === selectedEmoji;
    btn.className = `w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition ${active ? 'bg-indigo-100 border-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`;
    btn.textContent = emoji;
    btn.onclick = () => {
      playSfx('click');
      renderAvatarPicker(containerId, hiddenInputId, emoji);
    };
    box.appendChild(btn);
  });
}

function openAuthModal(defaultTab = 'login') {
  playSfx('click');
  switchAuthTab(defaultTab);
  renderAvatarPicker('reg-avatar-picker', 'reg-avatar-value', '🎓');
  renderSavedAccountsList();
  document.getElementById('login-error-msg').classList.add('hidden');
  document.getElementById('register-error-msg').classList.add('hidden');
  document.getElementById('modal-auth').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('modal-auth').classList.add('hidden');
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-register');
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    tabLogin.className = 'flex-1 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-xs transition';
    tabReg.className = 'flex-1 py-2 rounded-xl text-slate-400 font-semibold text-xs transition';
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    tabReg.className = 'flex-1 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-xs transition';
    tabLogin.className = 'flex-1 py-2 rounded-xl text-slate-400 font-semibold text-xs transition';
  }
}

function renderSavedAccountsList() {
  const accounts = Object.values(loadAllAccounts());
  const section = document.getElementById('saved-accounts-section');
  const list = document.getElementById('saved-accounts-list');
  if (!accounts.length) {
    section.classList.add('hidden');
    return;
  }
  section.classList.remove('hidden');
  list.innerHTML = '';
  accounts.forEach(acc => {
    const isCurrent = currentUser && !currentUser.isGuest && currentUser.username.toLowerCase() === acc.username.toLowerCase();
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `w-full flex items-center justify-between p-2 rounded-xl border text-left transition ${isCurrent ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`;
    row.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-lg">${acc.avatar || '🎓'}</span>
        <div>
          <div class="text-xs font-bold text-slate-900">${acc.name} ${isCurrent ? '<span class="text-[10px] text-indigo-600">(Aktif)</span>' : ''}</div>
          <div class="text-[10px] text-slate-500 font-mono">@${acc.username} • ${acc.xp} XP</div>
        </div>
      </div>
      <span class="text-[10px] font-bold text-indigo-600">Pilih →</span>
    `;
    row.onclick = () => {
      playSfx('click');
      if (isCurrent) {
        closeAuthModal();
        return;
      }
      // Require password verification when switching accounts
      switchAuthTab('login');
      const userInp = document.getElementById('login-username');
      const passInp = document.getElementById('login-password');
      if (userInp) userInp.value = acc.username;
      if (passInp) {
        passInp.value = '';
        passInp.focus();
      }
      showToast(`Masukkan password untuk @${acc.username}`, '🔐');
    };
    list.appendChild(row);
  });
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errBox = document.getElementById('login-error-msg');
  errBox.classList.add('hidden');

  const pwHash = await hashPasswordSecure(password, username);
  const legacyHash = simpleHash(password);

  if (typeof isCloudEnabled === 'function' && isCloudEnabled()) {
    try {
      let res = await cloudLoginAccount(username, pwHash);
      let activeHash = pwHash;
      // Fallback check for legacy FNV-1a accounts on Supabase
      if ((!res || !res.ok) && legacyHash !== pwHash) {
        const legacyRes = await cloudLoginAccount(username, legacyHash);
        if (legacyRes && legacyRes.ok && legacyRes.user) {
          res = legacyRes;
          activeHash = legacyHash;
        }
      }

      if (res && res.ok && res.user) {
        const cloudAcc = { ...res.user, passwordHash: activeHash, isGuest: false };
        const accounts = loadAllAccounts();
        accounts[username] = cloudAcc;
        saveAllAccounts(accounts);
        localStorage.setItem(STORAGE_SESSION_KEY, username);
        applyUserToApp(cloudAcc);
        closeAuthModal();
        playSfx('correct');
        showToast(`Cloud Login berhasil! Halo, ${cloudAcc.name}`, cloudAcc.avatar || '☁️');
        return;
      } else if (res && res.error) {
        errBox.textContent = res.error;
        errBox.classList.remove('hidden');
        playSfx('wrong');
        return;
      }
    } catch (err) {
      console.warn('Cloud login fallback to local:', err);
    }
  }

  const accounts = loadAllAccounts();
  const acc = accounts[username];

  if (!acc || (acc.passwordHash !== pwHash && acc.passwordHash !== legacyHash)) {
    errBox.textContent = 'Username atau password tidak cocok.';
    errBox.classList.remove('hidden');
    playSfx('wrong');
    return;
  }

  // Auto-upgrade legacy local hash to salted SHA-256
  if (acc.passwordHash === legacyHash) {
    acc.passwordHash = pwHash;
    accounts[username] = acc;
    saveAllAccounts(accounts);
  }

  localStorage.setItem(STORAGE_SESSION_KEY, username);
  applyUserToApp(acc);
  closeAuthModal();
  playSfx('correct');
  showToast(`Login berhasil! Halo, ${acc.name}`, acc.avatar || '🎉');
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const usernameRaw = document.getElementById('reg-username').value.trim();
  const username = usernameRaw.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const password = document.getElementById('reg-password').value;
  const avatar = document.getElementById('reg-avatar-value').value || '🎓';
  const errBox = document.getElementById('register-error-msg');
  errBox.classList.add('hidden');

  if (username.length < 3) {
    errBox.textContent = 'Username minimal 3 karakter (huruf/angka/underscore).';
    errBox.classList.remove('hidden');
    return;
  }
  if (password.length < 6) {
    errBox.textContent = 'Password minimal 6 karakter agar akun lebih aman.';
    errBox.classList.remove('hidden');
    return;
  }

  const pwHash = await hashPasswordSecure(password, username);
  const newUser = createFreshProfile({
    username,
    name,
    passwordHash: pwHash,
    avatar,
    isGuest: false
  });
  newUser.cefr = currentCEFR;
  newUser.deckId = activeDeckId;

  if (typeof isCloudEnabled === 'function' && isCloudEnabled()) {
    try {
      const res = await cloudRegisterAccount(username, name, pwHash, avatar, newUser.joinedDate);
      if (res && res.ok && res.user) {
        const cloudAcc = { ...newUser, ...res.user, passwordHash: pwHash, isGuest: false };
        const accounts = loadAllAccounts();
        accounts[username] = cloudAcc;
        saveAllAccounts(accounts);
        localStorage.setItem(STORAGE_SESSION_KEY, username);
        applyUserToApp(cloudAcc);
        closeAuthModal();
        playSfx('fanfare');
        showToast(`Akun Cloud @${username} berhasil dibuat!`, '☁️');
        return;
      } else if (res && res.error) {
        errBox.textContent = res.error;
        errBox.classList.remove('hidden');
        return;
      }
    } catch (err) {
      console.warn('Cloud register fallback to local:', err);
    }
  }

  const accounts = loadAllAccounts();
  if (accounts[username]) {
    errBox.textContent = 'Username sudah terdaftar. Silakan gunakan tab Masuk.';
    errBox.classList.remove('hidden');
    return;
  }

  accounts[username] = newUser;
  saveAllAccounts(accounts);
  localStorage.setItem(STORAGE_SESSION_KEY, username);
  applyUserToApp(newUser);
  closeAuthModal();
  playSfx('fanfare');
  showToast(`Akun @${username} berhasil dibuat!`, avatar);
}

function continueAsGuest() {
  playSfx('click');
  localStorage.setItem(STORAGE_SESSION_KEY, 'guest');
  if (!currentUser || !currentUser.isGuest) {
    let guestData = null;
    try { guestData = JSON.parse(localStorage.getItem(STORAGE_GUEST_KEY) || 'null'); } catch {}
    if (!guestData) guestData = createFreshProfile({ username: 'guest', name: 'Guest Player', avatar: '👤', isGuest: true });
    applyUserToApp(guestData);
  }
  closeAuthModal();
  showToast('Bermain sebagai Tamu (tersimpan lokal)', '👤');
}

function logoutAccount() {
  playSfx('click');
  saveCurrentAccountState();
  localStorage.setItem(STORAGE_SESSION_KEY, 'guest');
  const guestData = createFreshProfile({ username: 'guest', name: 'Guest Player', avatar: '👤', isGuest: true });
  applyUserToApp(guestData);
  showToast('Berhasil keluar dari akun.', '🚪');
  openAuthModal('login');
}

function openEditProfileModal() {
  if (!currentUser) return;
  if (currentUser.isGuest) {
    showToast('Daftar/login akun dulu untuk mengedit profil permanen!', '🔐');
    openAuthModal('register');
    return;
  }
  playSfx('click');
  document.getElementById('edit-prof-name').value = currentUser.name;
  document.getElementById('edit-prof-bio').value = currentUser.bio || '';
  renderAvatarPicker('edit-avatar-picker', 'edit-avatar-value', currentUser.avatar || '🎓');
  document.getElementById('modal-edit-profile').classList.remove('hidden');
}

function closeEditProfileModal() {
  document.getElementById('modal-edit-profile').classList.add('hidden');
}

function handleSaveProfileEdit(e) {
  e.preventDefault();
  if (!currentUser || currentUser.isGuest) return;
  currentUser.name = document.getElementById('edit-prof-name').value.trim() || currentUser.name;
  currentUser.bio = document.getElementById('edit-prof-bio').value.trim();
  currentUser.avatar = document.getElementById('edit-avatar-value').value || currentUser.avatar;
  saveCurrentAccountState();
  refreshAllUI();
  closeEditProfileModal();
  playSfx('correct');
  showToast('Profil berhasil diperbarui!', '✓');
}
