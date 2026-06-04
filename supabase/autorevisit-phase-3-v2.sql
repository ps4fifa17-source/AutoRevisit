alter table customer_pages
add column if not exists push_angle text default 'reassurance',
add column if not exists page_style text default 'simple',
add column if not exists ai_short_cards jsonb default '[]',
add column if not exists ai_microcopy jsonb default '{}';

alter table customers
add column if not exists email text,
add column if not exists phone text;
