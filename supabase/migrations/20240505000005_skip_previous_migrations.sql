-- This migration simply marks previous migrations as applied to avoid running them again
-- It's safe to run this since the direct fix script has already applied the necessary changes

-- Mark previous migrations as already applied
INSERT INTO schema_migrations (version, statements)
VALUES 
  ('20240101000004', 'Skipped - Applied directly via SQL script'),
  ('20240505000001', 'Skipped - Applied directly via SQL script'),
  ('20240505000002', 'Skipped - Applied directly via SQL script'),
  ('20240505000003', 'Skipped - Applied directly via SQL script'),
  ('20240505000004', 'Skipped - Applied directly via SQL script')
ON CONFLICT (version) DO NOTHING; 