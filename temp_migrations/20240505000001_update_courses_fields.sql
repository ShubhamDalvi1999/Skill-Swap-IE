-- Add missing fields to courses table
DO $$
BEGIN
  -- Add is_featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE courses ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;
    RAISE NOTICE 'Added is_featured column to courses table';
  END IF;

  -- Add slug column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'slug'
  ) THEN
    ALTER TABLE courses ADD COLUMN slug TEXT UNIQUE;
    RAISE NOTICE 'Added slug column to courses table';
  END IF;

  -- Add missing fields for alignment with Prisma schema
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'price'
  ) THEN
    ALTER TABLE courses ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0;
    RAISE NOTICE 'Added price column to courses table';
  END IF;

  -- Update column names if they don't match
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'thumbnail_url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'thumbnail'
  ) THEN
    ALTER TABLE courses RENAME COLUMN thumbnail_url TO thumbnail;
    RAISE NOTICE 'Renamed thumbnail_url to thumbnail in courses table';
  END IF;

  -- Create indexes for better performance
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'courses' AND indexname = 'idx_courses_slug'
  ) THEN
    CREATE INDEX idx_courses_slug ON courses(slug);
    RAISE NOTICE 'Created index on courses.slug';
  END IF;

  -- Add timestamp fields if they're missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE courses ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column to courses table';
  END IF;
END
$$; 