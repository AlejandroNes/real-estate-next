-- RLS Policies for the 'properties' table
-- Run this in the Supabase SQL Editor after enabling RLS on the table.

-- Allow anyone to read properties (public listing)
CREATE POLICY "Public can read properties" ON public.properties
  FOR SELECT TO public USING (true);

-- Allow authenticated users to insert/update/delete properties
CREATE POLICY "Authenticated users can insert properties" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties" ON public.properties
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties" ON public.properties
  FOR DELETE TO authenticated USING (true);

-- RLS Policies for the 'property_images' table
CREATE POLICY "Public can read property_images" ON public.property_images
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert property_images" ON public.property_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update property_images" ON public.property_images
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property_images" ON public.property_images
  FOR DELETE TO authenticated USING (true);
