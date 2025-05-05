-- Seed file for development data
-- This will populate your database with sample data for testing

-- Add a demo admin user
INSERT INTO users (user_id, email, name, password_hash, is_admin)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin User', '**********', true),
  ('22222222-2222-2222-2222-222222222222', 'teacher@example.com', 'Teacher User', '**********', false),
  ('33333333-3333-3333-3333-333333333333', 'student@example.com', 'Student User', '**********', false)
ON CONFLICT (user_id) DO NOTHING;

-- Create a few sample course categories as tags
INSERT INTO tags (name) 
VALUES 
  ('Programming'),
  ('Design'),
  ('Business'),
  ('Photography'),
  ('Marketing')
ON CONFLICT (name) DO NOTHING;

-- Create sample courses
INSERT INTO courses (course_id, title, description, difficulty_level, xp_points, launch_token_cost, status, thumbnail_url)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Introduction to Programming', 'Learn the basics of programming with this beginner-friendly course', 1, 100, 5, 'published', 'https://example.com/thumbnails/programming.jpg'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Web Design Fundamentals', 'Master the core principles of web design', 1, 100, 10, 'published', 'https://example.com/thumbnails/webdesign.jpg'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Advanced JavaScript', 'Take your JavaScript skills to the next level', 3, 300, 20, 'published', 'https://example.com/thumbnails/javascript.jpg'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Introduction to Photography', 'Learn the basics of photography', 1, 100, 5, 'published', 'https://example.com/thumbnails/photography.jpg'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Digital Marketing Strategy', 'Develop effective digital marketing campaigns', 2, 200, 15, 'draft', 'https://example.com/thumbnails/marketing.jpg')
ON CONFLICT (course_id) DO NOTHING;

-- Assign course instructors
INSERT INTO course_instructors (user_id, course_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Tag the courses
INSERT INTO course_tags (course_id, tag_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT tag_id FROM tags WHERE name = 'Programming')),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT tag_id FROM tags WHERE name = 'Design')),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT tag_id FROM tags WHERE name = 'Programming')),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT tag_id FROM tags WHERE name = 'Photography')),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT tag_id FROM tags WHERE name = 'Marketing')),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT tag_id FROM tags WHERE name = 'Business'))
ON CONFLICT (course_id, tag_id) DO NOTHING;

-- Create some modules
INSERT INTO modules (module_id, course_id, title, position)
VALUES
  ('11111111-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Getting Started with Programming', 1),
  ('22222222-aaaa-aaaa-aaaa-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Variables and Data Types', 2),
  ('33333333-aaaa-aaaa-aaaa-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Control Flow and Loops', 3),
  ('44444444-bbbb-bbbb-bbbb-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Design Principles', 1),
  ('55555555-bbbb-bbbb-bbbb-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Color Theory', 2)
ON CONFLICT (course_id, position) DO NOTHING;

-- Create some lessons
INSERT INTO lessons (lesson_id, module_id, title, content_type, content_url, content_text, position)
VALUES
  ('11111111-1111-1111-1111-aaaaaaaaaaaa', '11111111-aaaa-aaaa-aaaa-111111111111', 'Introduction to Coding', 'video', 'https://example.com/videos/intro-to-coding.mp4', NULL, 1),
  ('22222222-2222-2222-2222-aaaaaaaaaaaa', '11111111-aaaa-aaaa-aaaa-111111111111', 'Setting Up Your Environment', 'text', NULL, 'In this lesson, we''ll set up your development environment...', 2),
  ('33333333-3333-3333-3333-aaaaaaaaaaaa', '22222222-aaaa-aaaa-aaaa-222222222222', 'Understanding Variables', 'video', 'https://example.com/videos/variables.mp4', NULL, 1),
  ('44444444-4444-4444-4444-bbbbbbbbbbbb', '44444444-bbbb-bbbb-bbbb-444444444444', 'The Rule of Thirds', 'video', 'https://example.com/videos/rule-of-thirds.mp4', NULL, 1)
ON CONFLICT (module_id, position) DO NOTHING;

-- Create a quiz
INSERT INTO quizzes (quiz_id, module_id, title, instructions, max_score)
VALUES
  ('11111111-quiz-quiz-quiz-111111111111', '11111111-aaaa-aaaa-aaaa-111111111111', 'Getting Started Quiz', 'Answer all questions to proceed to the next module', 100)
ON CONFLICT DO NOTHING;

-- Create quiz questions
INSERT INTO quiz_questions (question_id, quiz_id, question_text, question_type, points, position)
VALUES
  ('11111111-ques-ques-ques-111111111111', '11111111-quiz-quiz-quiz-111111111111', 'What does HTML stand for?', 'multiple_choice', 25, 1),
  ('22222222-ques-ques-ques-222222222222', '11111111-quiz-quiz-quiz-111111111111', 'Which of the following is a programming language?', 'multiple_choice', 25, 2)
ON CONFLICT (quiz_id, position) DO NOTHING;

-- Create quiz options
INSERT INTO quiz_options (option_id, question_id, option_text, is_correct, position)
VALUES
  ('11111111-opt1-opt1-opt1-111111111111', '11111111-ques-ques-ques-111111111111', 'Hyper Text Markup Language', true, 1),
  ('22222222-opt1-opt1-opt1-222222222222', '11111111-ques-ques-ques-111111111111', 'High Tech Modern Language', false, 2),
  ('33333333-opt1-opt1-opt1-333333333333', '11111111-ques-ques-ques-111111111111', 'Hyper Transfer Markup Language', false, 3),
  ('11111111-opt2-opt2-opt2-111111111111', '22222222-ques-ques-ques-222222222222', 'JavaScript', true, 1),
  ('22222222-opt2-opt2-opt2-222222222222', '22222222-ques-ques-ques-222222222222', 'Microsoft Word', false, 2),
  ('33333333-opt2-opt2-opt2-333333333333', '22222222-ques-ques-ques-222222222222', 'Adobe Photoshop', false, 3)
ON CONFLICT (question_id, position) DO NOTHING;

-- Create some assignments
INSERT INTO assignments (assignment_id, module_id, title, description, points)
VALUES
  ('11111111-assg-assg-assg-111111111111', '22222222-aaaa-aaaa-aaaa-222222222222', 'Create a Calculator', 'Build a simple calculator using variables and operations', 100),
  ('22222222-assg-assg-assg-222222222222', '44444444-bbbb-bbbb-bbbb-444444444444', 'Design a Logo', 'Create a logo following design principles', 100)
ON CONFLICT DO NOTHING;

-- Create a project
INSERT INTO projects (project_id, course_id, title, description, points)
VALUES
  ('11111111-proj-proj-proj-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Build a Small Website', 'Apply everything you learned to build a simple website', 200)
ON CONFLICT DO NOTHING;

-- Enroll student in courses
INSERT INTO enrollments (enrollment_id, student_id, course_id, tokens_spent, progress_percent)
VALUES
  ('11111111-enrl-enrl-enrl-111111111111', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 30),
  ('22222222-enrl-enrl-enrl-222222222222', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 10, 15)
ON CONFLICT DO NOTHING;

-- Create some module completions
INSERT INTO user_module_completion (user_id, module_id)
VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-aaaa-aaaa-aaaa-111111111111')
ON CONFLICT DO NOTHING;

-- Create some lesson views
INSERT INTO user_lesson_view (user_id, lesson_id, is_completed)
VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-aaaaaaaaaaaa', true),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-aaaaaaaaaaaa', true)
ON CONFLICT DO NOTHING;

-- Initialize token balances
INSERT INTO user_tokens (user_id, token_balance)
VALUES
  ('11111111-1111-1111-1111-111111111111', 100),
  ('22222222-2222-2222-2222-222222222222', 75),
  ('33333333-3333-3333-3333-333333333333', 50)
ON CONFLICT (user_id) DO NOTHING;

-- Add some token transactions
INSERT INTO token_transactions (transaction_id, user_id, amount, transaction_type, source_type, description)
VALUES
  ('11111111-tran-tran-tran-111111111111', '33333333-3333-3333-3333-333333333333', -5, 'spent', 'Course', 'Enrollment in Introduction to Programming'),
  ('22222222-tran-tran-tran-222222222222', '33333333-3333-3333-3333-333333333333', -10, 'spent', 'Course', 'Enrollment in Web Design Fundamentals'),
  ('33333333-tran-tran-tran-333333333333', '33333333-3333-3333-3333-333333333333', 20, 'reward', 'System', 'New user bonus')
ON CONFLICT DO NOTHING;

-- Add a course rating
INSERT INTO course_ratings (rating_id, course_id, student_id, rating, review_text)
VALUES
  ('11111111-rate-rate-rate-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 5, 'Great introduction to programming concepts!')
ON CONFLICT DO NOTHING;

-- Insert difficulty levels
INSERT INTO difficulty_levels (name, trophy_type, xp_factor)
VALUES 
('Beginner', 'Bronze', 1),
('Intermediate', 'Silver', 2),
('Advanced', 'Gold', 3),
('Expert', 'Platinum', 4);

-- Insert trophies
INSERT INTO trophies (name, icon_image, description)
VALUES 
('Bronze', '/images/trophies/bronze.png', 'Completed a beginner course'),
('Silver', '/images/trophies/silver.png', 'Completed an intermediate course'),
('Gold', '/images/trophies/gold.png', 'Completed an advanced course'),
('Platinum', '/images/trophies/platinum.png', 'Completed an expert course');

-- Insert tags
INSERT INTO tags (name)
VALUES 
('JavaScript'),
('Python'),
('Web Development'),
('Data Science'),
('Machine Learning'),
('Cloud Computing'),
('DevOps'),
('Mobile Development'),
('Frontend'),
('Backend');

-- Insert admin user
INSERT INTO users (user_id, email, name, password_hash, is_admin)
VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', TRUE);

-- Insert instructor users
INSERT INTO users (user_id, email, name, password_hash, total_xp)
VALUES 
('00000000-0000-0000-0000-000000000002', 'instructor1@example.com', 'John Smith', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 5000),
('00000000-0000-0000-0000-000000000003', 'instructor2@example.com', 'Jane Doe', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 4500);

-- Insert student users
INSERT INTO users (user_id, email, name, password_hash, total_xp)
VALUES 
('00000000-0000-0000-0000-000000000004', 'student1@example.com', 'Alex Johnson', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1200),
('00000000-0000-0000-0000-000000000005', 'student2@example.com', 'Maria Garcia', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 800),
('00000000-0000-0000-0000-000000000006', 'student3@example.com', 'Raj Patel', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 350);

-- Add tokens to users
INSERT INTO user_tokens (user_id, balance)
VALUES 
('00000000-0000-0000-0000-000000000004', 100),
('00000000-0000-0000-0000-000000000005', 75),
('00000000-0000-0000-0000-000000000006', 50);

-- Insert courses
INSERT INTO courses (course_id, title, description, difficulty_level, xp_points, launch_token_cost, status, thumbnail_url)
VALUES 
('10000000-0000-0000-0000-000000000001', 'Introduction to JavaScript', 'Learn the basics of JavaScript programming language', 1, 100, 10, 'published', '/images/courses/js-intro.jpg'),
('10000000-0000-0000-0000-000000000002', 'Advanced Python Programming', 'Master Python with advanced concepts and techniques', 3, 300, 30, 'published', '/images/courses/python-advanced.jpg'),
('10000000-0000-0000-0000-000000000003', 'Full Stack Web Development', 'Build complete web applications from frontend to backend', 2, 200, 20, 'published', '/images/courses/fullstack.jpg'),
('10000000-0000-0000-0000-000000000004', 'Machine Learning Fundamentals', 'Introduction to machine learning concepts and algorithms', 2, 250, 25, 'published', '/images/courses/ml-intro.jpg'),
('10000000-0000-0000-0000-000000000005', 'Cloud Architecture', 'Design and implement scalable cloud solutions', 4, 400, 40, 'draft', '/images/courses/cloud-arch.jpg');

-- Assign instructors to courses
INSERT INTO course_instructors (user_id, course_id)
VALUES 
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004'),
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005');

-- Add course tags
INSERT INTO course_tags (course_id, tag_id)
VALUES 
('10000000-0000-0000-0000-000000000001', 1), -- JavaScript
('10000000-0000-0000-0000-000000000001', 3), -- Web Development
('10000000-0000-0000-0000-000000000001', 9), -- Frontend
('10000000-0000-0000-0000-000000000002', 2), -- Python
('10000000-0000-0000-0000-000000000002', 4), -- Data Science
('10000000-0000-0000-0000-000000000003', 1), -- JavaScript
('10000000-0000-0000-0000-000000000003', 3), -- Web Development
('10000000-0000-0000-0000-000000000003', 9), -- Frontend
('10000000-0000-0000-0000-000000000003', 10), -- Backend
('10000000-0000-0000-0000-000000000004', 2), -- Python
('10000000-0000-0000-0000-000000000004', 5), -- Machine Learning
('10000000-0000-0000-0000-000000000005', 6), -- Cloud Computing
('10000000-0000-0000-0000-000000000005', 7); -- DevOps

-- Create modules for JavaScript course
INSERT INTO modules (module_id, course_id, title, position)
VALUES 
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'JavaScript Basics', 1),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Functions and Objects', 2),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'DOM Manipulation', 3),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Events and Async JavaScript', 4);

-- Create lessons for JavaScript Basics module
INSERT INTO lessons (lesson_id, module_id, title, content_type, content_url, content_text, position)
VALUES 
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Introduction to JavaScript', 'video', 'https://example.com/videos/js-intro', 'Welcome to JavaScript!', 1),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Variables and Data Types', 'text', NULL, 'Learn about variables, primitive types, and how to declare them.', 2),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'Operators and Expressions', 'text', NULL, 'Learn about arithmetic, comparison, and logical operators.', 3),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'Control Flow', 'video', 'https://example.com/videos/js-control-flow', 'Learn about if/else statements and loops.', 4);

-- Create a quiz for JavaScript Basics module
INSERT INTO quizzes (quiz_id, module_id, title, instructions, max_score)
VALUES 
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'JavaScript Basics Quiz', 'Test your knowledge of JavaScript basics', 100);

-- Create quiz questions
INSERT INTO quiz_questions (question_id, quiz_id, question_text, question_type, points, position)
VALUES 
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Which of the following is a primitive data type in JavaScript?', 'multiple_choice', 20, 1),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'What is the correct way to declare a variable in JavaScript?', 'multiple_choice', 20, 2),
('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'What does the === operator do in JavaScript?', 'multiple_choice', 20, 3),
('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'Which loop statement will always execute at least once?', 'multiple_choice', 20, 4),
('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'Explain the concept of hoisting in JavaScript.', 'text', 20, 5);

-- Create quiz options for multiple choice questions
INSERT INTO quiz_options (option_id, question_id, option_text, is_correct, position)
VALUES 
-- Question 1 options
('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Object', FALSE, 1),
('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'Array', FALSE, 2),
('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'String', TRUE, 3),
('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001', 'Function', FALSE, 4),

-- Question 2 options
('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', 'var name = "John";', TRUE, 1),
('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000002', 'variable name = "John";', FALSE, 2),
('60000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000002', 'v name = "John";', FALSE, 3),
('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000002', 'var "John" = name;', FALSE, 4),

-- Question 3 options
('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000003', 'Checks for equality', FALSE, 1),
('60000000-0000-0000-0000-000000000010', '50000000-0000-0000-0000-000000000003', 'Checks for equality and type', TRUE, 2),
('60000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000003', 'Assigns a value', FALSE, 3),
('60000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000003', 'Checks for inequality', FALSE, 4),

-- Question 4 options
('60000000-0000-0000-0000-000000000013', '50000000-0000-0000-0000-000000000004', 'for', FALSE, 1),
('60000000-0000-0000-0000-000000000014', '50000000-0000-0000-0000-000000000004', 'while', FALSE, 2),
('60000000-0000-0000-0000-000000000015', '50000000-0000-0000-0000-000000000004', 'do-while', TRUE, 3),
('60000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000004', 'forEach', FALSE, 4);

-- Create an assignment for the JavaScript Basics module
INSERT INTO assignments (assignment_id, module_id, title, description, points)
VALUES 
('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'JavaScript Calculator', 'Create a simple calculator using JavaScript', 100);

-- Create a project for the JavaScript course
INSERT INTO projects (project_id, course_id, title, description, points)
VALUES 
('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Interactive Web Page', 'Build an interactive web page using JavaScript', 200);

-- Enroll students in courses
INSERT INTO enrollments (enrollment_id, student_id, course_id, enroll_date, progress_percent, status, tokens_spent)
VALUES 
('90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days', 75, 'in_progress', 10),
('90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', NOW() - INTERVAL '15 days', 25, 'in_progress', 30),
('90000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '45 days', 100, 'completed', 10),
('90000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', NOW() - INTERVAL '20 days', 50, 'in_progress', 20),
('90000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days', 15, 'in_progress', 10);

-- Record lesson views
INSERT INTO user_lesson_view (user_id, lesson_id, viewed_date, is_completed)
VALUES 
('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', NOW() - INTERVAL '29 days', TRUE),
('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', NOW() - INTERVAL '28 days', TRUE),
('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', NOW() - INTERVAL '25 days', TRUE),
('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', NOW() - INTERVAL '20 days', FALSE),
('00000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', NOW() - INTERVAL '44 days', TRUE),
('00000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', NOW() - INTERVAL '43 days', TRUE),
('00000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', NOW() - INTERVAL '42 days', TRUE),
('00000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000004', NOW() - INTERVAL '41 days', TRUE),
('00000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', NOW() - INTERVAL '9 days', TRUE),
('00000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000002', NOW() - INTERVAL '8 days', FALSE);

-- Record module completions
INSERT INTO user_module_completion (user_id, module_id, completion_date)
VALUES 
('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 days'),
('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '10 days'),
('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', NOW() - INTERVAL '41 days'),
('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', NOW() - INTERVAL '35 days'),
('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', NOW() - INTERVAL '30 days'),
('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', NOW() - INTERVAL '25 days');

-- Record quiz attempts
INSERT INTO user_quiz_attempts (attempt_id, user_id, quiz_id, score, started_at, completed_at, is_passed)
VALUES 
('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 80, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days', TRUE),
('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 90, NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days', TRUE),
('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000001', 60, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', TRUE);

-- Record quiz answers
INSERT INTO user_quiz_answers (answer_id, attempt_id, question_id, option_id, is_correct)
VALUES 
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000003', TRUE),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000005', TRUE),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000010', TRUE),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000014', FALSE);

-- Add user trophies
INSERT INTO user_trophies (user_id, trophy_id, course_id, date_earned)
VALUES 
('00000000-0000-0000-0000-000000000005', 1, '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '25 days');

-- Add certificates
INSERT INTO certificates (certificate_id, user_id, course_id, issue_date, certificate_code)
VALUES 
('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', NOW() - INTERVAL '25 days', 'CERT-JS001');

-- Add course ratings
INSERT INTO course_ratings (rating_id, course_id, student_id, rating, review_text)
VALUES 
('d0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 5, 'Excellent course, learned a lot!'),
('d0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 4, 'Very good content, well explained.');

-- Add token transactions
INSERT INTO token_transactions (transaction_id, user_id, amount, transaction_type, source_type, source_id, description)
VALUES 
('e0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', -10, 'spent', 'Course', '10000000-0000-0000-0000-000000000001', 'Course enrollment: Introduction to JavaScript'),
('e0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', -30, 'spent', 'Course', '10000000-0000-0000-0000-000000000002', 'Course enrollment: Advanced Python Programming'),
('e0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', -10, 'spent', 'Course', '10000000-0000-0000-0000-000000000001', 'Course enrollment: Introduction to JavaScript'),
('e0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', -20, 'spent', 'Course', '10000000-0000-0000-0000-000000000003', 'Course enrollment: Full Stack Web Development'),
('e0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', -10, 'spent', 'Course', '10000000-0000-0000-0000-000000000001', 'Course enrollment: Introduction to JavaScript'); 