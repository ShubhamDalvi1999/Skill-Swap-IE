-- Indexes for the courses table
-- Improves query performance for common lookups

-- Index on status for filtering published courses (most common query)
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- Index on difficulty_level for filtering by level
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty_level);

-- Combined index for sorting by creation date and status
CREATE INDEX IF NOT EXISTS idx_courses_status_date ON courses(status, created_date DESC); 