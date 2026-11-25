// Unit test logika murni di js/state.js (tanpa browser) memakai test runner bawaan Node.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = fs.readFileSync(path.join(root, 'js', 'state.js'), 'utf8');

const ctx = vm.createContext({
  getCombinedBaseVocab: () => [],
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  window: {},
  console
});
vm.runInContext(source, ctx);

test('escapeHtml menetralkan karakter HTML berbahaya', () => {
  assert.equal(ctx.escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(ctx.escapeHtml(`a & b 'c'`), 'a &amp; b &#39;c&#39;');
  assert.equal(ctx.escapeHtml(null), '');
  assert.equal(ctx.escapeHtml(undefined), '');
});

test('getAvatarMarkup: inisial dari nama berbahaya tidak menyisipkan tag', () => {
  const html = ctx.getAvatarMarkup('av-sky', '<script>alert(1)</script>', 'w-8 h-8');
  assert.ok(!html.includes('<script'), html);
  assert.ok(!html.includes('<img'), html);
});

test('getAvatarMarkup: emoticon di-escape', () => {
  const html = ctx.getAvatarMarkup('emoji:<b>x', 'Budi', 'w-8 h-8');
  assert.ok(!html.includes('<b>'), html);
  const ok = ctx.getAvatarMarkup('emoji:🦊', 'Budi', 'w-8 h-8');
  assert.ok(ok.includes('🦊'));
});

test('getAvatarMarkup: data URL dan path gambar jatuh ke avatar palet aman', () => {
  const html1 = ctx.getAvatarMarkup('data:image/png;base64,AAA" onerror="alert(1)', 'Budi', 'w-8 h-8');
  assert.ok(!html1.includes('<img'), html1);
  const html2 = ctx.getAvatarMarkup('/api/avatars/3?v=123', 'Budi', 'w-8 h-8');
  assert.ok(!html2.includes('<img'), html2);
});

test('getAvatarMarkup: skema javascript: ditolak dan jatuh ke avatar palet', () => {
  const html = ctx.getAvatarMarkup('javascript:alert(1)', 'Budi', 'w-8 h-8');
  assert.ok(!html.includes('javascript:'), html);
  assert.ok(!html.includes('<img'), html);
});

test('getAvatarMarkup: kunci palet valid memakai gradien palet', () => {
  const html = ctx.getAvatarMarkup('av-indigo', 'Budi Santoso', 'w-8 h-8');
  assert.ok(html.includes('from-indigo-500'));
  assert.ok(html.includes('>BS<'));
});

test('createFreshProfile membuat profil awal yang valid', () => {
  const p = ctx.createFreshProfile({ username: 'budi', name: 'Budi' });
  assert.equal(p.xp, 0);
  assert.equal(p.streak, 0);
  assert.equal(p.isGuest, false);
  assert.equal(p.dailyMission.claimed.length, 0);
  assert.equal(p.weekDaysActive.length, 7);
});

test('normalizeDailyMission memperbaiki data profil yang rusak', () => {
  const u = { dailyMission: { date: '2000-01-01', claimed: ['x'] }, weekDaysActive: [true], masteredWords: null };
  ctx.normalizeDailyMission(u);
  assert.equal(u.dailyMission.claimed.length, 0);
  assert.equal(u.weekDaysActive.length, 7);
  assert.ok(Array.isArray(u.masteredWords));
  assert.ok(Array.isArray(u.weakWords));
});

test('getShortMeaning memotong teks panjang dengan elipsis', () => {
  const long = 'kata '.repeat(40);
  const out = ctx.getShortMeaning({ meaning: long }, 30);
  assert.ok(out.length <= 31);
  assert.ok(out.endsWith('…'));
  assert.equal(ctx.getShortMeaning({ meaning: 'apel' }), 'apel');
});

test('simpleHash deterministik', () => {
  assert.equal(ctx.simpleHash('vocaplay'), ctx.simpleHash('vocaplay'));
  assert.notEqual(ctx.simpleHash('a'), ctx.simpleHash('b'));
});

test('sha256Hex cocok dengan implementasi standar Node', async () => {
  const { createHash } = await import('node:crypto');
  for (const s of ['', 'abc', 'vocaplay_v2:budi:password123']) {
    assert.equal(ctx.sha256Hex(s), createHash('sha256').update(s).digest('hex'));
  }
});
