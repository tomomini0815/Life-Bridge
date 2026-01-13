-- Create memos table
create table if not exists public.memos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  checkbox_items jsonb,
  category text default 'general',
  tags text[],
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists memos_user_id_idx on public.memos(user_id);
create index if not exists memos_updated_at_idx on public.memos(updated_at desc);
create index if not exists memos_category_idx on public.memos(category);

-- Enable Row Level Security
alter table public.memos enable row level security;

-- RLS Policies: Users can only access their own memos
create policy "Users can view own memos"
  on public.memos for select
  using (auth.uid() = user_id);

create policy "Users can insert own memos"
  on public.memos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own memos"
  on public.memos for update
  using (auth.uid() = user_id);

create policy "Users can delete own memos"
  on public.memos for delete
  using (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger set_updated_at
  before update on public.memos
  for each row
  execute procedure public.handle_updated_at();
