-- ==============================================================
-- VOCAPLAY — SKEMA DATABASE MYSQL (SIAP IMPORT PHPMYADMIN / ERD)
-- Cocok untuk Laravel 11/12 + MySQL 8 / MariaDB (Laragon/XAMPP)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS vocaplay_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vocaplay_db;

-- 1. Tabel Pengguna (Akun, XP, Streak, Diamonds, Role Admin/User)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  avatar VARCHAR(30) NOT NULL DEFAULT 'av-sky',
  bio VARCHAR(160) NULL,
  cefr ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'ALL') NOT NULL DEFAULT 'A1',
  deck_id VARCHAR(50) NOT NULL DEFAULT 'ox_a1',
  xp INT UNSIGNED NOT NULL DEFAULT 0,
  weekly_xp INT UNSIGNED NOT NULL DEFAULT 0,
  monthly_xp INT UNSIGNED NOT NULL DEFAULT 0,
  coins INT UNSIGNED NOT NULL DEFAULT 0,
  streak INT UNSIGNED NOT NULL DEFAULT 0,
  streak_freezes SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  extra_shields SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  xp_boost_until TIMESTAMP NULL,
  last_active_date DATE NULL,
  games_played INT UNSIGNED NOT NULL DEFAULT 0,
  perfect_games INT UNSIGNED NOT NULL DEFAULT 0,
  total_answered INT UNSIGNED NOT NULL DEFAULT 0,
  total_correct INT UNSIGNED NOT NULL DEFAULT 0,
  profile_meta JSON NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_weekly_xp (weekly_xp DESC),
  INDEX idx_users_monthly_xp (monthly_xp DESC),
  INDEX idx_users_xp (xp DESC)
) ENGINE=InnoDB;

-- 2. Tabel Korpus Kosakata (4.080+ Kata + Kosakata Kustom Admin/User)
CREATE TABLE IF NOT EXISTS vocabs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(60) NOT NULL UNIQUE,
  word VARCHAR(100) NOT NULL,
  cefr ENUM('A1', 'A2', 'B1', 'B2', 'C1') NOT NULL DEFAULT 'A1',
  category VARCHAR(60) NOT NULL DEFAULT 'General',
  phonetic VARCHAR(100) NULL,
  meaning VARCHAR(255) NOT NULL,
  definition TEXT NULL,
  image_url VARCHAR(500) NULL,
  sentence_tokens JSON NULL,
  sentence_indo VARCHAR(255) NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vocabs_cefr (cefr),
  INDEX idx_vocabs_category (category),
  INDEX idx_vocabs_word (word),
  CONSTRAINT fk_vocabs_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Tabel Progres Kata & Spaced Repetition (Memory Vault SRS)
CREATE TABLE IF NOT EXISTS user_word_progress (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  vocab_code VARCHAR(60) NOT NULL,
  status ENUM('mastered', 'weak') NOT NULL DEFAULT 'mastered',
  srs_stage TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_reviewed DATE NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_vocab (user_id, vocab_code),
  CONSTRAINT fk_uwp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabel Rekor Tertinggi (Personal Best) per Mode Game
CREATE TABLE IF NOT EXISTS user_game_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  game_mode VARCHAR(50) NOT NULL,
  high_score INT UNSIGNED NOT NULL DEFAULT 0,
  sessions_count INT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_mode (user_id, game_mode),
  CONSTRAINT fk_ugr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabel Progres Jalur Belajar (10 Unit / 40 Lesson Nodes)
CREATE TABLE IF NOT EXISTS user_path_progress (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  node_id VARCHAR(30) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_node (user_id, node_id),
  CONSTRAINT fk_upp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
