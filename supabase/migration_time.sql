-- Adds optional time-of-day fields (e.g. deadline at 23:59, exam starts at 09:00).
-- Both are nullable — leave blank for events that only need a date.
-- Run in Supabase SQL Editor.

alter table events
  add column if not exists start_time time,
  add column if not exists end_time time;
