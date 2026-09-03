-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  title text not null,
  description text,
  link_url text,
  created_at timestamptz default now()
);

create index if not exists events_event_date_idx on events (event_date);

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

create policy "public can delete events"
  on events for delete
  using (true);
