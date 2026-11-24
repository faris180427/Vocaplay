import csv
import io
import json
import re
import urllib.request

TARGET_ADD = 4000

POS_TO_CATEGORY = {
    'noun': 'Nouns',
    'verb': 'Verbs',
    'adjective': 'Adjectives',
    'adverb': 'Adverbs',
    'preposition': 'Grammar',
    'conjunction': 'Grammar',
    'pronoun': 'Grammar',
    'determiner': 'Grammar',
    'exclamation': 'Expressions',
    'number': 'Numbers',
    'auxiliary verb': 'Verbs',
    'modal verb': 'Verbs',
    'phrasal verb': 'Verbs',
}

CAT_EMOJI = {
    'Nouns': '📦',
    'Verbs': '⚡',
    'Adjectives': '🎨',
    'Adverbs': '🧭',
    'Grammar': '🧩',
    'Expressions': '💬',
    'Numbers': '🔢',
    'General': '📘',
}


def fetch_text(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'VocaplayBuilder/1.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode('utf-8', errors='replace')


def chunk_sentence(example, word):
    if not example:
        return ['Learn', 'the word', word, 'today']
    clean = re.sub(r'\s+', ' ', example.strip().rstrip('.!?'))
    words = clean.split(' ')
    if len(words) <= 2:
        return ['Let us', 'practice', word, 'today']
    if len(words) <= 5:
        return words
    # Group into 4 natural chunks
    step = max(1, len(words) // 4)
    chunks = [' '.join(words[i:i + step]) for i in range(0, len(words), step)]
    if len(chunks) > 5:
        chunks = chunks[:4] + [' '.join(chunks[4:])]
    return chunks


def make_short_meaning(definition, word):
    if not definition:
        return 'Common English vocabulary term'
    # Take first concise clause and mask target word if it appears
    short = re.split(r'[;.]', definition.strip())[0]
    short = re.sub(rf'\b{re.escape(word)}\w*\b', '___', short, flags=re.IGNORECASE)
    if len(short) > 68:
        short = short[:65].rsplit(' ', 1)[0] + '...'
    return short


def pick_distractors(word):
    pool = 'eariotnslcudpmhgbfywkvxzjq'
    wset = set(word.lower())
    out = [ch for ch in pool if ch not in wset][:4]
    return out if len(out) >= 3 else ['x', 'z', 'q']


def parse_oxford_json(raw_text):
    data = json.loads(raw_text)
    rows = list(data.values()) if isinstance(data, dict) else data
    entries = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        word = str(r.get('word', '')).strip().lower()
        if not re.match(r'^[a-z]{2,15}$', word):
            continue
        cefr_raw = str(r.get('cefr') or r.get('level') or 'B1').strip().upper()
        cefr = cefr_raw if cefr_raw in ('A1', 'A2', 'B1', 'B2', 'C1') else ('C1' if cefr_raw == 'C2' else 'B1')
        pos = str(r.get('part_of_speech') or r.get('type') or r.get('pos') or 'noun').split(',')[0].strip().lower()
        category = POS_TO_CATEGORY.get(pos, 'General')
        phonetic = str(r.get('us_phonetic') or r.get('uk_phonetic') or r.get('phonetic') or f'/{word}/').strip()
        definition = str(r.get('definition') or f'A {pos} commonly used in {cefr} English.').strip()
        example = str(r.get('example') or '').strip()
        entries.append({
            'word': word,
            'cefr': cefr,
            'category': category,
            'emoji': CAT_EMOJI.get(category, '📘'),
            'phonetic': phonetic,
            'meaning': make_short_meaning(definition, word),
            'definition': definition,
            'distractors': pick_distractors(word),
            'synonym': '',
            'antonym': '',
            'sentence': chunk_sentence(example, word),
            'sentenceIndo': make_short_meaning(definition, word),
        })
    return entries


def parse_oxford_csv(raw_text):
    reader = csv.DictReader(io.StringIO(raw_text))
    entries = []
    for r in reader:
        word = str(r.get('word') or r.get('Word') or '').strip().lower()
        if not re.match(r'^[a-z]{2,15}$', word):
            continue
        cefr_raw = str(r.get('cefr') or r.get('level') or r.get('CEFR') or 'B1').strip().upper()
        cefr = cefr_raw if cefr_raw in ('A1', 'A2', 'B1', 'B2', 'C1') else ('C1' if cefr_raw == 'C2' else 'B1')
        pos = str(r.get('part_of_speech') or r.get('pos') or r.get('type') or 'noun').split(',')[0].strip().lower()
        category = POS_TO_CATEGORY.get(pos, 'General')
        phonetic = str(r.get('us_phonetic') or r.get('uk_phonetic') or r.get('phonetic') or f'/{word}/').strip()
        definition = str(r.get('definition') or f'An English {pos} at {cefr} level.').strip()
        example = str(r.get('example') or '').strip()
        entries.append({
            'word': word,
            'cefr': cefr,
            'category': category,
            'emoji': CAT_EMOJI.get(category, '📘'),
            'phonetic': phonetic,
            'meaning': make_short_meaning(definition, word),
            'definition': definition,
            'distractors': pick_distractors(word),
            'synonym': '',
            'antonym': '',
            'sentence': chunk_sentence(example, word),
            'sentenceIndo': make_short_meaning(definition, word),
        })
    return entries


def main():
    sources = [
        ('json', 'https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_5000.json'),
        ('json', 'https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/master/data/oxford_5000.json'),
        ('csv', 'https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_5000.csv'),
        ('csv', 'https://raw.githubusercontent.com/nalgeon/words/main/data/oxford-5k.csv'),
        ('json', 'https://raw.githubusercontent.com/tyypgzl/Oxford-5000-words/main/full-word.json'),
    ]

    collected = []
    for kind, url in sources:
        try:
            print(f'Fetching {url} ...')
            raw = fetch_text(url)
            parsed = parse_oxford_json(raw) if kind == 'json' else parse_oxford_csv(raw)
            if len(parsed) >= 1000:
                collected = parsed
                print(f'Loaded {len(collected)} words from {url}')
                break
        except Exception as exc:
            print(f'Skip {url}: {exc}')

    if not collected:
        raise SystemExit('Failed to download Oxford dataset. Check internet connection.')

    seen = set()
    try:
        with open('vocab.js', 'r', encoding='utf-8') as vf:
            for m in re.finditer(r"word:\s*'([^']+)'", vf.read()):
                seen.add(m.group(1).strip().lower())
    except FileNotFoundError:
        pass

    final_items = []
    for idx, item in enumerate(collected):
        if item['word'] in seen:
            continue
        seen.add(item['word'])
        item['id'] = f'ox_{idx + 1}'
        final_items.append(item)
        if len(final_items) >= TARGET_ADD:
            break

    out_path = 'vocab_4000.js'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('window.EXTRA_VOCAB_4000 = ')
        json.dump(final_items, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')

    print(f'SUCCESS: Added {len(final_items)} unique words to {out_path}')


if __name__ == '__main__':
    main()
