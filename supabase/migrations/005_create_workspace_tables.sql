-- ============================================================
-- Migration 005: Workspace tables
--
-- Tables:
--   workspaces          – a named container for prompt projects
--   workspace_prompts   – a saved/engineered prompt inside a workspace
--   prompt_blocks       – structured blocks that make up a prompt
--   prompt_variables    – {{variable}} definitions per prompt
--   prompt_versions     – snapshot history of a prompt over time
--   workspace_test_runs – results from running a prompt in the Test tab
-- ============================================================

-- ----------------------------------------------------------
-- 1. workspaces
-- ----------------------------------------------------------
create table if not exists public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

alter table public.workspaces enable row level security;

create policy "Users manage own workspaces"
  on public.workspaces for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists workspaces_user_id_idx on public.workspaces(user_id);

-- ----------------------------------------------------------
-- 2. workspace_prompts  (the prompt "document")
-- ----------------------------------------------------------
create table if not exists public.workspace_prompts (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  description  text,
  category     text check (category in ('coding', 'writing', 'marketing', 'analysis', 'creative', 'general')),
  created_at   timestamp with time zone default now(),
  updated_at   timestamp with time zone default now()
);

alter table public.workspace_prompts enable row level security;

create policy "Users manage own workspace prompts"
  on public.workspace_prompts for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists workspace_prompts_workspace_id_idx on public.workspace_prompts(workspace_id);
create index if not exists workspace_prompts_user_id_idx      on public.workspace_prompts(user_id);

-- ----------------------------------------------------------
-- 3. prompt_blocks  (the ordered blocks inside a prompt)
-- ----------------------------------------------------------
create table if not exists public.prompt_blocks (
  id        uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.workspace_prompts(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  title     text not null,              -- e.g. "System Instruction", "Goal"
  content   text not null default '',
  color     text not null default '#7c5cfc',
  position  integer not null default 0, -- ordering within the prompt
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.prompt_blocks enable row level security;

create policy "Users manage own prompt blocks"
  on public.prompt_blocks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists prompt_blocks_prompt_id_idx on public.prompt_blocks(prompt_id, position);

-- ----------------------------------------------------------
-- 4. prompt_variables  ({{name}} definitions per prompt)
-- ----------------------------------------------------------
create table if not exists public.prompt_variables (
  id        uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.workspace_prompts(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  name      text not null,              -- e.g. "target_url"
  default_value text not null default '',
  created_at timestamp with time zone default now(),
  unique(prompt_id, name)
);

alter table public.prompt_variables enable row level security;

create policy "Users manage own prompt variables"
  on public.prompt_variables for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists prompt_variables_prompt_id_idx on public.prompt_variables(prompt_id);

-- ----------------------------------------------------------
-- 5. prompt_versions  (snapshot history — one row per "save")
-- ----------------------------------------------------------
create table if not exists public.prompt_versions (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references public.workspace_prompts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  version_num integer not null,          -- auto-incrementing per prompt
  label       text,                      -- optional user label, e.g. "v3 – Added constraints"
  snapshot    jsonb not null,            -- full serialised blocks + variables at save time
  created_at  timestamp with time zone default now(),
  unique(prompt_id, version_num)
);

alter table public.prompt_versions enable row level security;

create policy "Users manage own prompt versions"
  on public.prompt_versions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists prompt_versions_prompt_id_idx on public.prompt_versions(prompt_id, version_num desc);

-- Auto-increment version_num per prompt
create or replace function public.set_prompt_version_num()
returns trigger language plpgsql as $$
begin
  select coalesce(max(version_num), 0) + 1
    into new.version_num
    from public.prompt_versions
   where prompt_id = new.prompt_id;
  return new;
end;
$$;

create or replace trigger trg_prompt_version_num
  before insert on public.prompt_versions
  for each row execute procedure public.set_prompt_version_num();

-- ----------------------------------------------------------
-- 6. workspace_test_runs  (results from the Test tab)
-- ----------------------------------------------------------
create table if not exists public.workspace_test_runs (
  id              uuid primary key default gen_random_uuid(),
  prompt_id       uuid not null references public.workspace_prompts(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  variable_values jsonb not null default '{}',  -- snapshot of variable values used
  user_message    text,                         -- optional user-turn message
  output          text not null,                -- full model response
  input_tokens    integer not null default 0,
  output_tokens   integer not null default 0,
  latency_ms      integer,                      -- wall-clock ms for the run
  created_at      timestamp with time zone default now()
);

alter table public.workspace_test_runs enable row level security;

create policy "Users manage own test runs"
  on public.workspace_test_runs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists workspace_test_runs_prompt_id_idx on public.workspace_test_runs(prompt_id, created_at desc);
create index if not exists workspace_test_runs_user_id_idx   on public.workspace_test_runs(user_id);

-- ----------------------------------------------------------
-- 7. Shared updated_at trigger (reuse if already exists)
-- ----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute procedure public.set_updated_at();

create or replace trigger set_workspace_prompts_updated_at
  before update on public.workspace_prompts
  for each row execute procedure public.set_updated_at();

create or replace trigger set_prompt_blocks_updated_at
  before update on public.prompt_blocks
  for each row execute procedure public.set_updated_at();
