-- Main Supabase Schema Setup File
-- This file orchestrates the loading of all schema components

-- Enable necessary extensions
\i 'schema/extensions.sql'

-- Load table definitions
\i 'schema/tables/_tables.sql'

-- Load functions
\i 'schema/functions/_functions.sql'

-- Load indexes
\i 'schema/indexes/_indexes.sql'

-- Load policies for Row Level Security
\i 'schema/policies/_policies.sql'

-- Load seed data
\i 'schema/seeds/_seeds.sql'

-- Verify setup
SELECT 'Schema setup completed successfully!' AS result; 