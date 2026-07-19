-- 成语初章垂直切片：在现有登录/内容表上补齐可审计、幂等的学习记录。
alter table public.knowledge_points add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.knowledge_points add column if not exists review_status text not null default 'draft';
alter table public.questions add column if not exists explanation_json jsonb not null default '{}'::jsonb;
alter table public.questions add column if not exists review_status text not null default 'draft';
alter table public.learning_sessions add column if not exists question_count integer not null default 0;
alter table public.learning_sessions add column if not exists current_index integer not null default 0;
alter table public.learning_sessions add column if not exists correct_count integer not null default 0;
alter table public.learning_sessions add column if not exists wrong_count integer not null default 0;
alter table public.learning_sessions add column if not exists updated_at timestamptz not null default now();
alter table public.question_attempts rename column answer to answer_json;
alter table public.level_progress add column if not exists status text not null default 'locked';
alter table public.level_progress add column if not exists attempt_count integer not null default 0;
alter table public.level_progress add column if not exists first_completed_at timestamptz;
alter table public.level_progress add column if not exists last_completed_at timestamptz;
alter table public.level_progress add column if not exists updated_at timestamptz not null default now();
alter table public.wrong_questions add column if not exists id uuid default gen_random_uuid();
alter table public.wrong_questions add column if not exists knowledge_id text references public.knowledge_points;
alter table public.wrong_questions add column if not exists last_wrong_answer jsonb;
alter table public.wrong_questions add column if not exists status text not null default 'active';
alter table public.wrong_questions add column if not exists created_at timestamptz not null default now();
alter table public.wrong_questions add column if not exists updated_at timestamptz not null default now();
alter table public.review_schedule add column if not exists source_question_id text references public.questions;
alter table public.review_schedule add column if not exists review_type text not null default 'scheduled';
alter table public.review_schedule add column if not exists last_result boolean;
alter table public.review_schedule add column if not exists created_at timestamptz not null default now();
alter table public.review_schedule add column if not exists updated_at timestamptz not null default now();

create table if not exists public.mastery_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  knowledge_id text not null references public.knowledge_points, source_type text not null,
  source_id text not null, delta integer not null, score_before integer not null,
  score_after integer not null check(score_after between 0 and 100), reason text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.reward_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  source_type text not null, source_id text not null, reward_type text not null,
  amount integer not null check(amount >= 0), idempotency_key text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.player_game_state (
  user_id uuid primary key references auth.users on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create unique index if not exists attempts_session_question_idx on public.question_attempts(session_id,question_id);
create unique index if not exists active_review_per_knowledge_idx on public.review_schedule(user_id,knowledge_id) where state in ('due','scheduled','active');
create index if not exists mastery_events_user_idx on public.mastery_events(user_id,created_at desc);
alter table public.mastery_events enable row level security;
alter table public.reward_events enable row level security;
alter table public.player_game_state enable row level security;
create policy "own mastery events" on public.mastery_events for select using(auth.uid()=user_id);
create policy "own reward events" on public.reward_events for select using(auth.uid()=user_id);
create policy "own game state" on public.player_game_state for select using(auth.uid()=user_id);
