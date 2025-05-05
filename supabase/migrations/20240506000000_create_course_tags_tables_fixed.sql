-- First, check if these tables exist and drop them to create fresh versions
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
  
  RAISE NOTICE 'Courses table primary key column is: %', courses_pk_column;
  
  -- Drop existing tables if they exist
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
  
  -- Add foreign key constraints - courses primary key is 'course_id'
  ALTER TABLE course_tag_mappings
  ADD CONSTRAINT course_tag_mappings_course_id_fkey
  FOREIGN KEY (course_id)
  REFERENCES courses(course_id)
  ON DELETE CASCADE;
  
  ALTER TABLE course_tag_mappings
  ADD CONSTRAINT course_tag_mappings_tag_id_fkey
  FOREIGN KEY (tag_id)
  REFERENCES course_tags(tag_id)
  ON DELETE CASCADE;
  
  -- Create indexes for better performance
  CREATE INDEX idx_course_tag_mappings_course_id ON course_tag_mappings(course_id);
  CREATE INDEX idx_course_tag_mappings_tag_id ON course_tag_mappings(tag_id);
  
  -- Add some sample tags
  INSERT INTO course_tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('Node.js', 'nodejs'),
  ('TypeScript', 'typescript'),
  ('Frontend', 'frontend')
  ON CONFLICT (name) DO NOTHING;
  
  RAISE NOTICE 'Successfully created course_tags and course_tag_mappings tables';
END
$$; 