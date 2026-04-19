alter table public.users
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'unlimited')),
  add column if not exists polar_customer_id text unique;
