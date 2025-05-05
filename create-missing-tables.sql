-- Create course_tags table with correct structure
CREATE TABLE IF NOT EXISTS course_tags (
  tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mapping table with correct structure
CREATE TABLE IF NOT EXISTS course_tag_mappings (
  course_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  PRIMARY KEY (course_id, tag_id)
);

-- Add foreign key constraints
ALTER TABLE course_tag_mappings
ADD CONSTRAINT course_tag_mappings_course_id_fkey
FOREIGN KEY (course_id)
REFERENCES courses(id)
ON DELETE CASCADE;

ALTER TABLE course_tag_mappings
ADD CONSTRAINT course_tag_mappings_tag_id_fkey
FOREIGN KEY (tag_id)
REFERENCES course_tags(tag_id)
ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_tag_mappings_course_id ON course_tag_mappings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_tag_mappings_tag_id ON course_tag_mappings(tag_id);

-- Add some sample tags if none exist
INSERT INTO course_tags (name, slug) VALUES
('JavaScript', 'javascript'),
('React', 'react'),
('Node.js', 'nodejs'),
('TypeScript', 'typescript'),
('Frontend', 'frontend')
ON CONFLICT (name) DO NOTHING; 