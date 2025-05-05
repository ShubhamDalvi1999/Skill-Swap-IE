-- Complete rebuild of course_tags tables with proper constraints
-- First, drop the mapping table if it exists (it depends on course_tags)
DROP TABLE IF EXISTS course_tag_mappings;

-- Drop the course_tags table if it exists
DROP TABLE IF EXISTS course_tags;

-- Create course_tags table with proper structure
CREATE TABLE course_tags (
  tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_tag_mappings table with proper structure
CREATE TABLE course_tag_mappings (
  course_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  PRIMARY KEY (course_id, tag_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES course_tags(tag_id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_tag_mappings_course_id ON course_tag_mappings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_tag_mappings_tag_id ON course_tag_mappings(tag_id);

-- Update the prisma schema to match
COMMENT ON TABLE course_tags IS 'Stores tags/categories for courses - Updated structure';
COMMENT ON TABLE course_tag_mappings IS 'Junction table linking courses to tags - Updated structure'; 