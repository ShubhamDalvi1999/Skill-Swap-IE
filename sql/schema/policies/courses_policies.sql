-- Row Level Security Policies for the courses table
-- Controls who can view, edit, and delete course data

-- Policy: Anyone can view published courses
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (status = 'published');

-- Policy: Instructors can view and edit their own courses
CREATE POLICY "Instructors can edit their own courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM course_instructors ci 
            WHERE ci.course_id = courses.course_id 
            AND ci.user_id = auth.uid()
        )
    );

-- Policy: Admins can view all courses including drafts
CREATE POLICY "Admins can view all courses" ON courses
    FOR SELECT USING (
        (SELECT is_admin FROM users WHERE user_id = auth.uid())
    ); 