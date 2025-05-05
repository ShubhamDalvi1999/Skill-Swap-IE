-- Main file for loading all database indexes
-- Indexes improve query performance

-- User-related indexes
\i 'schema/indexes/users_indexes.sql'

-- Course-related indexes
\i 'schema/indexes/courses_indexes.sql'

-- Other indexes
-- Add more as needed 