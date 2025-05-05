-- Diagnostic SQL to output table and key information
DO $$
DECLARE
  table_record RECORD;
  column_record RECORD;
  constraint_record RECORD;
BEGIN
  RAISE NOTICE '======= DATABASE DIAGNOSTIC INFORMATION =======';
  
  -- List tables
  RAISE NOTICE 'TABLES:';
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  LOOP
    RAISE NOTICE 'Table: %', table_record.table_name;
    
    -- List columns for each table
    RAISE NOTICE '  Columns:';
    FOR column_record IN 
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = table_record.table_name
      ORDER BY ordinal_position
    LOOP
      RAISE NOTICE '    % (% %)', 
        column_record.column_name, 
        column_record.data_type,
        CASE WHEN column_record.is_nullable = 'NO' THEN 'NOT NULL' ELSE 'NULL' END;
    END LOOP;
    
    -- List constraints for each table
    RAISE NOTICE '  Constraints:';
    FOR constraint_record IN
      SELECT tc.constraint_name, tc.constraint_type, kcu.column_name,
             ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_schema = 'public' AND tc.table_name = table_record.table_name
      ORDER BY tc.constraint_type, tc.constraint_name
    LOOP
      IF constraint_record.constraint_type = 'PRIMARY KEY' THEN
        RAISE NOTICE '    PK: % (column: %)', 
          constraint_record.constraint_name, constraint_record.column_name;
      ELSIF constraint_record.constraint_type = 'FOREIGN KEY' THEN
        RAISE NOTICE '    FK: % (column: % references %(%)))', 
          constraint_record.constraint_name, 
          constraint_record.column_name,
          constraint_record.foreign_table_name,
          constraint_record.foreign_column_name;
      ELSE
        RAISE NOTICE '    %: % (column: %)', 
          constraint_record.constraint_type, 
          constraint_record.constraint_name, 
          constraint_record.column_name;
      END IF;
    END LOOP;
    
    RAISE NOTICE '';
  END LOOP;
  
  RAISE NOTICE '======= END DIAGNOSTIC INFORMATION =======';
END
$$; 