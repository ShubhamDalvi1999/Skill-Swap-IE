-- Seed data for trophies
-- Default trophies awarded for course completion

INSERT INTO trophies (name, description) VALUES
    ('Bronze Trophy', 'Awarded for completing a Beginner-level course'),
    ('Silver Trophy', 'Awarded for completing an Intermediate-level course'),
    ('Gold Trophy', 'Awarded for completing an Advanced-level course')
ON CONFLICT (name) DO NOTHING; 