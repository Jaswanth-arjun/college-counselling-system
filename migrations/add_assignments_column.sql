-- Migration: Add assignments column to counsellors table
-- This migration adds support for multiple class assignments per counsellor

ALTER TABLE counsellors 
ADD COLUMN IF NOT EXISTS assignments JSONB DEFAULT '[]'::jsonb;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'counsellors' AND column_name = 'assignments';
