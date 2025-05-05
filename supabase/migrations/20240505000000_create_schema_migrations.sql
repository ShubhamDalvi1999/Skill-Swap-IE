-- Create the schema_migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  statements text,
  name text
); 