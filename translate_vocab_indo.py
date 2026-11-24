"""
Vocaplay Indonesian Meaning Translator
--------------------------------------
Menerjemahkan field `meaning` di vocab_4000.js dari definisi bahasa Inggris
menjadi arti Bahasa Indonesia yang ringkas agar game seperti Fast Vocab,
Memory Flip, dan Balloon Catcher jauh lebih nyaman dimainkan.

Cara menjalankan di PowerShell:
  cd C:\\Users\\asus\\.gemini\\antigravity\\scratch\\vocaplay
  python translate_vocab_indo.py
"""

import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

BASE_DIR = Path(__file__).parent
VOCAB_4000_PATH = BASE_DIR / "vocab_4000.js"
USER_AGENT = "Mozilla/5.0"


def translate_word_to_id(word: str) -> str:
    """Translate a single English headword to concise Bahasa Indonesia."""
    q = urllib.parse.quote(word.strip())
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            translated = data[0][0][0].strip()
            if translated:
                return translated[:1].upper() + translated[1:]
    except Exception:
        return ""
    return ""


def main():
    if not VOCAB_4000_PATH.exists():
        print("vocab_4000.js tidak ditemukan.")
        return

    raw_js = VOCAB_4000_PATH.read_text(encoding="utf-8")
    prefix = "window.EXTRA_VOCAB_4000 = "
    idx = raw_js.find(prefix)
    if idx == -1:
        print("Format vocab_4000.js tidak sesuai.")
        return

    words = json.loads(raw_js[idx + len(prefix) :].strip().rstrip(";"))
    print(f"Menerjemahkan {len(words)} kata ke Bahasa Indonesia (mohon tunggu ~1-2 menit)...")

    updated = 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        future_map = {pool.submit(translate_word_to_id, w["word"]): w for w in words}
        for i, fut in enumerate(as_completed(future_map), 1):
            item = future_map[fut]
            indo = fut.result()
            if indo:
                item["meaning"] = indo
                updated += 1
            if i % 300 == 0 or i == len(words):
                print(f"  Progress: {i}/{len(words)} | Diterjemahkan: {updated}")

    VOCAB_4000_PATH.write_text(f"{prefix}{json.dumps(words, ensure_ascii=False)};\n", encoding="utf-8")
    print(f"Selesai! {updated} kata di {VOCAB_4000_PATH.name} kini memiliki arti Bahasa Indonesia.")


if __name__ == "__main__":
    main()
