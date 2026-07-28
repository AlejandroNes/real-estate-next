-- Add is_active column to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update any existing null values to true
UPDATE public.properties
SET is_active = true
WHERE is_active IS NULL;
