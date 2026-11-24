-- ==============================================================
-- VOCAPLAY ONLINE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Jalankan script ini di Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.vocaplay_users (
  username text primary key,
  name text not null,
  password_hash text not null,
  avatar text not null default '🎓',
  bio text not null default 'Building English fluency one word at a time.',
  joined_date text not null default '',
  cefr text not null default 'A1',
  deck_id text not null default 'ox_a1',
  xp integer not null default 0,
  weekly_xp integer not null default 0,
  monthly_xp integer not null default 0,
  coins integer not null default 20,
  streak integer not null default 0,
  last_active_date text not null default '',
  week_days_active jsonb not null default '[false,false,false,false,false,false,false]'::jsonb,
  games_played integer not null default 0,
  perfect_games integer not null default 0,
  total_answered integer not null default 0,
  total_correct integer not null default 0,
  mastered_words jsonb not null default '[]'::jsonb,
  weak_words jsonb not null default '[]'::jsonb,
  custom_words jsonb not null default '[]'::jsonb,
  unlocked_badges jsonb not null default '[]'::jsonb,
  daily_mission jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vocaplay_weekly_xp on public.vocaplay_users (weekly_xp desc);
create index if not exists idx_vocaplay_monthly_xp on public.vocaplay_users (monthly_xp desc);
create index if not exists idx_vocaplay_total_xp on public.vocaplay_users (xp desc);

-- Lock down direct table access so password_hash is never exposed
alter table public.vocaplay_users enable row level security;

-- Helper: strip password_hash when returning user JSON
create or replace function public._vocaplay_public_user(u public.vocaplay_users)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'username', u.username,
    'name', u.name,
    'avatar', u.avatar,
    'bio', u.bio,
    'joinedDate', u.joined_date,
    'cefr', u.cefr,
    'deckId', u.deck_id,
    'xp', u.xp,
    'weeklyXP', u.weekly_xp,
    'monthlyXP', u.monthly_xp,
    'coins', u.coins,
    'streak', u.streak,
    'lastActiveDate', u.last_active_date,
    'weekDaysActive', u.week_days_active,
    'gamesPlayed', u.games_played,
    'perfectGames', u.perfect_games,
    'totalAnswered', u.total_answered,
    'totalCorrect', u.total_correct,
    'masteredWords', u.mastered_words,
    'weakWords', u.weak_words,
    'customWords', u.custom_words,
    'unlockedBadges', u.unlocked_badges,
    'dailyMission', u.daily_mission
  );
$$;

-- 1. Register Account (Server-side bcrypt via pgcrypto)
create or replace function public.vocaplay_register(
  p_username text,
  p_name text,
  p_password_hash text,
  p_avatar text default '🎓',
  p_joined_date text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_clean text := lower(regexp_replace(trim(p_username), '[^a-z0-9_]', '', 'g'));
  v_user public.vocaplay_users;
begin
  if length(v_clean) < 3 then
    return jsonb_build_object('ok', false, 'error', 'Username minimal 3 karakter.');
  end if;

  if length(coalesce(p_password_hash, '')) < 8 then
    return jsonb_build_object('ok', false, 'error', 'Format hash password tidak valid.');
  end if;

  if exists (select 1 from public.vocaplay_users where username = v_clean) then
    return jsonb_build_object('ok', false, 'error', 'Username sudah terdaftar.');
  end if;

  insert into public.vocaplay_users (username, name, password_hash, avatar, joined_date)
  values (
    v_clean,
    trim(p_name),
    crypt(p_password_hash, gen_salt('bf')),
    coalesce(nullif(p_avatar, ''), '🎓'),
    p_joined_date
  )
  returning * into v_user;

  return jsonb_build_object('ok', true, 'user', public._vocaplay_public_user(v_user));
end;
$$;

-- 2. Login Account (Supports bcrypt + auto-upgrades legacy hashes)
create or replace function public.vocaplay_login(
  p_username text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_clean text := lower(trim(p_username));
  v_user public.vocaplay_users;
  v_valid boolean := false;
begin
  select * into v_user
  from public.vocaplay_users
  where username = v_clean;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Username atau password salah.');
  end if;

  if v_user.password_hash like '$2%' then
    v_valid := (v_user.password_hash = crypt(p_password_hash, v_user.password_hash));
  else
    v_valid := (v_user.password_hash = p_password_hash);
    if v_valid then
      update public.vocaplay_users
      set password_hash = crypt(p_password_hash, gen_salt('bf'))
      where username = v_clean;
    end if;
  end if;

  if not v_valid then
    return jsonb_build_object('ok', false, 'error', 'Username atau password salah.');
  end if;

  return jsonb_build_object('ok', true, 'user', public._vocaplay_public_user(v_user));
end;
$$;

-- 3. Save Progress & Profile (Verified via bcrypt)
create or replace function public.vocaplay_save_profile(
  p_username text,
  p_password_hash text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_clean text := lower(trim(p_username));
  v_updated integer;
begin
  update public.vocaplay_users
  set
    name = coalesce(p_payload->>'name', name),
    avatar = coalesce(p_payload->>'avatar', avatar),
    bio = coalesce(p_payload->>'bio', bio),
    cefr = coalesce(p_payload->>'cefr', cefr),
    deck_id = coalesce(p_payload->>'deckId', deck_id),
    xp = coalesce((p_payload->>'xp')::integer, xp),
    weekly_xp = coalesce((p_payload->>'weeklyXP')::integer, weekly_xp),
    monthly_xp = coalesce((p_payload->>'monthlyXP')::integer, monthly_xp),
    coins = coalesce((p_payload->>'coins')::integer, coins),
    streak = coalesce((p_payload->>'streak')::integer, streak),
    last_active_date = coalesce(p_payload->>'lastActiveDate', last_active_date),
    week_days_active = coalesce(p_payload->'weekDaysActive', week_days_active),
    games_played = coalesce((p_payload->>'gamesPlayed')::integer, games_played),
    perfect_games = coalesce((p_payload->>'perfectGames')::integer, perfect_games),
    total_answered = coalesce((p_payload->>'totalAnswered')::integer, total_answered),
    total_correct = coalesce((p_payload->>'totalCorrect')::integer, total_correct),
    mastered_words = coalesce(p_payload->'masteredWords', mastered_words),
    weak_words = coalesce(p_payload->'weakWords', weak_words),
    custom_words = coalesce(p_payload->'customWords', custom_words),
    unlocked_badges = coalesce(p_payload->'unlockedBadges', unlocked_badges),
    daily_mission = coalesce(p_payload->'dailyMission', daily_mission),
    updated_at = now()
  where username = v_clean
    and (
      (password_hash like '$2%' and password_hash = crypt(p_password_hash, password_hash))
      or (password_hash not like '$2%' and password_hash = p_password_hash)
    );

  get diagnostics v_updated = row_count;
  if v_updated = 0 then
    return jsonb_build_object('ok', false, 'error', 'Unauthorized or user not found.');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

-- 4. Fetch Live Online Leaderboard
create or replace function public.vocaplay_get_leaderboard(p_period text default 'weekly')
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(row_data), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'username', username,
      'name', name,
      'avatar', avatar,
      'cefr', cefr,
      'xp', xp,
      'weeklyXP', weekly_xp,
      'monthlyXP', monthly_xp
    ) as row_data
    from public.vocaplay_users
    order by
      case
        when p_period = 'monthly' then monthly_xp
        when p_period = 'alltime' then xp
        else weekly_xp
      end desc,
      xp desc
    limit 50
  ) t;
$$;

grant execute on function public.vocaplay_register(text, text, text, text, text) to anon, authenticated;
grant execute on function public.vocaplay_login(text, text) to anon, authenticated;
grant execute on function public.vocaplay_save_profile(text, text, jsonb) to anon, authenticated;
grant execute on function public.vocaplay_get_leaderboard(text) to anon, authenticated;

-- ==============================================================
-- 5. VOCABULARY & IMAGE CORPUS TABLE (TANPA EMOJI)
-- ==============================================================
create table if not exists public.vocaplay_vocab (
  id text primary key,
  word text not null,
  cefr text not null default 'A1',
  category text not null default 'Nouns',
  image_url text not null default '',
  phonetic text not null default '',
  meaning text not null default '',
  definition text not null default '',
  synonym text not null default '',
  antonym text not null default '',
  distractors jsonb not null default '[]'::jsonb,
  sentence jsonb not null default '[]'::jsonb,
  sentence_indo text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_vocaplay_vocab_cefr on public.vocaplay_vocab (cefr);
create index if not exists idx_vocaplay_vocab_word on public.vocaplay_vocab (word);

alter table public.vocaplay_vocab enable row level security;

drop policy if exists "Allow public read vocab" on public.vocaplay_vocab;
create policy "Allow public read vocab"
  on public.vocaplay_vocab for select
  to anon, authenticated
  using (true);

create or replace function public.vocaplay_get_vocab(
  p_limit integer default 1000,
  p_offset integer default 0
)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(row_data), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'id', id,
      'word', word,
      'cefr', cefr,
      'category', category,
      'image', image_url,
      'phonetic', phonetic,
      'meaning', meaning,
      'definition', definition,
      'synonym', synonym,
      'antonym', antonym,
      'distractors', distractors,
      'sentence', sentence,
      'sentenceIndo', sentence_indo
    ) as row_data
    from public.vocaplay_vocab
    order by id
    limit greatest(1, least(p_limit, 2000))
    offset greatest(0, p_offset)
  ) t;
$$;

grant execute on function public.vocaplay_get_vocab(integer, integer) to anon, authenticated;
