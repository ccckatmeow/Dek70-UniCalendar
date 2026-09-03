-- Adds support for multiple links per event, and allows editing
-- (an UPDATE policy — earlier migrations only allowed select/insert/delete).
-- Run in Supabase SQL Editor.

alter table events
  add column if not exists links jsonb default '[]'::jsonb;

-- Carry over any existing single link_url into the new links list.
update events
set links = jsonb_build_array(jsonb_build_object('label', '', 'url', link_url))
where link_url is not null and (links is null or links = '[]'::jsonb);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'public can update events'
  ) then
    create policy "public can update events" on events for update using (true);
  end if;
end $$;
