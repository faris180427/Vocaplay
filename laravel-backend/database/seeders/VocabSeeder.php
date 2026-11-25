<?php

namespace Database\Seeders;

use App\Models\Vocab;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class VocabSeeder extends Seeder
{
    /**
     * Impor 4.080+ kosakata dari vocab_4000.js ke tabel MySQL `vocabs`.
     * Jalankan: php artisan db:seed --class=VocabSeeder
     */
    public function run(): void
    {
        $paths = [
            public_path('vocab_4000.js'),
            base_path('database/data/vocab_4000.js'),
        ];

        $sourceFile = null;
        foreach ($paths as $p) {
            if (File::exists($p)) {
                $sourceFile = $p;
                break;
            }
        }

        if (!$sourceFile) {
            $this->command?->warn('File vocab_4000.js tidak ditemukan di public/ atau database/data/.');
            return;
        }

        $raw = File::get($sourceFile);
        $start = strpos($raw, '[');
        $end = strrpos($raw, ']');
        if ($start === false || $end === false) {
            $this->command?->error('Format array JSON di vocab_4000.js tidak valid.');
            return;
        }

        $jsonStr = substr($raw, $start, $end - $start + 1);
        $items = json_decode($jsonStr, true);

        if (!is_array($items)) {
            $this->command?->error('Gagal decode JSON vocab_4000.js: ' . json_last_error_msg());
            return;
        }

        $now = now();
        $batch = [];
        $count = 0;

        foreach ($items as $idx => $item) {
            $word = trim((string) ($item['word'] ?? ''));
            if ($word === '') continue;

            $code = (string) ($item['id'] ?? ('ox_' . ($idx + 1)));
            $cefr = strtoupper((string) ($item['cefr'] ?? 'A1'));
            if (!in_array($cefr, ['A1', 'A2', 'B1', 'B2', 'C1'], true)) {
                $cefr = 'A1';
            }

            $batch[] = [
                'code'            => substr($code, 0, 60),
                'word'            => substr($word, 0, 100),
                'cefr'            => $cefr,
                'category'        => substr((string) ($item['category'] ?? 'General'), 0, 60),
                'phonetic'        => substr((string) ($item['phonetic'] ?? "/{$word}/"), 0, 100),
                'meaning'         => substr((string) ($item['meaning'] ?? $word), 0, 255),
                'definition'      => (string) ($item['definition'] ?? ''),
                'image_url'       => substr((string) ($item['image'] ?? ''), 0, 500) ?: null,
                'sentence_tokens' => isset($item['sentence']) ? json_encode($item['sentence']) : null,
                'sentence_indo'   => substr((string) ($item['sentenceIndo'] ?? ''), 0, 255) ?: null,
                'created_at'      => $now,
                'updated_at'      => $now,
            ];

            if (count($batch) >= 400) {
                Vocab::upsert(
                    $batch,
                    ['code'],
                    ['word', 'cefr', 'category', 'phonetic', 'meaning', 'definition', 'image_url', 'sentence_tokens', 'sentence_indo', 'updated_at']
                );
                $count += count($batch);
                $batch = [];
            }
        }

        if (!empty($batch)) {
            Vocab::upsert(
                $batch,
                ['code'],
                ['word', 'cefr', 'category', 'phonetic', 'meaning', 'definition', 'image_url', 'sentence_tokens', 'sentence_indo', 'updated_at']
            );
            $count += count($batch);
        }

        $this->command?->info("Berhasil mengimpor {$count} kosakata ke tabel MySQL `vocabs`!");
    }
}
