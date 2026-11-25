// Smoke test: setiap game bisa dibuka, setiap tab bisa dikunjungi, tanpa error JavaScript.
const { test, expect } = require('@playwright/test');

const GAME_MODES = [
  'fast-vocab',
  'sentence-builder',
  'listening-dictation',
  'voice-duel',
  'word-shooter',
  'vocab-wordle',
  'word-connections',
  'boss-battle',
  'dialogue-quest'
];

const TABS = ['learn', 'path', 'decks', 'quests', 'leaderboard', 'profile'];

async function openApp(page, errors) {
  page.on('pageerror', (e) => errors.push(e.message));
  // Uji mode offline: API Laravel tidak tersedia, aplikasi harus tetap jalan lewat fallback lokal.
  await page.route('**/api/**', (route) => route.abort());
  await page.goto('/index.html');
  await page.waitForFunction(() => typeof startGame === 'function' && typeof currentUser !== 'undefined' && currentUser);
}

for (const mode of GAME_MODES) {
  test(`game "${mode}" bisa dimulai tanpa error`, async ({ page }) => {
    const errors = [];
    await openApp(page, errors);

    await page.evaluate((m) => startGame(m), mode);
    await expect(page.locator('#screen-gameplay')).toBeVisible();
    await page.waitForTimeout(900);

    expect(errors, `Error JS pada game ${mode}`).toEqual([]);

    await page.evaluate(() => exitToHome());
    await expect(page.locator('#tab-learn')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('semua tab navigasi bisa dibuka tanpa error', async ({ page }) => {
  const errors = [];
  await openApp(page, errors);

  for (const tab of TABS) {
    await page.evaluate((t) => switchAppTab(t), tab);
    await expect(page.locator(`#tab-${tab}`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('toggle tema gelap/terang bekerja', async ({ page }) => {
  const errors = [];
  await openApp(page, errors);

  const before = await page.evaluate(() => document.body.classList.contains('theme-dark'));
  await page.evaluate(() => toggleAppTheme());
  const after = await page.evaluate(() => document.body.classList.contains('theme-dark'));
  expect(after).toBe(!before);
  expect(errors).toEqual([]);
});

test('modal Edit Profil tidak error untuk tamu dan menampilkan panel avatar untuk akun', async ({ page }) => {
  const errors = [];
  await openApp(page, errors);

  // Akun terdaftar tiruan (lokal) agar modal terbuka.
  await page.evaluate(() => {
    currentUser.isGuest = false;
    currentUser.username = 'tester';
    openEditProfileModal();
  });
  await expect(page.locator('#modal-edit-profile')).toBeVisible();

  await page.evaluate(() => switchEditAvatarTab('emoji'));
  await expect(page.locator('#edit-avpanel-emoji')).toBeVisible();
  await page.locator('#edit-avatar-emoji-grid button').first().click();
  const val = await page.inputValue('#edit-avatar-value');
  expect(val.startsWith('emoji:')).toBe(true);
  expect(errors).toEqual([]);
});

test('nama berbahaya tidak dieksekusi sebagai HTML di daftar akun', async ({ page }) => {
  const errors = [];
  let dialogs = 0;
  page.on('dialog', async (d) => { dialogs++; await d.dismiss(); });
  await openApp(page, errors);

  await page.evaluate(() => {
    const accounts = {
      evil: { username: 'evil', name: '<img src=x onerror=alert(1)>', avatar: 'av-sky', xp: 5 }
    };
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    openAuthModal('login');
  });
  await page.waitForTimeout(400);
  expect(dialogs).toBe(0);
  expect(await page.locator('#saved-accounts-list img[src="x"]').count()).toBe(0);
  expect(errors).toEqual([]);
});
