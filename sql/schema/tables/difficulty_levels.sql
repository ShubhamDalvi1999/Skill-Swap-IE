-- Difficulty Levels Table Definition
-- Reference table for course difficulty levels

CREATE TABLE IF NOT EXISTS difficulty_levels (
    difficulty_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    trophy_type VARCHAR(50) NOT NULL,
    xp_factor INTEGER NOT NULL DEFAULT 1
); 