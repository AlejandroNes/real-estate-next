-- SQL script to create the property_images table in Supabase Postgres
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)

CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies allowing read and write operations
CREATE POLICY "Allow public select property_images" ON public.property_images
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert property_images" ON public.property_images
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update property_images" ON public.property_images
  FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete property_images" ON public.property_images
  FOR DELETE TO public USING (true);
