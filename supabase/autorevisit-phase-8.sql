alter table customer_pages
add column if not exists who_for text default 'themselves',
add column if not exists design_style text default 'clean_light',
add column if not exists finance_monthly text,
add column if not exists finance_deposit text,
add column if not exists finance_term text,
add column if not exists finance_apr text,
add column if not exists dealer_notes text;
