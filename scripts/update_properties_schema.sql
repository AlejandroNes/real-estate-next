-- Add missing columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS property_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(50),
ADD COLUMN IF NOT EXISTS year_built INTEGER,
ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;

-- Create storage bucket for property images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the bucket
-- Allow public access to read images
CREATE POLICY "Public Access for property-images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'property-images');

-- Allow authenticated users to insert/update/delete images
CREATE POLICY "Admin Upload Access for property-images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Admin Update Access for property-images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'property-images');

CREATE POLICY "Admin Delete Access for property-images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'property-images');
