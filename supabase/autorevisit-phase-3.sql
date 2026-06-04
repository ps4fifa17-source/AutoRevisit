alter table customer_pages
add column if not exists ai_sections jsonb default '{}',
add column if not exists journey_type text default 'general',
add column if not exists page_style text default 'modern',
add column if not exists section_order text[] default '{}';

alter table page_events
add column if not exists session_id text,
add column if not exists user_agent text;
