-- Create the course_modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS "course_modules" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "course_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "duration" INTEGER DEFAULT 0,
  "order_index" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "idx_course_modules_course_id" ON "course_modules"("course_id");

-- Add a comment to document the table
COMMENT ON TABLE "course_modules" IS 'Stores modules belonging to courses';

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
    WHERE tgname = 'update_course_modules_timestamp'
  ) THEN
    CREATE TRIGGER update_course_modules_timestamp
    BEFORE UPDATE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END
$$; 