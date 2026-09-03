-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Use this for a brand-new project. If you already ran an earlier version of
-- this file, use the migration_*.sql files instead to upgrade in place.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  start_time time,
  end_time time,
  title text not null,
  description text,
  link_url text,
  links jsonb default '[]'::jsonb,
  university text,
  tcas_round text,
  tags text[] default '{}',
  submitted_by text,
  edited_by text,
  color text default '#3E6FF0',
  color text default '#3E6FF0',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint events_end_after_start check (end_date >= start_date)
);

create index if not exists events_start_date_idx on events (start_date);
create index if not exists events_end_date_idx on events (end_date);
create index if not exists events_tags_idx on events using gin (tags);
create index if not exists events_university_idx on events (university);

-- Row Level Security: open to everyone, no login required.
-- This matches "ไม่ป้องกันเลย ใครก็แก้ไขได้อิสระ" — anyone can read, add, or delete.
-- If you want to lock this down later, tighten these policies.
alter table events enable row level security;

create policy "public can read events"
  on events for select
  using (true);

create policy "public can insert events"
  on events for insert
  with check (true);

create policy "public can update events"
  on events for update
  using (true);

create policy "public can delete events"
  on events for delete
  using (true);
