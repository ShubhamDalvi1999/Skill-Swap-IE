-- Migration to add course categories and update courses table
BEGIN;

-- Create course categories table
CREATE TABLE IF NOT EXISTS course_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id INTEGER REFERENCES course_categories(category_id),
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to courses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE courses ADD COLUMN category_id INTEGER REFERENCES course_categories(category_id);
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON course_categories(parent_category_id);

-- Apply Row Level Security
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_categories' AND rowsecurity = true) THEN
        ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Set RLS policies for course_categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'course_categories' AND policyname = 'Anyone can view course categories'
    ) THEN
        CREATE POLICY "Anyone can view course categories" 
        ON course_categories FOR SELECT 
        USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'course_categories' AND policyname = 'Admins can insert course categories'
    ) THEN
        CREATE POLICY "Admins can insert course categories" 
        ON course_categories FOR INSERT 
        TO authenticated 
        WITH CHECK (EXISTS (
            SELECT 1 FROM users 
            WHERE users.user_id = auth.uid() AND users.is_admin = true
        ));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'course_categories' AND policyname = 'Admins can update course categories'
    ) THEN
        CREATE POLICY "Admins can update course categories" 
        ON course_categories FOR UPDATE 
        TO authenticated 
        USING (EXISTS (
            SELECT 1 FROM users 
            WHERE users.user_id = auth.uid() AND users.is_admin = true
        ));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'course_categories' AND policyname = 'Admins can delete course categories'
    ) THEN
        CREATE POLICY "Admins can delete course categories" 
        ON course_categories FOR DELETE 
        TO authenticated 
        USING (EXISTS (
            SELECT 1 FROM users 
            WHERE users.user_id = auth.uid() AND users.is_admin = true
        ));
    END IF;
END $$;

-- Insert initial category data
INSERT INTO course_categories (name, description, icon_url) VALUES
    ('Programming', 'Courses focused on programming languages and software development', 'https://example.com/icons/programming.png'),
    ('Data Science', 'Courses related to data analysis, statistics, and machine learning', 'https://example.com/icons/data-science.png'),
    ('Design', 'Courses covering UI/UX, graphic design, and creative skills', 'https://example.com/icons/design.png'),
    ('Business', 'Courses on entrepreneurship, marketing, and management', 'https://example.com/icons/business.png'),
    ('IT & Software', 'Courses on networking, systems administration, and IT certification', 'https://example.com/icons/it-software.png')
ON CONFLICT (name) DO NOTHING;

-- Insert subcategories for Programming
INSERT INTO course_categories (name, description, parent_category_id, icon_url) 
SELECT 'Web Development', 'Courses on building websites and web applications', category_id, 'https://example.com/icons/web-dev.png'
FROM course_categories WHERE name = 'Programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO course_categories (name, description, parent_category_id, icon_url) 
SELECT 'Mobile Development', 'Courses on developing mobile applications', category_id, 'https://example.com/icons/mobile-dev.png'
FROM course_categories WHERE name = 'Programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO course_categories (name, description, parent_category_id, icon_url) 
SELECT 'Game Development', 'Courses on game design and development', category_id, 'https://example.com/icons/game-dev.png'
FROM course_categories WHERE name = 'Programming'
ON CONFLICT (name) DO NOTHING;

-- Update existing courses with categories
UPDATE courses SET category_id = (SELECT category_id FROM course_categories WHERE name = 'Web Development')
WHERE course_id IN (
    'c0001111-a111-4b11-9c11-d11e11f11111', -- Modern JavaScript Fundamentals
    'c0002222-a222-4b22-9c22-d22e22f22222', -- React: From Zero to Hero
    'c0003333-a333-4b33-9c33-d33e33f33333', -- Full Stack Development with MERN
    'c0007777-a777-4b77-9c77-d77e77f77777', -- Advanced GraphQL API Development
    'c0008888-a888-4b88-9c88-d88e88f88888'  -- Legacy: jQuery Essentials
);

UPDATE courses SET category_id = (SELECT category_id FROM course_categories WHERE name = 'Data Science')
WHERE course_id IN (
    'c0004444-a444-4b44-9c44-d44e44f44444', -- Introduction to Data Science with Python
    'c0005555-a555-4b55-9c55-d55e55f55555'  -- Machine Learning Fundamentals
);

UPDATE courses SET category_id = (SELECT category_id FROM course_categories WHERE name = 'Design')
WHERE course_id IN (
    'c0006666-a666-4b66-9c66-d66e66f66666'  -- UI/UX Design Principles
);

COMMIT; 