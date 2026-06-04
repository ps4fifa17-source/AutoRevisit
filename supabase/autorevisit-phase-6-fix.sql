alter table profiles
add column if not exists role text default 'dealer',
add column if not exists test_plan text;

alter table dealerships
add column if not exists approval_status text default 'approved',
add column if not exists admin_notes text,
add column if not exists approved_at timestamptz,
add column if not exists approved_by uuid,
add column if not exists plan_name text default 'starter',
add column if not exists subscription_status text default 'active';
