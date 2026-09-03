-- Phase 1: filter/tag fields. Run in Supabase SQL Editor.
-- Safe to run once on a table that already has the start_date/end_date columns.

alter table events
  add column if not exists university text,
  add column if not exists tcas_round text,
  add column if not exists tags text[] default '{}',
  add column if not exists submitted_by text,
  add column if not exists edited_by text,
  add column if not exists updated_at timestamptz default now();

create index if not exists events_tags_idx on events using gin (tags);
create index if not exists events_university_idx on events (university);
