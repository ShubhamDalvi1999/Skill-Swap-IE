-- Main file for loading all Row Level Security (RLS) policies

-- Enable RLS on tables that need it
\i 'schema/policies/enable_rls.sql'

-- User table policies
\i 'schema/policies/users_policies.sql'

-- Course table policies
\i 'schema/policies/courses_policies.sql'

-- Other table policies
-- \i 'schema/policies/module_policies.sql'
-- \i 'schema/policies/lesson_policies.sql'
-- Add more policy files as needed 