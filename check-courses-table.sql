-- Check if courses table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'courses'
) AS "courses_table_exists";

-- Get column information for the courses table if it exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses';

-- Try to identify the primary key
SELECT
    tc.table_schema, 
    tc.table_name, 
    kc.column_name 
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kc 
        ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
        AND kc.constraint_name = tc.constraint_name
WHERE
    tc.constraint_type = 'PRIMARY KEY' 
    AND tc.table_name = 'courses';

-- List all tables in the public schema (for reference)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name; 