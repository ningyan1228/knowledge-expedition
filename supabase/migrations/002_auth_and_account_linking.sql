-- Free authentication foundation: anonymous users keep the same auth.users.id after email binding.
alter table public.profiles add column if not exists last_seen_at timestamptz not null default now();

create or replace function public.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', '远征者'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users for each row execute procedure public.create_profile_for_auth_user();

create table if not exists public.auth_email_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email_hash text not null,
  event_type text not null check (event_type in ('bind', 'login')),
  status text not null check (status in ('requested', 'sent', 'failed', 'limited')),
  provider text not null check (provider in ('supabase-default', 'resend-smtp')),
  created_at timestamptz not null default now()
);
create index if not exists auth_email_events_hash_created_idx on public.auth_email_events(email_hash, created_at desc);

create table if not exists public.account_merge_tickets (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  guest_user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.account_merge_logs (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.account_merge_tickets(id),
  guest_user_id uuid not null references auth.users(id),
  permanent_user_id uuid not null references auth.users(id),
  merged_at timestamptz not null default now(),
  unique(ticket_id)
);

alter table public.auth_email_events enable row level security;
alter table public.account_merge_tickets enable row level security;
alter table public.account_merge_logs enable row level security;

create or replace function public.merge_guest_progress(merge_token_hash text, permanent_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare ticket public.account_merge_tickets%rowtype;
begin
  select * into ticket from public.account_merge_tickets
  where token_hash = merge_token_hash and used_at is null and expires_at > now() for update;
  if not found then raise exception 'invalid merge ticket'; end if;
  if ticket.guest_user_id = permanent_user_id then raise exception 'same account'; end if;

  update public.profiles target set xp = greatest(target.xp, source.xp), last_seen_at = now()
  from public.profiles source where target.id = permanent_user_id and source.id = ticket.guest_user_id;

  insert into public.level_progress (user_id, level_id, stars, best_score, completed_at)
  select permanent_user_id, level_id, stars, best_score, completed_at from public.level_progress where user_id = ticket.guest_user_id
  on conflict (user_id, level_id) do update set
    stars = greatest(public.level_progress.stars, excluded.stars),
    best_score = greatest(public.level_progress.best_score, excluded.best_score),
    completed_at = coalesce(public.level_progress.completed_at, excluded.completed_at);

  insert into public.knowledge_mastery (user_id, knowledge_id, mastery_score, correct_count, wrong_count, streak_correct, last_result, last_reviewed_at, next_review_at, status)
  select permanent_user_id, knowledge_id, mastery_score, correct_count, wrong_count, streak_correct, last_result, last_reviewed_at, next_review_at, status from public.knowledge_mastery where user_id = ticket.guest_user_id
  on conflict (user_id, knowledge_id) do update set
    mastery_score = greatest(public.knowledge_mastery.mastery_score, excluded.mastery_score),
    correct_count = greatest(public.knowledge_mastery.correct_count, excluded.correct_count),
    wrong_count = greatest(public.knowledge_mastery.wrong_count, excluded.wrong_count),
    next_review_at = least(public.knowledge_mastery.next_review_at, excluded.next_review_at),
    updated_at = now();

  insert into public.wrong_questions (user_id, question_id, wrong_count, last_wrong_at, resolved_at)
  select permanent_user_id, question_id, wrong_count, last_wrong_at, resolved_at from public.wrong_questions where user_id = ticket.guest_user_id
  on conflict (user_id, question_id) do update set
    wrong_count = greatest(public.wrong_questions.wrong_count, excluded.wrong_count),
    last_wrong_at = greatest(public.wrong_questions.last_wrong_at, excluded.last_wrong_at),
    resolved_at = coalesce(public.wrong_questions.resolved_at, excluded.resolved_at);

  update public.account_merge_tickets set used_at = now(), used_by_user_id = permanent_user_id where id = ticket.id;
  insert into public.account_merge_logs (ticket_id, guest_user_id, permanent_user_id) values (ticket.id, ticket.guest_user_id, permanent_user_id);
end;
$$;

revoke all on function public.merge_guest_progress(text, uuid) from public, anon, authenticated;
grant execute on function public.merge_guest_progress(text, uuid) to service_role;
