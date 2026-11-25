# Panduan Setup Vocaplay — Laravel + MySQL (XAMPP & Laragon)

Folder `laravel-backend/` berisi seluruh file **MVC Laravel + MySQL**, skrip sinkronisasi otomatis, dan suite pengujian API untuk Vocaplay.

---

## 1. Prasyarat di Windows (XAMPP atau Laragon)

### Jika Memakai **XAMPP**:
1. Pastikan PHP minimal **PHP 8.2** (`php -v`) dan **Composer** sudah terpasang (`composer -V`).
2. Klik **Start** pada **Apache** dan **MySQL** di XAMPP Control Panel.
3. *(Opsional untuk Filament Admin)*: Aktifkan `extension=zip` dan `extension=intl` di `C:\xampp\php\php.ini`, lalu restart Apache.

### Jika Memakai **Laragon**:
1. Buka Laragon → klik **Start All** (PHP, Composer, dan MySQL sudah tersedia otomatis).

---

## 2. Buat Proyek Laravel & Database MySQL (Sekali Saja)

1. Buka PowerShell di `C:\xampp\htdocs`:
```powershell
composer create-project laravel/laravel vocaplay-laravel
cd vocaplay-laravel
php artisan install:api
```
2. Buat database `vocaplay_db` (aplikasi) dan `vocaplay_test` (khusus automated test):
```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS vocaplay_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE DATABASE IF NOT EXISTS vocaplay_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 3. Sinkronisasi Otomatis (1 Perintah)

Setiap kali ada perubahan di folder proyek `vocaplay`, jalankan skrip sinkronisasi ini di PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\asus\.gemini\antigravity\scratch\vocaplay\laravel-backend\sync_to_laravel.ps1"
```

Skrip ini otomatis melakukan:
1. Menyalin Models, Controller, Migrations, Seeder, Routes, `phpunit.xml`, dan Feature Tests ke `C:\xampp\htdocs\vocaplay-laravel`.
2. Menyalin frontend (`index.html`, `css/`, `js/`, `assets/`, `vocab.js`, `manifest.json`, `sw.js`) ke `public/` dan memasang `cloud_laravel.js` sebagai `public/cloud.js`.
3. Mengatur `.env` agar terhubung ke MySQL `vocaplay_db`.
4. Menjalankan `php artisan migrate --force` dan `php artisan route:clear`.

---

## 4. Menjalankan Server & Tes Otomatis

```powershell
cd C:\xampp\htdocs\vocaplay-laravel

# Jalankan seluruh Feature Test API (aman memakai database vocaplay_test)
php artisan test

# Jalankan server lokal
php artisan serve
```
Buka di browser: `http://127.0.0.1:8000`.

---

## 5. Tambah Panel Admin (FilamentPHP — Opsional)
```powershell
composer require filament/filament:"^3.2" -W
php artisan filament:install --panels
php artisan make:filament-user
php artisan make:filament-resource Vocab --generate
php artisan make:filament-resource User --generate
```
Akses Panel Admin di: `http://127.0.0.1:8000/admin`.
