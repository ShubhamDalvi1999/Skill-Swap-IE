-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token';

-- Create database schema for Skill-Swap Learning Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
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

-- Create auth schema triggers for users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, email, name, password_hash)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', '**********');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a user record when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Difficulty Levels
CREATE TABLE IF NOT EXISTS difficulty_levels (
    difficulty_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    trophy_type VARCHAR(50) NOT NULL,
    xp_factor INTEGER NOT NULL DEFAULT 1
);

-- Insert default difficulty levels
INSERT INTO difficulty_levels (name, trophy_type, xp_factor) VALUES
    ('Beginner', 'Bronze', 1),
    ('Intermediate', 'Silver', 2),
    ('Advanced', 'Gold', 3)
ON CONFLICT (name) DO NOTHING;

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

-- Insert initial categories
INSERT INTO course_categories (name, description, icon_url) VALUES
    ('Programming', 'Courses focused on programming languages and software development', 'https://example.com/icons/programming.png'),
    ('Data Science', 'Courses related to data analysis, statistics, and machine learning', 'https://example.com/icons/data-science.png'),
    ('Design', 'Courses covering UI/UX, graphic design, and creative skills', 'https://example.com/icons/design.png'),
    ('Business', 'Courses on entrepreneurship, marketing, and management', 'https://example.com/icons/business.png'),
    ('IT & Software', 'Courses on networking, systems administration, and IT certification', 'https://example.com/icons/it-software.png')
ON CONFLICT (name) DO NOTHING;

-- Courses Table
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

-- Course Instructors (Join Table)
CREATE TABLE IF NOT EXISTS course_instructors (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, course_id)
);

-- Modules Table
CREATE TABLE IF NOT EXISTS modules (
    module_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    UNIQUE (course_id, position)
);

-- Lessons Table
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

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE UNIQUE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    max_score INTEGER NOT NULL DEFAULT 100
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'multiple_choice',
    points INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL,
    UNIQUE (quiz_id, position)
);

-- Quiz Options
CREATE TABLE IF NOT EXISTS quiz_options (
    option_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER NOT NULL,
    UNIQUE (question_id, position)
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    points INTEGER NOT NULL DEFAULT 100
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL DEFAULT 200
);

-- Trophies Table
CREATE TABLE IF NOT EXISTS trophies (
    trophy_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon_image TEXT,
    description TEXT
);

-- Insert default trophies
INSERT INTO trophies (name, description) VALUES
    ('Bronze Trophy', 'Awarded for completing a Beginner-level course'),
    ('Silver Trophy', 'Awarded for completing an Intermediate-level course'),
    ('Gold Trophy', 'Awarded for completing an Advanced-level course')
ON CONFLICT (name) DO NOTHING;

-- Enrollments Table
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

-- User Trophies (Join Table)
CREATE TABLE IF NOT EXISTS user_trophies (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    trophy_id INTEGER REFERENCES trophies(trophy_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, course_id)
);

-- User Module Completion
CREATE TABLE IF NOT EXISTS user_module_completion (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(module_id) ON DELETE CASCADE,
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, module_id)
);

-- User Lesson View
CREATE TABLE IF NOT EXISTS user_lesson_view (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    viewed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, lesson_id)
);

-- User Quiz Attempts
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_passed BOOLEAN DEFAULT FALSE
);

-- User Quiz Answers
CREATE TABLE IF NOT EXISTS user_quiz_answers (
    answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES user_quiz_attempts(attempt_id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    option_id UUID REFERENCES quiz_options(option_id) ON DELETE CASCADE,
    text_answer TEXT,
    is_correct BOOLEAN
);

-- User Assignment Submissions
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

-- User Project Submissions
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

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Course Tags (Join Table)
CREATE TABLE IF NOT EXISTS course_tags (
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, tag_id)
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_code VARCHAR(50) UNIQUE,
    certificate_url TEXT,
    UNIQUE (user_id, course_id)
);

-- Course Ratings Table
CREATE TABLE IF NOT EXISTS course_ratings (
    rating_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    rating_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

-- Instructor Ratings Table
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

-- Student Ratings Table
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

-- Token System Tables

-- User Tokens Table
CREATE TABLE IF NOT EXISTS user_tokens (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    token_balance INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token Transactions Table
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

-- Create a trigger to auto-update user_tokens when a transaction occurs
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

-- Course Access Purchases
CREATE TABLE IF NOT EXISTS course_access_purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    tokens_spent INTEGER NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Future Scalability Tables

-- Activity Log Table
CREATE TABLE IF NOT EXISTS user_activity_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    source_table VARCHAR(50),
    source_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON user_activity_logs(created_at);

-- Notifications Table
CREATE TABLE IF NOT EXISTS user_notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    source_table VARCHAR(50),
    source_id UUID,
    content TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON user_notifications(created_at);

-- Messages and Conversations Tables
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    participant2_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE SET NULL,
    last_message_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant1_id, participant2_id, course_id)
);

CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_course ON conversations(course_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent ON messages(sent_at);

-- Content Versions Table
CREATE TABLE IF NOT EXISTS content_versions (
    version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_table VARCHAR(50) NOT NULL,
    source_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    changed_by_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    content_snapshot JSONB NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_table, source_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_content_versions_source ON content_versions(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_user ON content_versions(changed_by_user_id);

-- Platform Achievements Tables
CREATE TABLE IF NOT EXISTS platform_achievements (
    achievement_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_image TEXT,
    criteria JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES platform_achievements(achievement_id) ON DELETE CASCADE,
    date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- User Progress Details Table
CREATE TABLE IF NOT EXISTS user_progress_details (
    progress_detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_details_enrollment ON user_progress_details(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_progress_details_user ON user_progress_details(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_details_content ON user_progress_details(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_progress_details_status ON user_progress_details(status);

-- Skills System Tables
CREATE TABLE IF NOT EXISTS skills (
    skill_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_skill_id INTEGER REFERENCES skills(skill_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(skill_id) ON DELETE CASCADE,
    skill_level VARCHAR(20) DEFAULT 'beginner',
    is_teaching BOOLEAN DEFAULT FALSE,
    is_learning BOOLEAN DEFAULT FALSE,
    proficiency INTEGER DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS course_skills (
    course_skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(skill_id) ON DELETE CASCADE,
    skill_level VARCHAR(20) DEFAULT 'beginner',
    relevance INTEGER DEFAULT 3 CHECK (relevance BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_skills_parent ON skills(parent_skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_course_skills_course ON course_skills(course_id);
CREATE INDEX IF NOT EXISTS idx_course_skills_skill ON course_skills(skill_id);

-- Initial platform achievements
INSERT INTO platform_achievements (name, description, icon_image, criteria) VALUES
    ('Early Adopter', 'One of the first 100 users to join the platform', 'https://example.com/icons/early_adopter.png', '{"user_count": 100}'),
    ('Course Creator', 'Created your first course', 'https://example.com/icons/course_creator.png', '{"min_courses": 1}'),
    ('Knowledge Seeker', 'Enrolled in 5 different courses', 'https://example.com/icons/knowledge_seeker.png', '{"min_enrollments": 5}'),
    ('Perfect Score', 'Achieved 100% on a course quiz', 'https://example.com/icons/perfect_score.png', '{"quiz_score": 100}'),
    ('Super Learner', 'Completed 10 courses', 'https://example.com/icons/super_learner.png', '{"completed_courses": 10}'),
    ('Discussion Starter', 'Created 5 forum topics', 'https://example.com/icons/discussion_starter.png', '{"forum_topics": 5}'),
    ('Helpful Contributor', 'Replied to 10 forum topics', 'https://example.com/icons/helpful_contributor.png', '{"forum_replies": 10}')
ON CONFLICT (name) DO NOTHING;

-- Initial skills
INSERT INTO skills (name, description) VALUES
    ('JavaScript', 'Programming language for web development'),
    ('Python', 'General-purpose programming language'),
    ('React', 'JavaScript library for building user interfaces'),
    ('Data Analysis', 'Process of inspecting and modeling data'),
    ('Machine Learning', 'Study of algorithms that improve through experience'),
    ('UI/UX Design', 'Design of user interfaces and experiences'),
    ('DevOps', 'Practices combining software development and IT operations'),
    ('Cloud Computing', 'On-demand delivery of IT resources over the internet'),
    ('SQL', 'Language for managing relational databases'),
    ('GraphQL', 'API query language and runtime')
ON CONFLICT (name) DO NOTHING;

-- Add Row Level Security (RLS) policies
-- Allow authenticated users to read anything
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_skills ENABLE ROW LEVEL SECURITY;
-- Add more tables as needed

-- Policy for users table
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for courses
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can edit their own courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM course_instructors ci 
            WHERE ci.course_id = courses.course_id 
            AND ci.user_id = auth.uid()
        )
    );

-- New RLS Policies for the new tables
-- Activity Logs policies
CREATE POLICY "Users can view their own activity logs" 
ON user_activity_logs FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity logs" 
ON user_activity_logs FOR ALL
USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid()
    AND is_admin = true
));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON user_notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON user_notifications FOR UPDATE
USING (user_id = auth.uid());

-- Conversations and messages policies
CREATE POLICY "Users can view their own conversations" 
ON conversations FOR SELECT
USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can create conversations they're part of" 
ON conversations FOR INSERT
WITH CHECK (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can view messages from their conversations" 
ON messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversation_id = messages.conversation_id
    AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
));

CREATE POLICY "Users can send messages in their conversations" 
ON messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM conversations
        WHERE conversation_id = messages.conversation_id
        AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
    )
);

-- Add more RLS policies as needed 