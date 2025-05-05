-- Diagnostic queries to check table structure

-- Check courses table primary key
SELECT kc.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kc 
    ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema
    AND kc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = 'courses';

-- Check if course_tags table exists and its columns
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'course_tags';

-- Check if course_tag_mappings table exists and its columns
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'course_tag_mappings'; 