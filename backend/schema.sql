create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_subscription_status text,
  created_at timestamptz not null default now()
);

create table if not exists usage_daily (
  user_id uuid not null references users(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);

create table if not exists usage_monthly (
  user_id uuid not null references users(id) on delete cascade,
  month date not null,
  count int not null default 0,
  primary key (user_id, month)
);

create table if not exists extension_installs (
  install_id text primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  extension_version text,
  user_agent text
);

create table if not exists extension_events (
  id bigserial primary key,
  install_id text not null references extension_installs(install_id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists extension_usage_daily (
  install_id text not null references extension_installs(install_id) on delete cascade,
  day date not null,
  provider text not null,
  count int not null default 0,
  primary key (install_id, day, provider)
);

create index if not exists extension_events_created_at_idx on extension_events(created_at);
create index if not exists extension_events_install_id_created_at_idx on extension_events(install_id, created_at);
