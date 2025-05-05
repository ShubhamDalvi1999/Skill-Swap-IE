-- Main file for loading all seed data
-- This populates the database with initial reference data

-- Default data for system tables
\i 'schema/seeds/difficulty_levels_seed.sql'
\i 'schema/seeds/trophies_seed.sql'

-- Demo data (optional, only for development)
-- \i 'schema/seeds/demo_users.sql'
-- \i 'schema/seeds/demo_courses.sql' 