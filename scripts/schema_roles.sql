-- SQL script to create the user_roles table in Supabase Postgres
-- Execute this script in your Supabase SQL Editor.

DROP TABLE IF EXISTS public.user_roles CASCADE;

CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- Allowed values: 'admin', 'agent', 'user'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies allowing full read, insert, update and delete operations
CREATE POLICY "Allow public select user_roles" ON public.user_roles
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert user_roles" ON public.user_roles
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update user_roles" ON public.user_roles
  FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete user_roles" ON public.user_roles
  FOR DELETE TO public USING (true);
