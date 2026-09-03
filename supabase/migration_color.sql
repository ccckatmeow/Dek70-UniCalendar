-- Phase 2b: per-event color, used for the bars in the calendar grid.
-- Run in Supabase SQL Editor.

alter table events
  add column if not exists color text default '#3E6FF0';

update events set color = '#3E6FF0' where color is null;
