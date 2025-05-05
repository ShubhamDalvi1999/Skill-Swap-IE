-- Migration: Seed Data
-- Description: Initial seed data for application

-- Make all seed operations idempotent with ON CONFLICT clauses
BEGIN;

-- Basic reference data (safe to run on all environments)
INSERT INTO difficulty_levels (name, trophy_type, xp_factor) VALUES
    ('Beginner', 'Bronze', 1),
    ('Intermediate', 'Silver', 2),
    ('Advanced', 'Gold', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO trophies (name, description) VALUES
    ('Bronze Trophy', 'Awarded for completing a Beginner-level course'),
    ('Silver Trophy', 'Awarded for completing an Intermediate-level course'),
    ('Gold Trophy', 'Awarded for completing an Advanced-level course')
ON CONFLICT (name) DO NOTHING;

-- Demo/test data (may want to skip in production)
-- Can use conditional logic for different environments
DO $$
BEGIN
    -- Only run in development/test environments
    IF current_setting('app.environment', true) = 'development' OR 
       current_setting('app.environment', true) = 'test' THEN
        
        -- Demo user accounts
        INSERT INTO users (user_id, email, name, password_hash, is_admin)
        VALUES 
            ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin User', '********', true),
            ('22222222-2222-2222-2222-222222222222', 'instructor@example.com', 'Instructor User', '********', false)
        ON CONFLICT (user_id) DO NOTHING;
        
        -- Other demo data...
        
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        -- Handle case where app.environment isn't set
        RAISE NOTICE 'app.environment not set, skipping development seed data';
END;
$$;

COMMIT;