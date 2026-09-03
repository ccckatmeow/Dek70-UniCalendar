-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- This upgrades the existing "events" table to support a date range
-- (start_date -> end_date) instead of a single event_date.
-- Safe to run once on a table that already has data.

alter table events rename column event_date to start_date;

alter table events
  add column if not exists end_date date;

-- Existing rows: treat their single date as both start and end.
update events set end_date = start_date where end_date is null;

alter table events
  alter column end_date set not null;

-- Guard against someone entering an end date before the start date.
alter table events
  add constraint events_end_after_start check (end_date >= start_date);

-- Old index was on event_date; replace with one that helps range queries.
drop index if exists events_event_date_idx;
create index if not exists events_start_date_idx on events (start_date);
create index if not exists events_end_date_idx on events (end_date);
