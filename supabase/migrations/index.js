/**
 * Supabase Migration Index
 * 
 * This file lists all migrations in the order they should be executed.
 * Migrations are applied in ascending order by timestamp.
 */

const migrations = [
  // Initial schema - creates base tables and relationships
  '20230101000000_initial_schema.sql',
  
  // Adding course categories
  '20230601000000_add_course_categories.sql',
  
  // Comprehensive seed data
  '20230701000000_seed_data.sql',
  
  // Row Level Security policies
  '20250505000000_add_rls_policies.sql',
  
  // Additional seed data
  '20250505160711_seed_data.sql',
  
  // Future scalability tables
  '20250506000000_add_future_tables.sql',
  
  // Seed data for future tables
  '20250506100000_seed_future_tables.sql',
];

module.exports = migrations; 