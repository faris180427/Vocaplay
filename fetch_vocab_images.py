"""
Vocaplay Image & Supabase Vocab Seed Generator
----------------------------------------------
1. Membaca BASE_VOCAB_DATA (vocab.js) & EXTRA_VOCAB_4000 (vocab_4000.js)
2. Mengambil URL foto asli secara gratis dari Wikipedia REST API (tanpa API key)
   untuk kata-kata yang belum memiliki gambar.
3. Menyimpan hasil image URL ke vocab_4000.js
4. Menghasilkan file supabase_vocab_seed.sql untuk di-import ke Supabase
   tabel public.vocaplay_vocab.

Cara menjalankan di PowerShell:
  cd C:\\Users\\asus\\.gemini\\antigravity\\scratch\\vocaplay
  python fetch_vocab_images.py
"""

import csv
import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

BASE_DIR = Path(__file__).parent
VOCAB_4000_PATH = BASE_DIR / "vocab_4000.js"
CSV_PATH = BASE_DIR / "vocaplay_vocab.csv"

USER_AGENT = "VocaplayApp/1.0 (https://vocaplay.local; educational)"


def fetch_wikipedia_thumbnail(word: str) -> str:
    """Fetch thumbnail image URL from English Wikipedia REST summary API."""
    clean = urllib.parse.quote(word.strip().replace(" ", "_"))
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{clean}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            if resp.status != 200:
                return ""
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("type") == "disambiguation":
                return ""
            thumb = data.get("thumbnail") or {}
            src = thumb.get("source", "")
            # Skip generic SVG flags/icons if not useful, prefer raster photos
            if src and not src.lower().endswith(".svg"):
                return src
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

    json_part = raw_js[idx + len(prefix) :].strip().rstrip(";")
    words = json.loads(json_part)
    print(f"Total kata di vocab_4000.js: {len(words)}")

    need_img = [w for w in words if not w.get("image")]
    print(f"Mengambil foto Wikipedia untuk {len(need_img)} kata (mohon tunggu ~1-2 menit)...")

    found_count = 0
    with ThreadPoolExecutor(max_workers=16) as pool:
        future_map = {pool.submit(fetch_wikipedia_thumbnail, w["word"]): w for w in need_img}
        for i, fut in enumerate(as_completed(future_map), 1):
            item = future_map[fut]
            img_url = fut.result()
            if img_url:
                item["image"] = img_url
                found_count += 1
            if i % 250 == 0 or i == len(need_img):
                print(f"  Progress: {i}/{len(need_img)} dicek | Foto ditemukan: {found_count}")

    # Save updated vocab_4000.js (langsung dipakai oleh app tanpa perlu upload ke SQL Editor)
    updated_js = f"{prefix}{json.dumps(words, ensure_ascii=False)};\n"
    VOCAB_4000_PATH.write_text(updated_js, encoding="utf-8")
    print(f"Selesai update {VOCAB_4000_PATH.name} ({found_count} kata kini punya foto asli).")

    # Generate lightweight CSV for 1-click import in Supabase Table Editor (optional)
    print(f"Membuat {CSV_PATH.name} (untuk Import CSV di Supabase Table Editor jika diperlukan)...")
    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id", "word", "cefr", "category", "image_url", "phonetic",
            "meaning", "definition", "synonym", "antonym",
            "distractors", "sentence", "sentence_indo"
        ])
        for w in words:
            writer.writerow([
                w.get("id", ""),
                w.get("word", ""),
                w.get("cefr", "A1"),
                w.get("category", "Nouns"),
                w.get("image", ""),
                w.get("phonetic", ""),
                w.get("meaning", ""),
                w.get("definition", ""),
                w.get("synonym", ""),
                w.get("antonym", ""),
                json.dumps(w.get("distractors", []), ensure_ascii=False),
                json.dumps(w.get("sentence", []), ensure_ascii=False),
                w.get("sentenceIndo", "")
            ])
    print(f"Berhasil membuat {CSV_PATH.name}! Aplikasi sudah langsung siap dimainkan.")


if __name__ == "__main__":
    main()
