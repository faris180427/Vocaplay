# ==============================================================
# VOCAPLAY — SKRIP OTOMATIS SETUP KE LARAVEL + MYSQL (XAMPP)
# ==============================================================
$src = "C:\Users\asus\.gemini\antigravity\scratch\vocaplay"
$dst = "C:\xampp\htdocs\vocaplay-laravel"

if (-not (Test-Path $dst)) {
    Write-Host "Folder $dst tidak ditemukan. Pastikan proyek Laravel sudah dibuat!" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Menyalin file Backend MVC Laravel (Models, Controller, Migration, Seeder, Routes)..." -ForegroundColor Cyan
Copy-Item "$src\laravel-backend\database\migrations\*" "$dst\database\migrations\" -Force
Copy-Item "$src\laravel-backend\database\seeders\VocabSeeder.php" "$dst\database\seeders\" -Force
Copy-Item "$src\laravel-backend\app\Models\User.php" "$dst\app\Models\" -Force
Copy-Item "$src\laravel-backend\app\Models\Vocab.php" "$dst\app\Models\" -Force
New-Item -ItemType Directory -Force -Path "$dst\app\Http\Controllers\Api" | Out-Null
Copy-Item "$src\laravel-backend\app\Http\Controllers\Api\VocaplayController.php" "$dst\app\Http\Controllers\Api\" -Force
Copy-Item "$src\laravel-backend\routes\api.php" "$dst\routes\api.php" -Force
Copy-Item "$src\laravel-backend\routes\web.php" "$dst\routes\web.php" -Force
New-Item -ItemType Directory -Force -Path "$dst\tests\Feature" | Out-Null
Copy-Item "$src\laravel-backend\tests\Feature\*" "$dst\tests\Feature\" -Force
Copy-Item "$src\laravel-backend\phpunit.xml" "$dst\phpunit.xml" -Force

Write-Host "[2/5] Menyalin Frontend Vocaplay ke folder public/ dan mengganti cloud.js ke MySQL API..." -ForegroundColor Cyan
@("index.html", "vocab.js", "vocab_4000.js", "manifest.json", "sw.js") | ForEach-Object {
    $filePath = Join-Path $src $_
    if (Test-Path $filePath) {
        Copy-Item $filePath "$dst\public\" -Force
    }
}
Copy-Item "$src\css","$src\js","$src\assets" "$dst\public\" -Recurse -Force
Copy-Item "$src\laravel-backend\public\cloud_laravel.js" "$dst\public\cloud.js" -Force

Write-Host "[3/5] Mengatur .env agar konek ke MySQL (vocaplay_db)..." -ForegroundColor Cyan
$envPath = "$dst\.env"
$envText = Get-Content $envPath -Raw
$envText = $envText -replace "(?m)^#?\s*DB_CONNECTION=.*", "DB_CONNECTION=mysql"
$envText = $envText -replace "(?m)^#?\s*DB_HOST=.*", "DB_HOST=127.0.0.1"
$envText = $envText -replace "(?m)^#?\s*DB_PORT=.*", "DB_PORT=3306"
$envText = $envText -replace "(?m)^#?\s*DB_DATABASE=.*", "DB_DATABASE=vocaplay_db"
$envText = $envText -replace "(?m)^#?\s*DB_USERNAME=.*", "DB_USERNAME=root"
$envText = $envText -replace "(?m)^#?\s*DB_PASSWORD=.*", "DB_PASSWORD="
Set-Content -Path $envPath -Value $envText -NoNewline

Set-Location $dst
Write-Host "[4/5] Menjalankan php artisan migrate..." -ForegroundColor Cyan
php artisan migrate --force
php artisan route:clear

Write-Host "[5/5] Mengecek data kosakata MySQL..." -ForegroundColor Cyan
if (Test-Path "$dst\public\vocab_4000.js") {
    php artisan db:seed --class=VocabSeeder
} else {
    Write-Host "vocab_4000.js sudah tidak dipakai (4.000+ kata sudah aman di tabel MySQL vocabs)." -ForegroundColor Yellow
}

Write-Host "`nSELESAI! Jalankan 'php artisan serve' lalu buka http://127.0.0.1:8000" -ForegroundColor Green
