-- Seed data for difficulty levels
-- These are the default difficulty levels for courses

INSERT INTO difficulty_levels (name, trophy_type, xp_factor) VALUES
    ('Beginner', 'Bronze', 1),
    ('Intermediate', 'Silver', 2),
    ('Advanced', 'Gold', 3)
ON CONFLICT (name) DO NOTHING; 