alter table customer_pages
add column if not exists page_type text default 'revisit',
add column if not exists whatsapp_message text,
add column if not exists archived_at timestamptz,
add column if not exists paused_at timestamptz;

alter table page_events
add column if not exists event_label text;

create index if not exists customer_pages_page_type_idx on customer_pages(page_type);
create index if not exists customer_pages_archived_at_idx on customer_pages(archived_at);
create index if not exists page_events_customer_type_idx on page_events(customer_page_id, event_type);
