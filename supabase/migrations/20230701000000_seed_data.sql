-- Migration: Comprehensive Seed Data
-- Description: Realistic seed data for the course-taking platform

-- Make all seed operations idempotent with ON CONFLICT clauses
BEGIN;

-- ----------------------
-- REFERENCE DATA
-- ----------------------

-- Difficulty levels
INSERT INTO difficulty_levels (name, trophy_type, xp_factor) VALUES
    ('Beginner', 'Bronze', 1),
    ('Intermediate', 'Silver', 2),
    ('Advanced', 'Gold', 3),
    ('Expert', 'Platinum', 4)
ON CONFLICT (name) DO NOTHING;

-- Trophies
INSERT INTO trophies (name, description, icon_image) VALUES
    ('Bronze Trophy', 'Awarded for completing a Beginner-level course', 'https://example.com/icons/bronze.png'),
    ('Silver Trophy', 'Awarded for completing an Intermediate-level course', 'https://example.com/icons/silver.png'),
    ('Gold Trophy', 'Awarded for completing an Advanced-level course', 'https://example.com/icons/gold.png'),
    ('Platinum Trophy', 'Awarded for completing an Expert-level course', 'https://example.com/icons/platinum.png'),
    ('Early Adopter', 'Awarded to the first 100 users', 'https://example.com/icons/early_adopter.png'),
    ('Perfect Score', 'Achieved 100% on all quizzes in a course', 'https://example.com/icons/perfect.png')
ON CONFLICT (name) DO NOTHING;

-- Tags
INSERT INTO tags (name) VALUES
    ('Web Development'),
    ('Mobile Development'),
    ('Data Science'),
    ('Machine Learning'),
    ('UX/UI Design'),
    ('DevOps'),
    ('Cloud Computing'),
    ('Blockchain'),
    ('Game Development'),
    ('Cybersecurity')
ON CONFLICT (name) DO NOTHING;

-- Course Categories
INSERT INTO course_categories (name, description, icon_url) VALUES
    ('Programming', 'Courses focused on programming languages and software development', 'https://example.com/icons/programming.png'),
    ('Data Science', 'Courses related to data analysis, statistics, and machine learning', 'https://example.com/icons/data-science.png'),
    ('Design', 'Courses covering UI/UX, graphic design, and creative skills', 'https://example.com/icons/design.png'),
    ('Business', 'Courses on entrepreneurship, marketing, and management', 'https://example.com/icons/business.png'),
    ('IT & Software', 'Courses on networking, systems administration, and IT certification', 'https://example.com/icons/it-software.png')
ON CONFLICT (name) DO NOTHING;

-- Insert subcategories
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

-- ----------------------
-- USERS
-- ----------------------

-- Admin users
INSERT INTO users (user_id, email, name, password_hash, is_admin, profile_info, total_xp, created_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@skillswap.com', 'Admin User', 'hashed_password_placeholder', true, 
     '{"bio": "System administrator", "location": "San Francisco", "avatar_url": "https://example.com/avatars/admin.png"}', 
     5000, NOW() - INTERVAL '1 year')
ON CONFLICT (user_id) DO NOTHING;

-- Instructor users
INSERT INTO users (user_id, email, name, password_hash, is_admin, profile_info, total_xp, created_at)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'jennifer@skillswap.com', 'Jennifer Lawrence', 'hashed_password_placeholder', false, 
     '{"bio": "Senior Web Developer with 10+ years experience", "location": "New York", "avatar_url": "https://example.com/avatars/jennifer.png"}', 
     3500, NOW() - INTERVAL '11 months'),
    ('33333333-3333-3333-3333-333333333333', 'michael@skillswap.com', 'Michael Chen', 'hashed_password_placeholder', false, 
     '{"bio": "Data scientist and AI researcher", "location": "Boston", "avatar_url": "https://example.com/avatars/michael.png"}', 
     4200, NOW() - INTERVAL '10 months'),
    ('44444444-4444-4444-4444-444444444444', 'sophia@skillswap.com', 'Sophia Rodriguez', 'hashed_password_placeholder', false, 
     '{"bio": "UX/UI designer and accessibility advocate", "location": "Portland", "avatar_url": "https://example.com/avatars/sophia.png"}', 
     3800, NOW() - INTERVAL '9 months')
ON CONFLICT (user_id) DO NOTHING;

-- Student users
INSERT INTO users (user_id, email, name, password_hash, is_admin, profile_info, total_xp, created_at)
VALUES 
    ('55555555-5555-5555-5555-555555555555', 'alex@example.com', 'Alex Johnson', 'hashed_password_placeholder', false, 
     '{"bio": "Frontend developer looking to expand skills", "location": "Chicago", "avatar_url": "https://example.com/avatars/alex.png"}', 
     750, NOW() - INTERVAL '8 months'),
    ('66666666-6666-6666-6666-666666666666', 'taylor@example.com', 'Taylor Smith', 'hashed_password_placeholder', false, 
     '{"bio": "Computer Science student", "location": "Austin", "avatar_url": "https://example.com/avatars/taylor.png"}', 
     420, NOW() - INTERVAL '7 months'),
    ('77777777-7777-7777-7777-777777777777', 'jamie@example.com', 'Jamie Williams', 'hashed_password_placeholder', false, 
     '{"bio": "Graphic designer transitioning to web development", "location": "Miami", "avatar_url": "https://example.com/avatars/jamie.png"}', 
     350, NOW() - INTERVAL '6 months'),
    ('88888888-8888-8888-8888-888888888888', 'casey@example.com', 'Casey Brown', 'hashed_password_placeholder', false, 
     '{"bio": "DevOps engineer", "location": "Seattle", "avatar_url": "https://example.com/avatars/casey.png"}', 
     820, NOW() - INTERVAL '5 months'),
    ('99999999-9999-9999-9999-999999999999', 'jordan@example.com', 'Jordan Lee', 'hashed_password_placeholder', false, 
     '{"bio": "Self-taught programmer", "location": "Denver", "avatar_url": "https://example.com/avatars/jordan.png"}', 
     560, NOW() - INTERVAL '4 months')
ON CONFLICT (user_id) DO NOTHING;

-- Set up token balances for all users
INSERT INTO user_tokens (user_id, token_balance, last_updated)
SELECT user_id, 100, NOW() FROM users
ON CONFLICT (user_id) DO UPDATE SET token_balance = user_tokens.token_balance + 100;

-- ----------------------
-- COURSES
-- ----------------------

-- Web Development Courses
INSERT INTO courses (course_id, title, description, difficulty_level, xp_points, launch_token_cost, created_date, status, thumbnail_url)
VALUES 
    ('c0001111-a111-4b11-9c11-d11e11f11111', 'Modern JavaScript Fundamentals', 
     'Master the core concepts of JavaScript including ES6+ features, async programming, and functional programming patterns.', 
     1, 100, 10, NOW() - INTERVAL '10 months', 'published', 'https://example.com/thumbnails/js-fundamentals.jpg'),
    
    ('c0002222-a222-4b22-9c22-d22e22f22222', 'React: From Zero to Hero', 
     'Build professional React applications with hooks, context API, and Redux. Includes real-world project development.', 
     2, 150, 15, NOW() - INTERVAL '9 months', 'published', 'https://example.com/thumbnails/react-hero.jpg'),
    
    ('c0003333-a333-4b33-9c33-d33e33f33333', 'Full Stack Development with MERN', 
     'Create full-stack web applications using MongoDB, Express, React, and Node.js with authentication, API development, and deployment.', 
     3, 200, 20, NOW() - INTERVAL '8 months', 'published', 'https://example.com/thumbnails/mern-stack.jpg')
ON CONFLICT (course_id) DO NOTHING;

-- Data Science Courses
INSERT INTO courses (course_id, title, description, difficulty_level, xp_points, launch_token_cost, created_date, status, thumbnail_url)
VALUES
    ('c0004444-a444-4b44-9c44-d44e44f44444', 'Introduction to Data Science with Python', 
     'Learn fundamental data science concepts using Python, pandas, NumPy, and Matplotlib with practical examples.', 
     1, 100, 10, NOW() - INTERVAL '7 months', 'published', 'https://example.com/thumbnails/python-data-science.jpg'),
    
    ('c0005555-a555-4b55-9c55-d55e55f55555', 'Machine Learning Fundamentals', 
     'Understand key machine learning algorithms, data preprocessing, model evaluation, and implementation with scikit-learn.', 
     2, 150, 15, NOW() - INTERVAL '6 months', 'published', 'https://example.com/thumbnails/ml-fundamentals.jpg')
ON CONFLICT (course_id) DO NOTHING;

-- Design Courses
INSERT INTO courses (course_id, title, description, difficulty_level, xp_points, launch_token_cost, created_date, status, thumbnail_url)
VALUES
    ('c0006666-a666-4b66-9c66-d66e66f66666', 'UI/UX Design Principles', 
     'Master the fundamentals of user interface and user experience design, including wireframing, prototyping, and user research.', 
     1, 100, 10, NOW() - INTERVAL '5 months', 'published', 'https://example.com/thumbnails/uiux-design.jpg')
ON CONFLICT (course_id) DO NOTHING;

-- Draft and archived courses
INSERT INTO courses (course_id, title, description, difficulty_level, xp_points, launch_token_cost, created_date, status, thumbnail_url)
VALUES
    ('c0007777-a777-4b77-9c77-d77e77f77777', 'Advanced GraphQL API Development', 
     'Build scalable and efficient GraphQL APIs with Apollo Server, authentication, authorization, and performance optimization.', 
     3, 200, 20, NOW() - INTERVAL '4 months', 'draft', 'https://example.com/thumbnails/graphql-advanced.jpg'),
    
    ('c0008888-a888-4b88-9c88-d88e88f88888', 'Legacy: jQuery Essentials', 
     'Learn jQuery for DOM manipulation, events, effects, and AJAX calls for maintaining legacy web applications.', 
     1, 100, 5, NOW() - INTERVAL '20 months', 'archived', 'https://example.com/thumbnails/jquery.jpg')
ON CONFLICT (course_id) DO NOTHING;

-- Update courses with category IDs
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

-- Link courses to tags
INSERT INTO course_tags (course_id, tag_id)
SELECT c.course_id, t.tag_id FROM 
    courses c, tags t 
WHERE 
    (c.title = 'Modern JavaScript Fundamentals' AND t.name = 'Web Development') OR
    (c.title = 'React: From Zero to Hero' AND t.name = 'Web Development') OR
    (c.title = 'Full Stack Development with MERN' AND t.name = 'Web Development') OR
    (c.title = 'Introduction to Data Science with Python' AND t.name = 'Data Science') OR
    (c.title = 'Machine Learning Fundamentals' AND t.name IN ('Data Science', 'Machine Learning')) OR
    (c.title = 'UI/UX Design Principles' AND t.name = 'UX/UI Design') OR
    (c.title = 'Advanced GraphQL API Development' AND t.name = 'Web Development') OR
    (c.title = 'Legacy: jQuery Essentials' AND t.name = 'Web Development')
ON CONFLICT (course_id, tag_id) DO NOTHING;

-- Link courses to instructors
INSERT INTO course_instructors (course_id, user_id)
SELECT c.course_id, u.user_id FROM 
    courses c, users u 
WHERE 
    (c.title IN ('Modern JavaScript Fundamentals', 'React: From Zero to Hero', 'Full Stack Development with MERN') AND u.name = 'Jennifer Lawrence') OR
    (c.title IN ('Introduction to Data Science with Python', 'Machine Learning Fundamentals') AND u.name = 'Michael Chen') OR
    (c.title = 'UI/UX Design Principles' AND u.name = 'Sophia Rodriguez') OR
    (c.title IN ('Advanced GraphQL API Development', 'Legacy: jQuery Essentials') AND u.name = 'Jennifer Lawrence')
ON CONFLICT (course_id, user_id) DO NOTHING;

-- ----------------------
-- MODULES & CONTENT
-- ----------------------

-- JavaScript Fundamentals Modules
INSERT INTO modules (module_id, course_id, title, position)
VALUES
    ('a0001111-a111-4b11-9c11-d11e11f11111', 'c0001111-a111-4b11-9c11-d11e11f11111', 'JavaScript Basics', 1),
    ('a0002222-a222-4b22-9c22-d22e22f22222', 'c0001111-a111-4b11-9c11-d11e11f11111', 'ES6+ Features', 2),
    ('a0003333-a333-4b33-9c33-d33e33f33333', 'c0001111-a111-4b11-9c11-d11e11f11111', 'Asynchronous JavaScript', 3),
    ('a0004444-a444-4b44-9c44-d44e44f44444', 'c0001111-a111-4b11-9c11-d11e11f11111', 'Functional Programming', 4),
    ('a0005555-a555-4b55-9c55-d55e55f55555', 'c0001111-a111-4b11-9c11-d11e11f11111', 'Final Project', 5)
ON CONFLICT (course_id, position) DO NOTHING;

-- React Course Modules
INSERT INTO modules (module_id, course_id, title, position)
VALUES
    ('a0006666-a666-4b66-9c66-d66e66f66666', 'c0002222-a222-4b22-9c22-d22e22f22222', 'React Fundamentals', 1),
    ('a0007777-a777-4b77-9c77-d77e77f77777', 'c0002222-a222-4b22-9c22-d22e22f22222', 'React Hooks', 2),
    ('a0008888-a888-4b88-9c88-d88e88f88888', 'c0002222-a222-4b22-9c22-d22e22f22222', 'State Management with Context API', 3),
    ('a0009999-a999-4b99-9c99-d99e99f99999', 'c0002222-a222-4b22-9c22-d22e22f22222', 'Redux Integration', 4),
    ('a000aaaa-aaaa-4baa-9caa-daaeeefaaaaa', 'c0002222-a222-4b22-9c22-d22e22f22222', 'Building a Portfolio Project', 5)
ON CONFLICT (course_id, position) DO NOTHING;

-- JavaScript Module Lessons
INSERT INTO lessons (lesson_id, module_id, title, content_type, content_url, content_text, position)
VALUES
    ('b0001111-a111-4b11-9c11-d11e11f11111', 'a0001111-a111-4b11-9c11-d11e11f11111', 'Variables and Data Types', 'video', 
     'https://example.com/videos/js-variables.mp4', NULL, 1),
    ('b0002222-a222-4b22-9c22-d22e22f22222', 'a0001111-a111-4b11-9c11-d11e11f11111', 'Functions and Scope', 'video', 
     'https://example.com/videos/js-functions.mp4', NULL, 2),
    ('b0003333-a333-4b33-9c33-d33e33f33333', 'a0001111-a111-4b11-9c11-d11e11f11111', 'Objects and Arrays', 'text', 
     NULL, 'In JavaScript, objects and arrays are fundamental data structures...[content continues]', 3),
    
    ('b0004444-a444-4b44-9c44-d44e44f44444', 'a0002222-a222-4b22-9c22-d22e22f22222', 'Arrow Functions', 'video', 
     'https://example.com/videos/es6-arrow.mp4', NULL, 1),
    ('b0005555-a555-4b55-9c55-d55e55f55555', 'a0002222-a222-4b22-9c22-d22e22f22222', 'Destructuring and Spread', 'video', 
     'https://example.com/videos/es6-destructuring.mp4', NULL, 2),
    ('b0006666-a666-4b66-9c66-d66e66f66666', 'a0002222-a222-4b22-9c22-d22e22f22222', 'Template Literals', 'text', 
     NULL, 'Template literals provide an elegant way to work with strings in JavaScript...[content continues]', 3)
ON CONFLICT (module_id, position) DO NOTHING;

-- JavaScript Module Quizzes
INSERT INTO quizzes (quiz_id, module_id, title, instructions, max_score)
VALUES
    ('d0001111-a111-4b11-9c11-d11e11f11111', 'a0001111-a111-4b11-9c11-d11e11f11111', 'JavaScript Basics Quiz', 
     'Test your understanding of JavaScript basics with this quiz. Answer all questions to proceed.', 100)
ON CONFLICT (quiz_id) DO NOTHING;

-- Quiz Questions
INSERT INTO quiz_questions (question_id, quiz_id, question_text, question_type, points, position)
VALUES
    ('e0001111-a111-4b11-9c11-d11e11f11111', 'd0001111-a111-4b11-9c11-d11e11f11111', 
     'Which of the following is a primitive data type in JavaScript?', 'multiple_choice', 20, 1),
    ('e0002222-a222-4b22-9c22-d22e22f22222', 'd0001111-a111-4b11-9c11-d11e11f11111', 
     'What will console.log(typeof []) output?', 'multiple_choice', 20, 2),
    ('e0003333-a333-4b33-9c33-d33e33f33333', 'd0001111-a111-4b11-9c11-d11e11f11111', 
     'Explain the difference between let, const, and var in JavaScript.', 'text', 30, 3),
    ('e0004444-a444-4b44-9c44-d44e44f44444', 'd0001111-a111-4b11-9c11-d11e11f11111', 
     'What is the output of: console.log(2 + "2")?', 'multiple_choice', 30, 4)
ON CONFLICT (quiz_id, position) DO NOTHING;

-- Quiz Options
INSERT INTO quiz_options (option_id, question_id, option_text, is_correct, position)
VALUES
    -- Question 1 options
    ('f0001111-a111-4b11-9c11-d11e11f11111', 'e0001111-a111-4b11-9c11-d11e11f11111', 'Array', false, 1),
    ('f0002222-a222-4b22-9c22-d22e22f22222', 'e0001111-a111-4b11-9c11-d11e11f11111', 'Object', false, 2),
    ('f0003333-a333-4b33-9c33-d33e33f33333', 'e0001111-a111-4b11-9c11-d11e11f11111', 'String', true, 3),
    ('f0004444-a444-4b44-9c44-d44e44f44444', 'e0001111-a111-4b11-9c11-d11e11f11111', 'Function', false, 4),
    
    -- Question 2 options
    ('f0005555-a555-4b55-9c55-d55e55f55555', 'e0002222-a222-4b22-9c22-d22e22f22222', '"array"', false, 1),
    ('f0006666-a666-4b66-9c66-d66e66f66666', 'e0002222-a222-4b22-9c22-d22e22f22222', '"object"', true, 2),
    ('f0007777-a777-4b77-9c77-d77e77f77777', 'e0002222-a222-4b22-9c22-d22e22f22222', '"undefined"', false, 3),
    ('f0008888-a888-4b88-9c88-d88e88f88888', 'e0002222-a222-4b22-9c22-d22e22f22222', '"list"', false, 4),
    
    -- Question 4 options
    ('f0009999-a999-4b99-9c99-d99e99f99999', 'e0004444-a444-4b44-9c44-d44e44f44444', '4', false, 1),
    ('f000aaaa-aaaa-4baa-9caa-daaeeefaaaaa', 'e0004444-a444-4b44-9c44-d44e44f44444', '22', true, 2),
    ('f000bbbb-bbbb-4bbb-9cbb-dbbeeefbbbbb', 'e0004444-a444-4b44-9c44-d44e44f44444', '"22"', false, 3),
    ('f000cccc-cccc-4ccc-9ccc-dcceeefdcccc', 'e0004444-a444-4b44-9c44-d44e44f44444', 'Error', false, 4)
ON CONFLICT (question_id, position) DO NOTHING;

-- Assignments for React course
INSERT INTO assignments (assignment_id, module_id, title, description, due_date, points)
VALUES
    ('a0001111-a111-4b11-9c11-d11e11f11111', 'a0006666-a666-4b66-9c66-d66e66f66666',
     'Create a Simple Component', 'Create a reusable React component that displays a card with an image, title, and description.',
     NOW() + INTERVAL '14 days', 100),
    ('a0002222-a222-4b22-9c22-d22e22f22222', 'a0007777-a777-4b77-9c77-d77e77f77777',
     'Custom Hook Implementation', 'Create a custom React hook that manages form state and validation.',
     NOW() + INTERVAL '21 days', 150)
ON CONFLICT (assignment_id) DO NOTHING;

-- Projects for JavaScript course
INSERT INTO projects (project_id, course_id, title, description, points)
VALUES
    ('b0001111-a111-4b11-9c11-d11e11f11111', 'c0001111-a111-4b11-9c11-d11e11f11111',
     'Interactive To-Do List', 'Build a fully functional to-do list application using vanilla JavaScript with local storage integration.',
     200)
ON CONFLICT (project_id) DO NOTHING;

-- ----------------------
-- ENROLLMENTS & PROGRESS
-- ----------------------

-- Enrollments
INSERT INTO enrollments (enrollment_id, student_id, course_id, enroll_date, progress_percent, status, tokens_spent)
VALUES
    -- Alex enrolled in JS and React courses
    ('e0001111-a111-4b11-9c11-d11e11f11111', '55555555-5555-5555-5555-555555555555', 'c0001111-a111-4b11-9c11-d11e11f11111',
     NOW() - INTERVAL '7 months', 100, 'completed', 10),
    ('e0002222-a222-4b22-9c22-d22e22f22222', '55555555-5555-5555-5555-555555555555', 'c0002222-a222-4b22-9c22-d22e22f22222',
     NOW() - INTERVAL '4 months', 60, 'in_progress', 15),
    
    -- Taylor enrolled in JS and data science
    ('e0003333-a333-4b33-9c33-d33e33f33333', '66666666-6666-6666-6666-666666666666', 'c0001111-a111-4b11-9c11-d11e11f11111',
     NOW() - INTERVAL '6 months', 100, 'completed', 10),
    ('e0004444-a444-4b44-9c44-d44e44f44444', '66666666-6666-6666-6666-666666666666', 'c0004444-a444-4b44-9c44-d44e44f44444',
     NOW() - INTERVAL '3 months', 40, 'in_progress', 10),
    
    -- Jamie enrolled in UI/UX
    ('e0005555-a555-4b55-9c55-d55e55f55555', '77777777-7777-7777-7777-777777777777', 'c0006666-a666-4b66-9c66-d66e66f66666',
     NOW() - INTERVAL '4 months', 75, 'in_progress', 10),
    
    -- Casey enrolled in multiple courses
    ('e0006666-a666-4b66-9c66-d66e66f66666', '88888888-8888-8888-8888-888888888888', 'c0001111-a111-4b11-9c11-d11e11f11111',
     NOW() - INTERVAL '5 months', 100, 'completed', 10),
    ('e0007777-a777-4b77-9c77-d77e77f77777', '88888888-8888-8888-8888-888888888888', 'c0002222-a222-4b22-9c22-d22e22f22222',
     NOW() - INTERVAL '4 months', 100, 'completed', 15),
    ('e0008888-a888-4b88-9c88-d88e88f88888', '88888888-8888-8888-8888-888888888888', 'c0003333-a333-4b33-9c33-d33e33f33333',
     NOW() - INTERVAL '2 months', 25, 'in_progress', 20)
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Module completions (completed modules for users with progress)
INSERT INTO user_module_completion (user_id, module_id, completion_date)
SELECT 
    e.student_id, m.module_id, e.enroll_date + INTERVAL '1 week' * m.position
FROM 
    enrollments e
JOIN 
    modules m ON e.course_id = m.course_id
WHERE 
    (e.progress_percent = 100) OR
    (e.progress_percent > 0 AND m.position <= CEIL(e.progress_percent / 20.0))
ON CONFLICT (user_id, module_id) DO NOTHING;

-- Lesson views
INSERT INTO user_lesson_view (user_id, lesson_id, viewed_date, is_completed)
SELECT 
    umc.user_id, l.lesson_id, umc.completion_date - INTERVAL '1 day' * l.position, TRUE
FROM 
    user_module_completion umc
JOIN 
    lessons l ON umc.module_id = l.module_id
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Quiz attempts for completed modules
INSERT INTO user_quiz_attempts (attempt_id, user_id, quiz_id, score, started_at, completed_at, is_passed)
SELECT 
    md5(umc.user_id::text || q.quiz_id::text)::uuid, umc.user_id, q.quiz_id, 
    CASE WHEN e.student_id = '88888888-8888-8888-8888-888888888888' THEN 100 ELSE 80 + (random() * 20)::int END,
    umc.completion_date - INTERVAL '2 days',
    umc.completion_date - INTERVAL '1 day',
    TRUE
FROM 
    user_module_completion umc
JOIN 
    quizzes q ON umc.module_id = q.module_id
JOIN 
    enrollments e ON umc.user_id = e.student_id AND e.course_id = (
        SELECT course_id FROM modules WHERE module_id = umc.module_id
    )
WHERE 
    q.quiz_id IS NOT NULL
ON CONFLICT (attempt_id) DO NOTHING;

-- Course ratings from completed courses
INSERT INTO course_ratings (rating_id, course_id, student_id, rating, review_text, rating_date)
SELECT 
    md5(e.student_id::text || e.course_id::text)::uuid, e.course_id, e.student_id, 
    4 + (random() * 1)::int,
    CASE 
        WHEN e.student_id = '55555555-5555-5555-5555-555555555555' THEN 'Great course! I learned a lot about JavaScript.'
        WHEN e.student_id = '66666666-6666-6666-6666-666666666666' THEN 'The content was very well structured and easy to follow.'
        WHEN e.student_id = '88888888-8888-8888-8888-888888888888' THEN 'Excellent content and the instructor was very responsive to questions.'
        ELSE 'Highly recommended course.'
    END,
    e.completed_date
FROM 
    enrollments e
WHERE 
    e.status = 'completed'
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Award trophies for completed courses
INSERT INTO user_trophies (user_id, trophy_id, course_id, date_earned)
SELECT 
    e.student_id, t.trophy_id, e.course_id, e.completed_date
FROM 
    enrollments e
JOIN 
    courses c ON e.course_id = c.course_id
JOIN 
    difficulty_levels dl ON c.difficulty_level = dl.difficulty_id
JOIN 
    trophies t ON dl.trophy_type = t.name
WHERE 
    e.status = 'completed'
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Generate certificates for completed courses
INSERT INTO certificates (certificate_id, user_id, course_id, issue_date, certificate_code, certificate_url)
SELECT 
    md5('cert-' || e.student_id::text || e.course_id::text)::uuid,
    e.student_id, e.course_id, e.completed_date,
    'CERT-' || SUBSTRING(MD5(e.student_id::text || e.course_id::text)::text, 1, 10),
    'https://example.com/certificates/' || SUBSTRING(MD5(e.student_id::text || e.course_id::text)::text, 1, 10) || '.pdf'
FROM 
    enrollments e
WHERE 
    e.status = 'completed'
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Token transactions for course enrollments
INSERT INTO token_transactions (transaction_id, user_id, amount, transaction_type, source_type, source_id, description, transaction_date)
SELECT 
    md5('tx-' || e.student_id::text || e.course_id::text)::uuid,
    e.student_id, -e.tokens_spent, 'spent', 'Course', e.course_id,
    'Enrollment in course: ' || c.title,
    e.enroll_date
FROM 
    enrollments e
JOIN 
    courses c ON e.course_id = c.course_id
ON CONFLICT (transaction_id) DO NOTHING;

-- Add some bonus token transactions
INSERT INTO token_transactions (transaction_id, user_id, amount, transaction_type, source_type, source_id, description, transaction_date)
VALUES
    (md5('bonus-1')::uuid, '55555555-5555-5555-5555-555555555555', 50, 'reward', 'System', NULL, 'Bonus for completing first course', NOW() - INTERVAL '6 months'),
    (md5('bonus-2')::uuid, '88888888-8888-8888-8888-888888888888', 100, 'reward', 'System', NULL, 'Perfect score achievement', NOW() - INTERVAL '3 months'),
    (md5('signup-1')::uuid, '99999999-9999-9999-9999-999999999999', 20, 'gift', 'System', NULL, 'Welcome bonus', NOW() - INTERVAL '4 months')
ON CONFLICT (transaction_id) DO NOTHING;

-- ----------------------
-- COURSE RESOURCES
-- ----------------------

-- Add downloadable resources for courses
INSERT INTO course_resources (resource_id, course_id, title, resource_type, file_url, description, created_at)
VALUES
    (md5('resource-js-cheatsheet')::uuid, 'c0001111-a111-4b11-9c11-d11e11f11111', 
     'JavaScript Cheatsheet', 'pdf', 'https://example.com/resources/js-cheatsheet.pdf', 
     'A comprehensive reference guide for JavaScript syntax and features', NOW() - INTERVAL '9 months'),
    
    (md5('resource-react-patterns')::uuid, 'c0002222-a222-4b22-9c22-d22e22f22222', 
     'React Design Patterns', 'pdf', 'https://example.com/resources/react-patterns.pdf', 
     'Common patterns and best practices for React applications', NOW() - INTERVAL '8 months'),
    
    (md5('resource-mern-starter')::uuid, 'c0003333-a333-4b33-9c33-d33e33f33333', 
     'MERN Stack Starter Kit', 'zip', 'https://example.com/resources/mern-starter.zip', 
     'Boilerplate code for starting a MERN stack application', NOW() - INTERVAL '7 months'),
    
    (md5('resource-python-notebook')::uuid, 'c0004444-a444-4b44-9c44-d44e44f44444', 
     'Data Science Python Notebook', 'ipynb', 'https://example.com/resources/data-science-intro.ipynb', 
     'Jupyter notebook with examples of data analysis with Python', NOW() - INTERVAL '6 months'),
    
    (md5('resource-ml-datasets')::uuid, 'c0005555-a555-4b55-9c55-d55e55f55555', 
     'Machine Learning Datasets', 'zip', 'https://example.com/resources/ml-datasets.zip', 
     'Collection of curated datasets for machine learning practice', NOW() - INTERVAL '5 months'),
    
    (md5('resource-ui-wireframes')::uuid, 'c0006666-a666-4b66-9c66-d66e66f66666', 
     'UI/UX Wireframe Templates', 'sketch', 'https://example.com/resources/wireframe-templates.sketch', 
     'Sketch templates for creating wireframes and mockups', NOW() - INTERVAL '4 months')
ON CONFLICT (resource_id) DO NOTHING;

-- ----------------------
-- DISCUSSION FORUMS
-- ----------------------

-- Create course discussion forums
INSERT INTO discussion_forums (forum_id, course_id, title, description, created_at)
VALUES
    (md5('forum-js-fundamentals')::uuid, 'c0001111-a111-4b11-9c11-d11e11f11111', 
     'JavaScript Fundamentals Discussion', 'Ask questions and discuss topics related to JavaScript fundamentals', 
     NOW() - INTERVAL '10 months'),
    
    (md5('forum-react-hero')::uuid, 'c0002222-a222-4b22-9c22-d22e22f22222', 
     'React Discussion Forum', 'Share React tips, ask questions, and discuss projects', 
     NOW() - INTERVAL '9 months'),
    
    (md5('forum-python-datascience')::uuid, 'c0004444-a444-4b44-9c44-d44e44f44444', 
     'Python Data Science Forum', 'Discuss data science concepts, libraries, and techniques', 
     NOW() - INTERVAL '7 months')
ON CONFLICT (forum_id) DO NOTHING;

-- Add forum topics
INSERT INTO forum_topics (topic_id, forum_id, user_id, title, content, created_at)
VALUES
    (md5('topic-js-async')::uuid, (SELECT forum_id FROM discussion_forums WHERE course_id = 'c0001111-a111-4b11-9c11-d11e11f11111'), 
     '55555555-5555-5555-5555-555555555555', 'Understanding Async/Await', 
     'I''m having trouble understanding when to use async/await versus promises. Can someone explain the differences and best practices?', 
     NOW() - INTERVAL '6 months'),
    
    (md5('topic-react-hooks')::uuid, (SELECT forum_id FROM discussion_forums WHERE course_id = 'c0002222-a222-4b22-9c22-d22e22f22222'), 
     '66666666-6666-6666-6666-666666666666', 'Custom React Hooks Examples', 
     'Could someone share examples of useful custom React hooks that you''ve created for your projects?', 
     NOW() - INTERVAL '5 months'),
    
    (md5('topic-python-pandas')::uuid, (SELECT forum_id FROM discussion_forums WHERE course_id = 'c0004444-a444-4b44-9c44-d44e44f44444'), 
     '88888888-8888-8888-8888-888888888888', 'Efficient Data Manipulation with Pandas', 
     'What are some techniques to optimize pandas operations when working with large datasets?', 
     NOW() - INTERVAL '4 months'),
    
    (md5('topic-js-frameworks')::uuid, (SELECT forum_id FROM discussion_forums WHERE course_id = 'c0001111-a111-4b11-9c11-d11e11f11111'), 
     '77777777-7777-7777-7777-777777777777', 'JavaScript Framework Comparison', 
     'After learning vanilla JavaScript, which framework would you recommend learning first: React, Vue, or Angular?', 
     NOW() - INTERVAL '3 months')
ON CONFLICT (topic_id) DO NOTHING;

-- Add forum replies
INSERT INTO forum_replies (reply_id, topic_id, user_id, content, created_at)
VALUES
    (md5('reply-js-async-1')::uuid, (SELECT topic_id FROM forum_topics WHERE title = 'Understanding Async/Await'), 
     '22222222-2222-2222-2222-222222222222', 
     'Async/await is essentially syntactic sugar over promises, making asynchronous code look and behave more like synchronous code. The main difference is readability and error handling. With async/await, you can use try/catch blocks instead of .catch() chains.', 
     NOW() - INTERVAL '6 months' + INTERVAL '2 days'),
    
    (md5('reply-js-async-2')::uuid, (SELECT topic_id FROM forum_topics WHERE title = 'Understanding Async/Await'), 
     '88888888-8888-8888-8888-888888888888', 
     'I found it helpful to start with promises and then move to async/await. Remember that an async function always returns a promise, even if you don''t explicitly return one!', 
     NOW() - INTERVAL '6 months' + INTERVAL '3 days'),
    
    (md5('reply-react-hooks-1')::uuid, (SELECT topic_id FROM forum_topics WHERE title = 'Custom React Hooks Examples'), 
     '22222222-2222-2222-2222-222222222222', 
     'I created a useLocalStorage hook that syncs state with localStorage. It''s really useful for persisting user preferences or form data: function useLocalStorage(key, initialValue) {...}', 
     NOW() - INTERVAL '5 months' + INTERVAL '1 day'),
    
    (md5('reply-python-pandas-1')::uuid, (SELECT topic_id FROM forum_topics WHERE title = 'Efficient Data Manipulation with Pandas'), 
     '33333333-3333-3333-3333-333333333333', 
     'For large datasets, try to use vectorized operations instead of loops. Also, consider using the inplace=True parameter when applicable to avoid creating unnecessary copies of your data.', 
     NOW() - INTERVAL '4 months' + INTERVAL '5 days')
ON CONFLICT (reply_id) DO NOTHING;

-- ----------------------
-- USER ACTIVITY LOGS
-- ----------------------

-- Log user activities
INSERT INTO user_activity_logs (log_id, user_id, activity_type, activity_detail, ip_address, created_at)
VALUES
    (md5('log-login-1')::uuid, '55555555-5555-5555-5555-555555555555', 'login', 
     'User logged in successfully', '192.168.1.100', NOW() - INTERVAL '7 days'),
     
    (md5('log-course-view-1')::uuid, '55555555-5555-5555-5555-555555555555', 'course_view', 
     'Viewed course: React: From Zero to Hero', '192.168.1.100', NOW() - INTERVAL '7 days' + INTERVAL '30 minutes'),
     
    (md5('log-lesson-complete-1')::uuid, '55555555-5555-5555-5555-555555555555', 'lesson_complete', 
     'Completed lesson: React Hooks Introduction', '192.168.1.100', NOW() - INTERVAL '7 days' + INTERVAL '2 hours'),
     
    (md5('log-login-2')::uuid, '66666666-6666-6666-6666-666666666666', 'login', 
     'User logged in successfully', '192.168.1.101', NOW() - INTERVAL '5 days'),
     
    (md5('log-course-enroll-1')::uuid, '66666666-6666-6666-6666-666666666666', 'course_enroll', 
     'Enrolled in course: Machine Learning Fundamentals', '192.168.1.101', NOW() - INTERVAL '5 days' + INTERVAL '45 minutes'),
     
    (md5('log-profile-update-1')::uuid, '77777777-7777-7777-7777-777777777777', 'profile_update', 
     'Updated profile information', '192.168.1.102', NOW() - INTERVAL '3 days'),
     
    (md5('log-password-reset-1')::uuid, '99999999-9999-9999-9999-999999999999', 'password_reset', 
     'Requested password reset', '192.168.1.103', NOW() - INTERVAL '2 days')
ON CONFLICT (log_id) DO NOTHING;

-- ----------------------
-- NOTIFICATIONS
-- ----------------------

-- Create user notifications
INSERT INTO user_notifications (notification_id, user_id, notification_type, content, is_read, created_at)
VALUES
    (md5('notif-course-update-1')::uuid, '55555555-5555-5555-5555-555555555555', 'course_update', 
     'New content has been added to "React: From Zero to Hero"', false, NOW() - INTERVAL '5 days'),
     
    (md5('notif-assignment-due-1')::uuid, '55555555-5555-5555-5555-555555555555', 'assignment_due', 
     'Your assignment "Create a Simple Component" is due in 2 days', false, NOW() - INTERVAL '3 days'),
     
    (md5('notif-course-complete-1')::uuid, '88888888-8888-8888-8888-888888888888', 'course_complete', 
     'Congratulations! You have completed "Modern JavaScript Fundamentals" course', true, NOW() - INTERVAL '30 days'),
     
    (md5('notif-forum-reply-1')::uuid, '66666666-6666-6666-6666-666666666666', 'forum_reply', 
     'Jennifer Lawrence replied to your forum topic "Custom React Hooks Examples"', false, NOW() - INTERVAL '4 days'),
     
    (md5('notif-new-course-1')::uuid, '77777777-7777-7777-7777-777777777777', 'new_course', 
     'A new course in UX/UI Design has been published that matches your interests', true, NOW() - INTERVAL '25 days'),
     
    (md5('notif-achievement-1')::uuid, '88888888-8888-8888-8888-888888888888', 'achievement', 
     'You have earned the "Perfect Score" trophy!', false, NOW() - INTERVAL '15 days')
ON CONFLICT (notification_id) DO NOTHING;

-- ----------------------
-- QUIZ ANSWERS
-- ----------------------

-- Add quiz answers for user quiz attempts
INSERT INTO user_quiz_answers (answer_id, attempt_id, question_id, option_id, text_answer, is_correct)
SELECT 
    md5(uqa.attempt_id::text || qq.question_id::text)::uuid,
    uqa.attempt_id,
    qq.question_id,
    CASE 
        WHEN qq.question_type = 'multiple_choice' THEN 
            (SELECT option_id FROM quiz_options WHERE question_id = qq.question_id AND is_correct = TRUE LIMIT 1)
        ELSE NULL
    END,
    CASE 
        WHEN qq.question_type = 'text' THEN 
            'This is a sample answer for the text question. It demonstrates understanding of the concept.'
        ELSE NULL
    END,
    CASE 
        WHEN uqa.user_id = '88888888-8888-8888-8888-888888888888' THEN TRUE
        ELSE random() > 0.2  -- 80% chance of being correct
    END
FROM 
    user_quiz_attempts uqa
JOIN 
    quizzes q ON uqa.quiz_id = q.quiz_id
JOIN 
    quiz_questions qq ON q.quiz_id = qq.quiz_id
WHERE 
    uqa.is_passed = TRUE
ON CONFLICT (answer_id) DO NOTHING;

-- ----------------------
-- ASSIGNMENT SUBMISSIONS
-- ----------------------

-- Add assignment submissions
INSERT INTO user_assignment_submissions (submission_id, user_id, assignment_id, submission_text, file_url, submission_date, score, feedback)
VALUES
    (md5('submit-component-alex')::uuid, '55555555-5555-5555-5555-555555555555', 'a0001111-a111-4b11-9c11-d11e11f11111',
     'I have created a reusable card component with image, title, and description as requested. I implemented it using React and CSS modules for styling.',
     'https://example.com/submissions/alex-card-component.zip',
     NOW() - INTERVAL '10 days',
     85,
     'Good implementation. The component is reusable and well-documented. For improvement, consider adding prop validation and default props.'),
     
    (md5('submit-hook-taylor')::uuid, '66666666-6666-6666-6666-666666666666', 'a0002222-a222-4b22-9c22-d22e22f22222',
     'My submission includes a custom useForm hook that handles form state, validation, and error messages. It works with any form structure.',
     'https://example.com/submissions/taylor-custom-hook.zip',
     NOW() - INTERVAL '15 days',
     92,
     'Excellent work! The hook is versatile and handles all the requirements. The validation logic is particularly well-implemented.'),
     
    (md5('submit-component-casey')::uuid, '88888888-8888-8888-8888-888888888888', 'a0001111-a111-4b11-9c11-d11e11f11111',
     'I created a card component that accepts props for image, title, description, and an optional action button. It has responsive styling.',
     'https://example.com/submissions/casey-card-component.zip',
     NOW() - INTERVAL '12 days',
     95,
     'Excellent implementation with great attention to detail. The responsive design and accessibility features are particularly impressive.')
ON CONFLICT (submission_id) DO NOTHING;

-- ----------------------
-- PROJECT SUBMISSIONS
-- ----------------------

-- Add project submissions
INSERT INTO user_project_submissions (submission_id, user_id, project_id, submission_text, file_url, submission_date, score, feedback)
VALUES
    (md5('project-todo-alex')::uuid, '55555555-5555-5555-5555-555555555555', 'b0001111-a111-4b11-9c11-d11e11f11111',
     'I have created a to-do list application that allows users to add, edit, delete, and mark tasks as complete. It uses local storage to persist data.',
     'https://example.com/submissions/alex-todo-app.zip',
     NOW() - INTERVAL '5 months',
     88,
     'Great implementation of the to-do app. The UI is clean and the functionality works as expected. For improvement, consider adding categories or priority levels.'),
     
    (md5('project-todo-taylor')::uuid, '66666666-6666-6666-6666-666666666666', 'b0001111-a111-4b11-9c11-d11e11f11111',
     'My to-do list app features task creation, completion tracking, filtering, and data persistence using local storage. I added extra features like due dates and priorities.',
     'https://example.com/submissions/taylor-todo-app.zip',
     NOW() - INTERVAL '4 months',
     94,
     'Outstanding work! The additional features like due dates and priorities enhance the usability. The code is well-organized and documented.'),
     
    (md5('project-todo-casey')::uuid, '88888888-8888-8888-8888-888888888888', 'b0001111-a111-4b11-9c11-d11e11f11111',
     'I built a feature-rich to-do application with task management, filtering, sorting, and local storage. I added drag-and-drop for reordering tasks and dark/light theme switching.',
     'https://example.com/submissions/casey-todo-app.zip',
     NOW() - INTERVAL '3 months',
     98,
     'Exceptional project! The drag-and-drop functionality and theme switching show excellent technical skills. Very clean code with good separation of concerns.')
ON CONFLICT (submission_id) DO NOTHING;

-- ----------------------
-- INSTRUCTOR RATINGS
-- ----------------------

-- Add instructor ratings
INSERT INTO instructor_ratings (instructor_rating_id, instructor_id, student_id, course_id, rating, review_text, rating_date)
VALUES
    (md5('rating-jen-alex')::uuid, '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555',
     'c0001111-a111-4b11-9c11-d11e11f11111', 5,
     'Jennifer is an excellent instructor who explains complex concepts in an easy-to-understand way. Her examples are practical and relevant.',
     NOW() - INTERVAL '6 months'),
     
    (md5('rating-jen-taylor')::uuid, '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666',
     'c0001111-a111-4b11-9c11-d11e11f11111', 4,
     'Very knowledgeable instructor who responds quickly to questions. The course material was well-structured.',
     NOW() - INTERVAL '5 months'),
     
    (md5('rating-michael-casey')::uuid, '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888',
     'c0004444-a444-4b44-9c44-d44e44f44444', 5,
     'Michael\'s teaching style is excellent. His explanations of data science concepts were clear and the practical examples helped reinforce the learning.',
     NOW() - INTERVAL '2 months')
ON CONFLICT (instructor_rating_id) DO NOTHING;

-- ----------------------
-- STUDENT RATINGS
-- ----------------------

-- Add student ratings from instructors
INSERT INTO student_ratings (student_rating_id, student_id, instructor_id, course_id, rating, feedback_text, rating_date)
VALUES
    (md5('student-alex-jen')::uuid, '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222',
     'c0001111-a111-4b11-9c11-d11e11f11111', 4,
     'Alex showed great enthusiasm and completed all assignments on time. Good understanding of JavaScript fundamentals.',
     NOW() - INTERVAL '6 months'),
     
    (md5('student-taylor-jen')::uuid, '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222',
     'c0001111-a111-4b11-9c11-d11e11f11111', 5,
     'Taylor demonstrated excellent understanding of the course material and went beyond requirements in assignments. Asked thoughtful questions.',
     NOW() - INTERVAL '5 months'),
     
    (md5('student-casey-michael')::uuid, '88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333',
     'c0004444-a444-4b44-9c44-d44e44f44444', 5,
     'Casey excelled in the data science course, showing great aptitude for working with datasets and implementing algorithms. Project work was exceptional.',
     NOW() - INTERVAL '2 months')
ON CONFLICT (student_rating_id) DO NOTHING;

-- ----------------------
-- COURSE ACCESS PURCHASES
-- ----------------------

-- Add course access purchases records
INSERT INTO course_access_purchases (purchase_id, user_id, course_id, tokens_spent, purchase_date)
SELECT 
    md5('purchase-' || e.student_id::text || e.course_id::text)::uuid,
    e.student_id,
    e.course_id,
    e.tokens_spent,
    e.enroll_date
FROM 
    enrollments e
WHERE 
    e.tokens_spent > 0
ON CONFLICT (user_id, course_id) DO NOTHING;

COMMIT; 