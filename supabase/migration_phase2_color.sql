-- Phase 2b: custom event color. Run in Supabase SQL Editor.
alter table events
  add column if not exists color text default '#3E6FF0';
