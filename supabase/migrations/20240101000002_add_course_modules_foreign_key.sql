-- Add the foreign key constraint between course_modules and courses
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
            ALTER TABLE course_modules 
            ADD CONSTRAINT course_modules_course_id_fkey 
            FOREIGN KEY (course_id) 
            REFERENCES courses(%I) 
            ON DELETE CASCADE
        ', pk_column);
        
        RAISE NOTICE 'Foreign key constraint added successfully';
    ELSE
        RAISE NOTICE 'Could not determine primary key of courses table. Foreign key not added.';
    END IF;
END
$$; 