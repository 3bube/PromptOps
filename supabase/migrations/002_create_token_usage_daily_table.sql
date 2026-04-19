-- Create token_usage_daily table for aggregated daily costs
create table if not exists public.token_usage_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  total_input_tokens integer not null default 0,
  total_output_tokens integer not null default 0,
  total_cost numeric not null default 0,
  request_count integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- Enable RLS
alter table public.token_usage_daily enable row level security;

-- Create RLS policy: Users can only view their own daily stats
create policy "Users can only view their own daily stats"
  on public.token_usage_daily
  for select
  using (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own daily stats
create policy "Users can only insert their own daily stats"
  on public.token_usage_daily
  for insert
  with check (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own daily stats
create policy "Users can only update their own daily stats"
  on public.token_usage_daily
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists token_usage_daily_user_id_idx on public.token_usage_daily(user_id);
create index if not exists token_usage_daily_date_idx on public.token_usage_daily(date desc);
