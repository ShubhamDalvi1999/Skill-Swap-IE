-- Diagnostic and direct fix SQL script for course_tags issues
-- This script bypasses the migration system and directly fixes the database structure

-- PART 1: Diagnostics - Show current table structure and constraints
DO $$
DECLARE
  table_exists BOOLEAN;
  course_tags_columns TEXT;
  course_tags_constraints TEXT;
  mapping_table_exists BOOLEAN;
BEGIN
  -- Check if course_tags table exists
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'course_tags'
  ) INTO table_exists;
  
  RAISE NOTICE 'course_tags table exists: %', table_exists;
  
  -- If it exists, show its columns and constraints
  IF table_exists THEN
    -- Get column information
    SELECT string_agg(column_name || ' (' || data_type || ')', ', ')
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'course_tags'
    INTO course_tags_columns;
    
    RAISE NOTICE 'course_tags columns: %', course_tags_columns;
    
    -- Get constraint information
    SELECT string_agg(tc.constraint_name || ' (' || tc.constraint_type || ')', ', ')
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public' AND tc.table_name = 'course_tags'
    INTO course_tags_constraints;
    
    RAISE NOTICE 'course_tags constraints: %', course_tags_constraints;
  END IF;
  
  -- Check if course_tag_mappings table exists
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'course_tag_mappings'
  ) INTO mapping_table_exists;
  
  RAISE NOTICE 'course_tag_mappings table exists: %', mapping_table_exists;
END
$$;

-- PART 2: Fix tables directly without using migrations
BEGIN TRANSACTION;

-- First, backup existing data if any
CREATE TEMPORARY TABLE IF NOT EXISTS temp_course_tags AS
SELECT * FROM course_tags WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'course_tags'
);

CREATE TEMPORARY TABLE IF NOT EXISTS temp_course_tag_mappings AS
SELECT * FROM course_tag_mappings WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'course_tag_mappings'
);

-- Drop existing tables to create clean versions
DROP TABLE IF EXISTS course_tag_mappings;
DROP TABLE IF EXISTS course_tags;

-- Create course_tags table with correct structure
CREATE TABLE course_tags (
  tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mapping table with correct structure
CREATE TABLE course_tag_mappings (
  course_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  PRIMARY KEY (course_id, tag_id)
);

-- Add proper foreign key constraints
DO $$
DECLARE
  courses_pk_column TEXT;
BEGIN
  -- Find the primary key column for courses table
  SELECT kc.column_name INTO courses_pk_column
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kc 
      ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
      AND kc.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'courses'
  LIMIT 1;
  
  RAISE NOTICE 'Primary key column for courses table: %', courses_pk_column;
  
  -- Add foreign key constraint dynamically
  IF courses_pk_column IS NOT NULL THEN
    EXECUTE format('
      ALTER TABLE course_tag_mappings 
      ADD CONSTRAINT course_tag_mappings_course_id_fkey 
      FOREIGN KEY (course_id) 
      REFERENCES courses(%I)
      ON DELETE CASCADE
    ', courses_pk_column);
    
    RAISE NOTICE 'Added foreign key constraint from course_tag_mappings to courses';
  ELSE
    RAISE NOTICE 'Could not determine primary key of courses table. Foreign key not added.';
  END IF;
END
$$;

-- Add the second foreign key constraint
ALTER TABLE course_tag_mappings
ADD CONSTRAINT course_tag_mappings_tag_id_fkey
FOREIGN KEY (tag_id)
REFERENCES course_tags(tag_id)
ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_tag_mappings_course_id ON course_tag_mappings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_tag_mappings_tag_id ON course_tag_mappings(tag_id);

-- Restore data if any was backed up
-- Note: This is a best-effort approach and may fail if the original data doesn't match the new schema
-- In that case, you'll need to manually transform the data
BEGIN
  -- Try to restore course_tags data
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'temp_course_tags') THEN
    INSERT INTO course_tags (tag_id, name, slug, created_at)
    SELECT 
      CASE 
        WHEN pg_has_role(current_user, 'rds_superuser', 'member') THEN 
          COALESCE(course_id, uuid_generate_v4()) 
        ELSE 
          uuid_generate_v4()
      END,
      name,
      slug,
      created_at
    FROM temp_course_tags
    ON CONFLICT (name) DO NOTHING;
    
    RAISE NOTICE 'Attempted to restore course_tags data';
  END IF;
  
  -- Try to restore course_tag_mappings data
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'temp_course_tag_mappings') THEN
    -- We can only restore mappings where both foreign keys exist
    INSERT INTO course_tag_mappings (course_id, tag_id)
    SELECT m.course_id, t.tag_id
    FROM temp_course_tag_mappings m
    JOIN course_tags t ON m.tag_id = t.tag_id
    WHERE EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.course_id = m.course_id
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Attempted to restore course_tag_mappings data';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not restore original data: %', SQLERRM;
END;

COMMIT;

-- PART 3: Final verification
DO $$
BEGIN
  RAISE NOTICE 'Final verification of course_tags tables:';
  
  -- Verify course_tags structure
  RAISE NOTICE 'course_tags primary key:';
  FOR r IN (
    SELECT kc.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kc 
        ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
        AND kc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'course_tags'
  ) LOOP
    RAISE NOTICE '  Column: %', r.column_name;
  END LOOP;
  
  -- Verify course_tag_mappings structure
  RAISE NOTICE 'course_tag_mappings foreign keys:';
  FOR r IN (
    SELECT kc.column_name, ccu.table_name as referenced_table, ccu.column_name as referenced_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kc 
        ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
        AND kc.constraint_name = tc.constraint_name
    JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'course_tag_mappings'
  ) LOOP
    RAISE NOTICE '  Column: % references %(%)', r.column_name, r.referenced_table, r.referenced_column;
  END LOOP;
END
$$; 