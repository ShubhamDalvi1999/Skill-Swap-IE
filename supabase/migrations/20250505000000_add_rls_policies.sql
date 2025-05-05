-- Migration: Add RLS policies and helper functions
-- Date: 2025-05-05

-- Enable Row Level Security on all tables if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND rowsecurity = true) THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'courses' AND rowsecurity = true) THEN
    ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'modules' AND rowsecurity = true) THEN
    ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'lessons' AND rowsecurity = true) THEN
    ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'quizzes' AND rowsecurity = true) THEN
    ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'quiz_questions' AND rowsecurity = true) THEN
    ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'quiz_options' AND rowsecurity = true) THEN
    ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'assignments' AND rowsecurity = true) THEN
    ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'projects' AND rowsecurity = true) THEN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'enrollments' AND rowsecurity = true) THEN
    ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_trophies' AND rowsecurity = true) THEN
    ALTER TABLE user_trophies ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_module_completion' AND rowsecurity = true) THEN
    ALTER TABLE user_module_completion ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_lesson_view' AND rowsecurity = true) THEN
    ALTER TABLE user_lesson_view ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_quiz_attempts' AND rowsecurity = true) THEN
    ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_quiz_answers' AND rowsecurity = true) THEN
    ALTER TABLE user_quiz_answers ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_assignment_submissions' AND rowsecurity = true) THEN
    ALTER TABLE user_assignment_submissions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_project_submissions' AND rowsecurity = true) THEN
    ALTER TABLE user_project_submissions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_ratings' AND rowsecurity = true) THEN
    ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'instructor_ratings' AND rowsecurity = true) THEN
    ALTER TABLE instructor_ratings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'student_ratings' AND rowsecurity = true) THEN
    ALTER TABLE student_ratings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_tokens' AND rowsecurity = true) THEN
    ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'token_transactions' AND rowsecurity = true) THEN
    ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_access_purchases' AND rowsecurity = true) THEN
    ALTER TABLE course_access_purchases ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_categories' AND rowsecurity = true) THEN
    ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- User Policies
-- Make policies idempotent by checking if they exist first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Course Policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'courses' AND policyname = 'Anyone can view published courses'
  ) THEN
    CREATE POLICY "Anyone can view published courses"
    ON courses FOR SELECT
    USING (status = 'published');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'courses' AND policyname = 'Instructors can manage own courses'
  ) THEN
    CREATE POLICY "Instructors can manage own courses"
    ON courses FOR ALL
    USING (EXISTS (
        SELECT 1 FROM course_instructors 
        WHERE course_id = courses.course_id 
        AND user_id = auth.uid()
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'courses' AND policyname = 'Admins can manage all courses'
  ) THEN
    CREATE POLICY "Admins can manage all courses"
    ON courses FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users
        WHERE user_id = auth.uid()
        AND is_admin = true
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'courses' AND policyname = 'Instructors can delete their own courses'
  ) THEN
    CREATE POLICY "Instructors can delete their own courses" 
    ON courses FOR DELETE 
    TO authenticated 
    USING (
      EXISTS (
        SELECT 1 FROM course_instructors ci 
        WHERE ci.course_id = courses.course_id AND ci.user_id = auth.uid()
      )
    );
  END IF;

  -- Course categories policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'course_categories' AND policyname = 'Anyone can view course categories'
  ) THEN
    CREATE POLICY "Anyone can view course categories" 
    ON course_categories FOR SELECT 
    USING (true);
  END IF;

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

  -- Course tags policies
END
$$;

-- Module Policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'modules' AND policyname = 'Students can view enrolled modules'
  ) THEN
    CREATE POLICY "Students can view enrolled modules"
    ON modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE student_id = auth.uid()
            AND course_id = modules.course_id
        )
        OR
        EXISTS (
            SELECT 1 FROM courses c
            JOIN course_instructors ci ON c.course_id = ci.course_id
            WHERE c.course_id = modules.course_id
            AND ci.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM users
            WHERE user_id = auth.uid()
            AND is_admin = true
        )
    );
  END IF;
END
$$;

-- Enrollment Policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'enrollments' AND policyname = 'Students can view own enrollments'
  ) THEN
    CREATE POLICY "Students can view own enrollments"
    ON enrollments FOR SELECT
    USING (student_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'enrollments' AND policyname = 'Students can create own enrollments'
  ) THEN
    CREATE POLICY "Students can create own enrollments"
    ON enrollments FOR INSERT
    WITH CHECK (student_id = auth.uid());
  END IF;
END
$$;

-- Helper Functions
-- Function to enroll a user in a course
CREATE OR REPLACE FUNCTION enroll_in_course(
    p_course_id UUID,
    p_user_id UUID DEFAULT auth.uid(),
    p_token_cost INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_enrollment_id UUID;
    v_course_token_cost INTEGER;
    v_user_token_balance INTEGER;
BEGIN
    -- Check if user is already enrolled
    SELECT enrollment_id INTO v_enrollment_id
    FROM enrollments
    WHERE student_id = p_user_id AND course_id = p_course_id;
    
    IF v_enrollment_id IS NOT NULL THEN
        RETURN v_enrollment_id; -- Already enrolled
    END IF;
    
    -- Get course token cost if not provided
    IF p_token_cost IS NULL THEN
        SELECT launch_token_cost INTO v_course_token_cost
        FROM courses
        WHERE course_id = p_course_id;
    ELSE
        v_course_token_cost := p_token_cost;
    END IF;
    
    -- Check if user has enough tokens
    SELECT balance INTO v_user_token_balance
    FROM user_tokens
    WHERE user_id = p_user_id;
    
    IF v_user_token_balance < v_course_token_cost THEN
        RAISE EXCEPTION 'Insufficient tokens. Required: %, Available: %', 
            v_course_token_cost, v_user_token_balance;
    END IF;
    
    -- Create enrollment
    INSERT INTO enrollments (
        student_id, 
        course_id, 
        enroll_date, 
        progress_percent, 
        status,
        tokens_spent
    )
    VALUES (
        p_user_id,
        p_course_id,
        NOW(),
        0,
        'in_progress',
        v_course_token_cost
    )
    RETURNING enrollment_id INTO v_enrollment_id;
    
    -- Record token transaction if cost > 0
    IF v_course_token_cost > 0 THEN
        INSERT INTO token_transactions (
            user_id,
            amount,
            transaction_type,
            source_type,
            source_id,
            description
        )
        VALUES (
            p_user_id,
            -v_course_token_cost, -- Negative for spending
            'spent',
            'Course',
            p_course_id,
            'Course enrollment: ' || (SELECT title FROM courses WHERE course_id = p_course_id)
        );
    END IF;
    
    RETURN v_enrollment_id;
END;
$$;

-- Function to mark a lesson as viewed
CREATE OR REPLACE FUNCTION mark_lesson_as_viewed(
    p_lesson_id UUID,
    p_user_id UUID DEFAULT auth.uid(),
    p_is_completed BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_module_id UUID;
    v_course_id UUID;
    v_is_enrolled BOOLEAN;
BEGIN
    -- Get module_id and course_id for the lesson
    SELECT module_id INTO v_module_id
    FROM lessons
    WHERE lesson_id = p_lesson_id;
    
    SELECT course_id INTO v_course_id
    FROM modules
    WHERE module_id = v_module_id;
    
    -- Check if user is enrolled in the course
    SELECT EXISTS (
        SELECT 1
        FROM enrollments
        WHERE student_id = p_user_id
        AND course_id = v_course_id
    ) INTO v_is_enrolled;
    
    IF NOT v_is_enrolled THEN
        RAISE EXCEPTION 'User is not enrolled in this course';
    END IF;
    
    -- Insert or update user_lesson_view
    INSERT INTO user_lesson_view (
        user_id,
        lesson_id,
        viewed_date,
        is_completed
    )
    VALUES (
        p_user_id,
        p_lesson_id,
        NOW(),
        p_is_completed
    )
    ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET
        viewed_date = NOW(),
        is_completed = p_is_completed;
    
    -- Update course progress
    PERFORM update_course_progress(p_user_id, v_course_id);
    
    RETURN true;
END;
$$;

-- Function to mark a module as completed
CREATE OR REPLACE FUNCTION mark_module_as_completed(
    p_module_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_course_id UUID;
    v_is_enrolled BOOLEAN;
BEGIN
    -- Get course_id for the module
    SELECT course_id INTO v_course_id
    FROM modules
    WHERE module_id = p_module_id;
    
    -- Check if user is enrolled in the course
    SELECT EXISTS (
        SELECT 1
        FROM enrollments
        WHERE student_id = p_user_id
        AND course_id = v_course_id
    ) INTO v_is_enrolled;
    
    IF NOT v_is_enrolled THEN
        RAISE EXCEPTION 'User is not enrolled in this course';
    END IF;
    
    -- Insert into user_module_completion
    INSERT INTO user_module_completion (
        user_id,
        module_id,
        completion_date
    )
    VALUES (
        p_user_id,
        p_module_id,
        NOW()
    )
    ON CONFLICT (user_id, module_id)
    DO UPDATE SET
        completion_date = NOW();
    
    -- Update course progress
    PERFORM update_course_progress(p_user_id, v_course_id);
    
    RETURN true;
END;
$$;

-- Function to update course progress
CREATE OR REPLACE FUNCTION update_course_progress(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_modules INTEGER;
    v_completed_modules INTEGER;
    v_progress_percent REAL;
BEGIN
    -- Count total modules in the course
    SELECT COUNT(*) INTO v_total_modules
    FROM modules
    WHERE course_id = p_course_id;
    
    -- Count completed modules
    SELECT COUNT(*) INTO v_completed_modules
    FROM user_module_completion umc
    JOIN modules m ON umc.module_id = m.module_id
    WHERE umc.user_id = p_user_id
    AND m.course_id = p_course_id;
    
    -- Calculate progress percentage
    IF v_total_modules > 0 THEN
        v_progress_percent := (v_completed_modules::REAL / v_total_modules) * 100;
    ELSE
        v_progress_percent := 0;
    END IF;
    
    -- Update enrollment
    UPDATE enrollments
    SET progress_percent = v_progress_percent,
        status = CASE 
            WHEN v_progress_percent >= 100 THEN 'completed'
            ELSE 'in_progress'
        END,
        completed_date = CASE 
            WHEN v_progress_percent >= 100 THEN NOW()
            ELSE completed_date
        END
    WHERE student_id = p_user_id
    AND course_id = p_course_id;
    
    -- If course completed, award trophy and XP
    IF v_progress_percent >= 100 THEN
        PERFORM award_course_completion(p_user_id, p_course_id);
    END IF;
    
    RETURN true;
END;
$$;

-- Function to award course completion rewards
CREATE OR REPLACE FUNCTION award_course_completion(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_difficulty_id INTEGER;
    v_trophy_type VARCHAR(50);
    v_trophy_id INTEGER;
    v_xp_points INTEGER;
    v_xp_factor INTEGER;
BEGIN
    -- Get course difficulty and XP
    SELECT difficulty_level, xp_points 
    INTO v_difficulty_id, v_xp_points
    FROM courses
    WHERE course_id = p_course_id;
    
    -- Get trophy type and XP factor
    SELECT trophy_type, xp_factor 
    INTO v_trophy_type, v_xp_factor
    FROM difficulty_levels
    WHERE difficulty_id = v_difficulty_id;
    
    -- Get trophy ID
    SELECT trophy_id INTO v_trophy_id
    FROM trophies
    WHERE name = v_trophy_type;
    
    -- Award trophy
    INSERT INTO user_trophies (
        user_id,
        trophy_id,
        course_id,
        date_earned
    )
    VALUES (
        p_user_id,
        v_trophy_id,
        p_course_id,
        NOW()
    )
    ON CONFLICT (user_id, course_id)
    DO NOTHING;
    
    -- Award XP
    UPDATE users
    SET total_xp = total_xp + (v_xp_points * v_xp_factor)
    WHERE user_id = p_user_id;
    
    -- Update the enrollment with trophy
    UPDATE enrollments
    SET trophy_earned = v_trophy_id
    WHERE student_id = p_user_id
    AND course_id = p_course_id;
    
    -- Generate certificate
    INSERT INTO certificates (
        user_id,
        course_id,
        issue_date,
        certificate_code
    )
    VALUES (
        p_user_id,
        p_course_id,
        NOW(),
        'CERT-' || SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT)::TEXT, 1, 10)
    )
    ON CONFLICT (user_id, course_id)
    DO NOTHING;
    
    RETURN true;
END;
$$; 