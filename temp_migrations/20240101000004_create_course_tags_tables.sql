-- Create the course_tags table if it doesn't exist
DO $$
DECLARE
  tags_pk_column TEXT;
BEGIN
  -- Only create the table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'course_tags'
  ) THEN
    CREATE TABLE "course_tags" (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" TEXT NOT NULL UNIQUE,
      "slug" TEXT UNIQUE,
      "created_at" TIMESTAMPTZ DEFAULT NOW()
    );
    RAISE NOTICE 'Created course_tags table with id as primary key';
  ELSE
    -- If the table already exists, find out what its primary key is
    SELECT kc.column_name INTO tags_pk_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kc 
        ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
        AND kc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'course_tags'
    LIMIT 1;
    
    RAISE NOTICE 'course_tags table already exists with primary key column: %', tags_pk_column;
  END IF;
END
$$;

-- Add a comment to document the table
COMMENT ON TABLE "course_tags" IS 'Stores tags/categories for courses';

-- Create the course_tag_mappings junction table
CREATE TABLE IF NOT EXISTS "course_tag_mappings" (
  "course_id" UUID NOT NULL,
  "tag_id" UUID NOT NULL,
  PRIMARY KEY ("course_id", "tag_id")
);

-- Add a comment to document the table
COMMENT ON TABLE "course_tag_mappings" IS 'Junction table linking courses to tags';

-- Add foreign key constraints
DO $$
DECLARE
  tags_pk_column TEXT;
BEGIN
  -- Find out what the primary key is for the course_tags table
  SELECT kc.column_name INTO tags_pk_column
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kc 
      ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
      AND kc.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'course_tags'
  LIMIT 1;
  
  RAISE NOTICE 'Primary key column for course_tags table: %', tags_pk_column;
  
  -- Add course_id foreign key
  ALTER TABLE course_tag_mappings 
  DROP CONSTRAINT IF EXISTS course_tag_mappings_course_id_fkey;

  ALTER TABLE course_tag_mappings
  ADD CONSTRAINT course_tag_mappings_course_id_fkey
  FOREIGN KEY (course_id)
  REFERENCES courses(course_id)
  ON DELETE CASCADE;
  
  -- Only add tag_id foreign key if we found a primary key
  IF tags_pk_column IS NOT NULL THEN
    ALTER TABLE course_tag_mappings
    DROP CONSTRAINT IF EXISTS course_tag_mappings_tag_id_fkey;

    EXECUTE format('
      ALTER TABLE course_tag_mappings
      ADD CONSTRAINT course_tag_mappings_tag_id_fkey
      FOREIGN KEY (tag_id)
      REFERENCES course_tags(%I)
      ON DELETE CASCADE
    ', tags_pk_column);
    
    RAISE NOTICE 'Added foreign key constraint from tag_id to course_tags(%)', tags_pk_column;
  ELSE
    RAISE NOTICE 'Could not determine primary key of course_tags table. Foreign key not added.';
  END IF;
END
$$; 