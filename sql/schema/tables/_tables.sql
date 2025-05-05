-- Main file for loading all table definitions
-- Tables are loaded in order of dependencies

-- Core tables first
\i 'schema/tables/users.sql'
\i 'schema/tables/difficulty_levels.sql'
\i 'schema/tables/trophies.sql'

-- Course-related tables
\i 'schema/tables/courses.sql'
\i 'schema/tables/course_instructors.sql'
\i 'schema/tables/modules.sql'
\i 'schema/tables/lessons.sql'

-- Quiz and assignment tables
\i 'schema/tables/quizzes.sql'
\i 'schema/tables/quiz_questions.sql'
\i 'schema/tables/quiz_options.sql'
\i 'schema/tables/assignments.sql'
\i 'schema/tables/projects.sql'

-- User progress and data tables
\i 'schema/tables/enrollments.sql'
\i 'schema/tables/user_trophies.sql'
\i 'schema/tables/user_module_completion.sql'
\i 'schema/tables/user_lesson_view.sql'
\i 'schema/tables/user_quiz_attempts.sql'
\i 'schema/tables/user_quiz_answers.sql'
\i 'schema/tables/user_assignment_submissions.sql'
\i 'schema/tables/user_project_submissions.sql'

-- Tagging system
\i 'schema/tables/tags.sql'
\i 'schema/tables/course_tags.sql'

-- Certificate system
\i 'schema/tables/certificates.sql'

-- Rating systems
\i 'schema/tables/course_ratings.sql'
\i 'schema/tables/instructor_ratings.sql'
\i 'schema/tables/student_ratings.sql'

-- Token system
\i 'schema/tables/user_tokens.sql'
\i 'schema/tables/token_transactions.sql'
\i 'schema/tables/course_access_purchases.sql' 