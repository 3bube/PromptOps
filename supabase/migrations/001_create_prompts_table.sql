-- Create prompts table for storing generated prompts and token usage
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_template text not null,
  user_input jsonb not null,
  generated_prompt text not null,
  category text not null check (category in ('coding', 'writing', 'marketing', 'analysis', 'creative', 'general')),
  tone text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_cost numeric not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.prompts enable row level security;

-- Create RLS policy: Users can only view their own prompts
create policy "Users can only view their own prompts"
  on public.prompts
  for select
  using (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own prompts
create policy "Users can only insert their own prompts"
  on public.prompts
  for insert
  with check (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own prompts
create policy "Users can only update their own prompts"
  on public.prompts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create RLS policy: Users can only delete their own prompts
create policy "Users can only delete their own prompts"
  on public.prompts
  for delete
  using (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists prompts_user_id_idx on public.prompts(user_id);
create index if not exists prompts_created_at_idx on public.prompts(created_at desc);
create index if not exists prompts_category_idx on public.prompts(category);
