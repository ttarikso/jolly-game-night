-- Holiday Game Night schema. Run once in Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  email text,
  key text unique,
  status text not null default 'available' check (status in ('available','claimed','revoked')),
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references licenses(id) on delete cascade,
  title text not null,
  format text not null check (format in ('mc','board','top','buzzer')),
  theme text not null default 'pine',
  teams boolean not null default false,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists games_license_idx on games(license_id);

create table if not exists rooms (
  pin text primary key,
  game_id uuid not null references games(id) on delete cascade,
  license_id uuid not null references licenses(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Only the server (service role) touches these tables. Browsers never read them directly.
alter table licenses enable row level security;
alter table games enable row level security;
alter table rooms enable row level security;
