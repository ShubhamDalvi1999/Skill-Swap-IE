-- Initial schema migration for Supabase
-- This migration runs the setup.sql file which orchestrates all schema components

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
-- The following line is commented out because Supabase doesn't allow setting JWT secrets via SQL
-- JWT secrets should be managed via the Supabase dashboard instead
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token';

-- Core tables first
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_info JSONB DEFAULT '{}'::jsonb,
    total_xp INTEGER DEFAULT 0, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS difficulty_levels (
    difficulty_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    trophy_type VARCHAR(50) NOT NULL,
    xp_factor INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS trophies (
    trophy_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon_image TEXT,
    description TEXT
);

-- Course Categories Table
CREATE TABLE IF NOT EXISTS course_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id INTEGER REFERENCES course_categories(category_id),
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level INTEGER REFERENCES difficulty_levels(difficulty_id),
    category_id INTEGER REFERENCES course_categories(category_id),
    xp_points INTEGER NOT NULL DEFAULT 100,
    launch_token_cost INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    thumbnail_url TEXT
);

CREATE TABLE IF NOT EXISTS course_instructors (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS modules (
    module_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    UNIQUE (course_id, position)
);

CREATE TABLE IF NOT EXISTS lessons (
    lesson_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_url TEXT,
    content_text TEXT,
    position INTEGER NOT NULL,
    UNIQUE (module_id, position)
);

CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    max_score INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'multiple_choice',
    points INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL,
    UNIQUE (quiz_id, position)
);

CREATE TABLE IF NOT EXISTS quiz_options (
    option_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER NOT NULL,
    UNIQUE (question_id, position)
);

CREATE TABLE IF NOT EXISTS assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    points INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL DEFAULT 200
);

-- User progress and data tables
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    enroll_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_percent REAL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'dropped')),
    completed_date TIMESTAMP WITH TIME ZONE,
    final_score INTEGER,
    trophy_earned INTEGER REFERENCES trophies(trophy_id),
    tokens_spent INTEGER DEFAULT 0,
    UNIQUE (student_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_trophies (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    trophy_id INTEGER REFERENCES trophies(trophy_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_module_completion (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE,
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, module_id)
);

CREATE TABLE IF NOT EXISTS user_lesson_view (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    viewed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_passed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_quiz_answers (
    answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES user_quiz_attempts(attempt_id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    option_id UUID REFERENCES quiz_options(option_id) ON DELETE CASCADE,
    text_answer TEXT,
    is_correct BOOLEAN
);

CREATE TABLE IF NOT EXISTS user_assignment_submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER,
    feedback TEXT,
    UNIQUE (user_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS user_project_submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER,
    feedback TEXT,
    UNIQUE (user_id, project_id)
);

-- Tagging system
CREATE TABLE IF NOT EXISTS tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS course_tags (
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, tag_id)
);

-- Certificate system
CREATE TABLE IF NOT EXISTS certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_code VARCHAR(50) UNIQUE,
    certificate_url TEXT,
    UNIQUE (user_id, course_id)
);

-- Rating systems
CREATE TABLE IF NOT EXISTS course_ratings (
    rating_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    rating_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

CREATE TABLE IF NOT EXISTS instructor_ratings (
    instructor_rating_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    rating_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (student_id, instructor_id, course_id)
);

CREATE TABLE IF NOT EXISTS student_ratings (
    student_rating_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    rating_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (instructor_id, student_id, course_id)
);

-- Token system
CREATE TABLE IF NOT EXISTS user_tokens (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    token_balance INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount <> 0),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'gift', 'refund', 'reward')),
    source_type VARCHAR(50),
    source_id UUID,
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_access_purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    tokens_spent INTEGER NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, email, name, password_hash)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', '**********');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auth user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function and trigger for token transactions
CREATE OR REPLACE FUNCTION update_user_token_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a record if it doesn't exist
    INSERT INTO user_tokens (user_id, token_balance, last_updated)
    VALUES (NEW.user_id, 0, NOW())
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update the balance
    UPDATE user_tokens
    SET token_balance = token_balance + NEW.amount,
        last_updated = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_token_balance_update
AFTER INSERT ON token_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_token_balance();

-- NOTE: RLS policies have been moved to the dedicated RLS migration file (20250505000000_add_rls_policies.sql)
-- This avoids duplication and ensures policies are created in an idempotent way

-- Insert seed data for difficulty levels
INSERT INTO difficulty_levels (name, trophy_type, xp_factor) VALUES
    ('Beginner', 'Bronze', 1),
    ('Intermediate', 'Silver', 2),
    ('Advanced', 'Gold', 3)
ON CONFLICT (name) DO NOTHING;

-- Insert seed data for trophies
INSERT INTO trophies (name, description) VALUES
    ('Bronze Trophy', 'Awarded for completing a Beginner-level course'),
    ('Silver Trophy', 'Awarded for completing an Intermediate-level course'),
    ('Gold Trophy', 'Awarded for completing an Advanced-level course')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(user_id) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_status_date ON courses(status, created_date DESC); 