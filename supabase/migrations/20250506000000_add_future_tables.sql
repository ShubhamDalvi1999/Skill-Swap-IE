-- Migration: Add Future Scalability and Feature Tables
-- Description: Adding new tables to support platform growth

BEGIN;

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

-- Enable RLS on new tables
DO $$ 
BEGIN
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
END
$$;

-- RLS Policies for new tables
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

-- Content versions policies
CREATE POLICY "Anyone can view content versions" 
ON content_versions FOR SELECT
USING (true);

CREATE POLICY "Instructors can create content versions for their courses" 
ON content_versions FOR INSERT
WITH CHECK (
    changed_by_user_id = auth.uid() AND
    (source_table = 'courses' OR
     EXISTS (
        SELECT 1 FROM courses c
        JOIN course_instructors ci ON c.course_id = ci.course_id
        WHERE ci.user_id = auth.uid() AND
        (
            (source_table = 'modules' AND EXISTS (
                SELECT 1 FROM modules WHERE module_id = source_id AND course_id = c.course_id
            )) OR
            (source_table = 'lessons' AND EXISTS (
                SELECT 1 FROM lessons l JOIN modules m ON l.module_id = m.module_id
                WHERE l.lesson_id = source_id AND m.course_id = c.course_id
            )) OR
            (source_table = 'quizzes' AND EXISTS (
                SELECT 1 FROM quizzes q JOIN modules m ON q.module_id = m.module_id
                WHERE q.quiz_id = source_id AND m.course_id = c.course_id
            )) OR
            (source_table = 'assignments' AND EXISTS (
                SELECT 1 FROM assignments a JOIN modules m ON a.module_id = m.module_id
                WHERE a.assignment_id = source_id AND m.course_id = c.course_id
            )) OR
            (source_table = 'projects' AND EXISTS (
                SELECT 1 FROM projects WHERE project_id = source_id AND course_id = c.course_id
            ))
        )
    ))
);

-- Platform achievements policies
CREATE POLICY "Anyone can view platform achievements" 
ON platform_achievements FOR SELECT
USING (true);

CREATE POLICY "Admins can manage platform achievements" 
ON platform_achievements FOR ALL
USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid()
    AND is_admin = true
));

-- User achievements policies
CREATE POLICY "Users can view their own achievements" 
ON user_achievements FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view other users' achievements" 
ON user_achievements FOR SELECT
USING (true);

-- User progress details policies
CREATE POLICY "Users can view their own progress details" 
ON user_progress_details FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Instructors can view progress details for their courses" 
ON user_progress_details FOR SELECT
USING (EXISTS (
    SELECT 1 FROM enrollments e
    JOIN courses c ON e.course_id = c.course_id
    JOIN course_instructors ci ON c.course_id = ci.course_id
    WHERE e.enrollment_id = user_progress_details.enrollment_id
    AND ci.user_id = auth.uid()
));

-- Skills policies
CREATE POLICY "Anyone can view skills" 
ON skills FOR SELECT
USING (true);

CREATE POLICY "Admins can manage skills" 
ON skills FOR ALL
USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid()
    AND is_admin = true
));

-- User skills policies
CREATE POLICY "Users can view their own skills" 
ON user_skills FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own skills" 
ON user_skills FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own skills" 
ON user_skills FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view other users' skills" 
ON user_skills FOR SELECT
USING (true);

-- Course skills policies
CREATE POLICY "Anyone can view course skills" 
ON course_skills FOR SELECT
USING (true);

CREATE POLICY "Instructors can manage skills for their courses" 
ON course_skills FOR ALL
USING (EXISTS (
    SELECT 1 FROM course_instructors
    WHERE course_id = course_skills.course_id
    AND user_id = auth.uid()
));

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

COMMIT; 