-- ============================================================
-- Migration 006: Chat messages for prompt assistant
--
-- Tables:
--   prompt_messages – version-specific chat history
-- ============================================================

-- Drop existing table if it exists
drop table if exists public.prompt_messages cascade;

-- ----------------------------------------------------------
-- prompt_messages  (assistant chat history, per version)
-- ----------------------------------------------------------
create table if not exists public.prompt_messages (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references public.workspace_prompts(id) on delete cascade,
  version_id  uuid references public.prompt_versions(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  created_at  timestamp with time zone default now()
);

alter table public.prompt_messages enable row level security;

create policy "Users manage own prompt messages"
  on public.prompt_messages for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists prompt_messages_prompt_id_version_id_idx 
  on public.prompt_messages(prompt_id, version_id, created_at);
create index if not exists prompt_messages_prompt_id_idx 
  on public.prompt_messages(prompt_id, created_at);
