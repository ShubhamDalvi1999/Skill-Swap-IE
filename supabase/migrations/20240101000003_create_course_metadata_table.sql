-- Create the course_metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS "course_metadata" (
  "course_id" UUID PRIMARY KEY,
  "requirements" TEXT[] DEFAULT '{}',
  "learning_objectives" TEXT[] DEFAULT '{}',
  "target_audience" TEXT[] DEFAULT '{}',
  "prerequisites" TEXT[] DEFAULT '{}',
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Add a comment to document the table
COMMENT ON TABLE "course_metadata" IS 'Stores additional metadata for courses';

-- Add foreign key constraint to courses
DO $$
DECLARE
    pk_column VARCHAR;
BEGIN
    -- First, check what's the primary key on courses table
    SELECT kc.column_name INTO pk_column
    FROM 
        information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kc 
            ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
            AND kc.constraint_name = tc.constraint_name
    WHERE
        tc.constraint_type = 'PRIMARY KEY' 
        AND tc.table_name = 'courses'
    LIMIT 1;

    -- Output the primary key column name for debugging
    RAISE NOTICE 'Primary key column for courses table: %', pk_column;

    -- Add the foreign key based on the primary key we found
    IF pk_column IS NOT NULL THEN
        EXECUTE format('
            ALTER TABLE course_metadata 
            ADD CONSTRAINT course_metadata_course_id_fkey 
            FOREIGN KEY (course_id) 
            REFERENCES courses(%I) 
            ON DELETE CASCADE
        ', pk_column);
        
        RAISE NOTICE 'Foreign key constraint added successfully for course_metadata';
    ELSE
        RAISE NOTICE 'Could not determine primary key of courses table. Foreign key not added for course_metadata.';
    END IF;
END
$$;

-- Add update trigger for updated_at
CREATE OR REPLACE FUNCTION update_timestamp() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_course_metadata_timestamp'
  ) THEN
    CREATE TRIGGER update_course_metadata_timestamp
    BEFORE UPDATE ON course_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END
$$; 