-- Enable Row Level Security (RLS) for all tables

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY,
  profile_data jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);


-- 2. Timeline Events Table
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  year text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL,
  icon_name text NOT NULL,
  scenario text NOT NULL,
  tasks jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS timeline_events_user_id_idx ON public.timeline_events(user_id);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timeline events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Users can insert own timeline events" ON public.timeline_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own timeline events" ON public.timeline_events FOR UPDATE USING (true);
CREATE POLICY "Users can delete own timeline events" ON public.timeline_events FOR DELETE USING (true);


-- 3. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  actions jsonb,
  timestamp timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_timestamp_idx ON public.chat_messages(timestamp asc);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own chat messages" ON public.chat_messages FOR DELETE USING (true);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'JPY',
  billing_cycle text NOT NULL DEFAULT 'monthly',
  next_payment_date text NOT NULL,
  category text NOT NULL DEFAULT 'entertainment',
  is_essential boolean DEFAULT false,
  reminder_days integer[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR UPDATE USING (true);
CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timeline_updated_at ON public.timeline_events;
CREATE TRIGGER set_timeline_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
