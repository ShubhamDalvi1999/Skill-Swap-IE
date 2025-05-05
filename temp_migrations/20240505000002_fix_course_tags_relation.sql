-- Fix course_tags table and relationships
DO $$
DECLARE
  courses_pk_column TEXT;
  tags_pk_column TEXT;
  tag_id_exists BOOLEAN;
BEGIN
  -- Get primary key column name for courses table
  SELECT kc.column_name INTO courses_pk_column
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kc 
      ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
      AND kc.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'courses'
  LIMIT 1;
  
  RAISE NOTICE 'Primary key column for courses table: %', courses_pk_column;
  
  -- Check if course_tags table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'course_tags'
  ) THEN
    -- Get primary key column name for course_tags table
    SELECT kc.column_name INTO tags_pk_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kc 
      ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
      AND kc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'course_tags'
    LIMIT 1;
    
    RAISE NOTICE 'Primary key column for course_tags table: %', tags_pk_column;
    
    -- If no primary key is found, check if any column named 'id' or 'tag_id' exists
    IF tags_pk_column IS NULL THEN
      -- Check if id column exists
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'course_tags' AND column_name = 'id'
      ) INTO tag_id_exists;
      
      IF tag_id_exists THEN
        RAISE NOTICE 'Column ''id'' exists in course_tags but is not a primary key. Adding primary key constraint.';
        ALTER TABLE course_tags DROP CONSTRAINT IF EXISTS course_tags_pkey;
        ALTER TABLE course_tags ADD PRIMARY KEY (id);
        tags_pk_column := 'id';
      ELSE
        -- Check if tag_id column exists
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'course_tags' AND column_name = 'tag_id'
        ) INTO tag_id_exists;
        
        IF tag_id_exists THEN
          RAISE NOTICE 'Column ''tag_id'' exists in course_tags. Adding primary key constraint.';
          ALTER TABLE course_tags DROP CONSTRAINT IF EXISTS course_tags_pkey;
          ALTER TABLE course_tags ADD PRIMARY KEY (tag_id);
          tags_pk_column := 'tag_id';
        ELSE
          -- If neither column exists, add id column
          RAISE NOTICE 'Adding new id column to course_tags table';
          ALTER TABLE course_tags ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
          tags_pk_column := 'id';
        END IF;
      END IF;
    END IF;

    -- Fix the foreign keys in the mapping table if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'course_tag_mappings'
    ) THEN
      -- Fix course_id foreign key
      IF courses_pk_column IS NOT NULL THEN
        ALTER TABLE course_tag_mappings DROP CONSTRAINT IF EXISTS course_tag_mappings_course_id_fkey;
        
        EXECUTE format('
          ALTER TABLE course_tag_mappings 
          ADD CONSTRAINT course_tag_mappings_course_id_fkey 
          FOREIGN KEY (course_id) 
          REFERENCES courses(%I)
          ON DELETE CASCADE
        ', courses_pk_column);
        
        RAISE NOTICE 'Fixed foreign key constraint from course_tag_mappings to courses';
      END IF;
      
      -- Fix tag_id foreign key
      IF tags_pk_column IS NOT NULL THEN
        ALTER TABLE course_tag_mappings DROP CONSTRAINT IF EXISTS course_tag_mappings_tag_id_fkey;
        
        EXECUTE format('
          ALTER TABLE course_tag_mappings 
          ADD CONSTRAINT course_tag_mappings_tag_id_fkey 
          FOREIGN KEY (tag_id) 
          REFERENCES course_tags(%I)
          ON DELETE CASCADE
        ', tags_pk_column);
        
        RAISE NOTICE 'Fixed foreign key constraint from course_tag_mappings to course_tags';
      ELSE
        RAISE NOTICE 'Could not determine or create primary key for course_tags. Foreign key not added.';
      END IF;
    ELSE
      RAISE NOTICE 'course_tag_mappings table does not exist, skipping foreign key fixes';
    END IF;
  ELSE
    RAISE NOTICE 'course_tags table does not exist, skipping';
  END IF;
END
$$; 