-- Migration: Seed Future Tables
-- Description: Adding sample data for the new scalability and feature tables

BEGIN;

-- Seed activity logs
INSERT INTO user_activity_logs (user_id, activity_type, source_table, source_id, details, ip_address) VALUES
-- John Doe activities
(
    '55555555-5555-5555-5555-555555555555',
    'course_enrolled',
    'courses',
    'c0001111-a111-4b11-9c11-d11e11f11111',
    '{"course_name": "Modern JavaScript Fundamentals", "token_cost": 0}',
    '192.168.1.1'
),
(
    '55555555-5555-5555-5555-555555555555',
    'lesson_viewed',
    'lessons',
    'b0001111-a111-4b11-9c11-d11e11f11111',
    '{"lesson_name": "Introduction to JavaScript Variables", "duration": 450}',
    '192.168.1.1'
),
(
    '55555555-5555-5555-5555-555555555555',
    'quiz_completed',
    'quizzes',
    'd0001111-a111-4b11-9c11-d11e11f11111',
    '{"quiz_name": "JavaScript Basics Quiz", "score": 85, "pass": true}',
    '192.168.1.1'
),
-- Jane Smith activities
(
    '66666666-6666-6666-6666-666666666666',
    'course_enrolled',
    'courses',
    'c0004444-a444-4b44-9c44-d44e44f44444',
    '{"course_name": "Introduction to Data Science with Python", "token_cost": 10}',
    '192.168.1.2'
),
(
    '66666666-6666-6666-6666-666666666666',
    'assignment_submitted',
    'assignments',
    'a0001111-a111-4b11-9c11-d11e11f11111',
    '{"assignment_name": "Python Data Analysis Project", "submission_time": "2025-05-06T10:30:00Z"}',
    '192.168.1.2'
),
-- Bob Johnson activities
(
    '77777777-7777-7777-7777-777777777777',
    'login',
    'users',
    '77777777-7777-7777-7777-777777777777',
    '{"platform": "web", "browser": "Chrome", "os": "Windows"}',
    '192.168.1.3'
),
(
    '77777777-7777-7777-7777-777777777777',
    'trophy_earned',
    'trophies',
    'a1111111-a111-4b11-9c11-d11e11f11111',
    '{"trophy_name": "Bronze Trophy", "course_name": "React: From Zero to Hero"}',
    '192.168.1.3'
);

-- Seed notifications
INSERT INTO user_notifications (user_id, notification_type, source_table, source_id, content, link_url) VALUES
-- John Doe notifications
(
    '55555555-5555-5555-5555-555555555555',
    'assignment_due',
    'assignments',
    'a0001111-a111-4b11-9c11-d11e11f11111',
    'Your assignment "JavaScript Variables Exercise" is due tomorrow!',
    '/courses/c0001111-a111-4b11-9c11-d11e11f11111/assignments/a0001111-a111-4b11-9c11-d11e11f11111'
),
(
    '55555555-5555-5555-5555-555555555555',
    'course_update',
    'courses',
    'c0001111-a111-4b11-9c11-d11e11f11111',
    'New content added to "Modern JavaScript Fundamentals"',
    '/courses/c0001111-a111-4b11-9c11-d11e11f11111'
),
-- Jane Smith notifications
(
    '66666666-6666-6666-6666-666666666666',
    'assignment_graded',
    'assignments',
    'a0002222-a222-4b22-9c22-d22e22f22222',
    'Your assignment "Data Visualization Project" has been graded. You received 95/100!',
    '/courses/c0004444-a444-4b44-9c44-d44e44f44444/assignments/a0002222-a222-4b22-9c22-d22e22f22222'
),
-- Bob Johnson notifications
(
    '77777777-7777-7777-7777-777777777777',
    'trophy_earned',
    'trophies',
    'a1111111-a111-4b11-9c11-d11e11f11111',
    'Congratulations! You earned the Bronze Trophy for completing "React: From Zero to Hero"',
    '/profile/trophies'
),
(
    '77777777-7777-7777-7777-777777777777',
    'new_message',
    'messages',
    'c8881111-a111-4b11-9c11-d11e11f11111',
    'You have a new message from Emily Davis',
    '/messages'
);

-- Seed conversations and messages
-- Conversation between John Doe and Alice Williams (instructor)
INSERT INTO conversations (conversation_id, participant1_id, participant2_id, course_id) VALUES
(
    'a7771111-a111-4b11-9c11-d11e11f11111',
    '55555555-5555-5555-5555-555555555555', -- John Doe
    '22222222-2222-2222-2222-222222222222', -- Instructor 
    'c0001111-a111-4b11-9c11-d11e11f11111' -- Modern JavaScript Fundamentals
);

-- Messages in John and Alice's conversation
INSERT INTO messages (message_id, conversation_id, sender_id, subject, body, is_read) VALUES
(
    'a8881111-a111-4b11-9c11-d11e11f11111',
    'a7771111-a111-4b11-9c11-d11e11f11111',
    '55555555-5555-5555-5555-555555555555', -- John Doe
    'Question about JavaScript Closures',
    'Hi Alice, I''m having trouble understanding closures in JavaScript. Could you provide some additional examples?',
    true
),
(
    'a8882222-a222-4b22-9c22-d22e22f22222',
    'a7771111-a111-4b11-9c11-d11e11f11111',
    '22222222-2222-2222-2222-222222222222', -- Alice Williams (instructor)
    'RE: Question about JavaScript Closures',
    'Hi John, I''d be happy to help! Think of closures as functions that "remember" the environment they were created in. Here''s a simple example...',
    true
),
(
    'a8883333-a333-4b33-9c33-d33e33f33333',
    'a7771111-a111-4b11-9c11-d11e11f11111',
    '55555555-5555-5555-5555-555555555555', -- John Doe
    'RE: Question about JavaScript Closures',
    'Thanks Alice! That makes much more sense now. I''ll review the examples you provided.',
    false
);

-- Conversation between Jane Smith and Bob Johnson (student-to-student)
INSERT INTO conversations (conversation_id, participant1_id, participant2_id) VALUES
(
    'a7772222-a222-4b22-9c22-d22e22f22222',
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    '77777777-7777-7777-7777-777777777777'  -- Bob Johnson
);

-- Messages in Jane and Bob's conversation
INSERT INTO messages (message_id, conversation_id, sender_id, subject, body, is_read) VALUES
(
    'a8884444-a444-4b44-9c44-d44e44f44444',
    'a7772222-a222-4b22-9c22-d22e22f22222',
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    'Study Group for Data Science Course',
    'Hi Bob, I noticed you''re also taking the Data Science course. Would you be interested in forming a study group?',
    true
),
(
    'a8885555-a555-4b55-9c55-d55e55f55555',
    'a7772222-a222-4b22-9c22-d22e22f22222',
    '77777777-7777-7777-7777-777777777777', -- Bob Johnson
    'RE: Study Group for Data Science Course',
    'Hi Jane, that sounds like a great idea! I''ve been struggling with some of the statistical concepts, so a study group would be helpful.',
    true
);

-- Seed content versions
-- Version history for a lesson
INSERT INTO content_versions (version_id, source_table, source_id, version_number, changed_by_user_id, content_snapshot) VALUES
(
    'a9991111-a111-4b11-9c11-d11e11f11111',
    'lessons',
    'b0001111-a111-4b11-9c11-d11e11f11111',
    1,
    '22222222-2222-2222-2222-222222222222', -- Alice Williams (instructor)
    '{"title":"Introduction to JavaScript Variables","content_type":"video","content_url":"https://example.com/videos/js-variables-v1","position":1}'
),
(
    'a9992222-a222-4b22-9c22-d22e22f22222',
    'lessons',
    'b0001111-a111-4b11-9c11-d11e11f11111',
    2,
    '22222222-2222-2222-2222-222222222222', -- Alice Williams (instructor)
    '{"title":"Introduction to JavaScript Variables","content_type":"video","content_url":"https://example.com/videos/js-variables-v2","position":1,"content_text":"Updated with clearer examples"}'
);

-- Seed user achievements
INSERT INTO user_achievements (user_achievement_id, user_id, achievement_id) VALUES
-- John Doe achievements
(
    'aa991111-a111-4b11-9c11-d11e11f11111',
    '55555555-5555-5555-5555-555555555555', -- John Doe
    1 -- Early Adopter - Use integer since platform_achievements.achievement_id is SERIAL
),
-- Jane Smith achievements
(
    'aa992222-a222-4b22-9c22-d22e22f22222',
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    3 -- Knowledge Seeker - Use integer since platform_achievements.achievement_id is SERIAL
),
(
    'aa993333-a333-4b33-9c33-d33e33f33333',
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    4 -- Perfect Score - Use integer since platform_achievements.achievement_id is SERIAL
),
-- Bob Johnson achievements
(
    'aa994444-a444-4b44-9c44-d44e44f44444',
    '77777777-7777-7777-7777-777777777777', -- Bob Johnson
    2 -- Course Creator - Use integer since platform_achievements.achievement_id is SERIAL
);

-- Seed user progress details
INSERT INTO user_progress_details (progress_detail_id, enrollment_id, user_id, content_type, content_id, status, score, details) VALUES
-- John Doe progress on JavaScript course
(
    'aad91111-a111-4b11-9c11-d11e11f11111',
    'e0001111-a111-4b11-9c11-d11e11f11111', -- Sample enrollment ID
    '55555555-5555-5555-5555-555555555555', -- John Doe
    'lesson',
    'b0001111-a111-4b11-9c11-d11e11f11111',
    'completed',
    NULL,
    '{"time_spent": 2700, "completion_date": "2025-05-01T14:30:00Z"}'
),
(
    'aad92222-a222-4b22-9c22-d22e22f22222',
    'e0001111-a111-4b11-9c11-d11e11f11111', -- Sample enrollment ID
    '55555555-5555-5555-5555-555555555555', -- John Doe
    'quiz',
    'd0001111-a111-4b11-9c11-d11e11f11111',
    'completed',
    85,
    '{"attempt_count": 1, "time_spent": 1200, "completion_date": "2025-05-01T15:00:00Z"}'
),
-- Jane Smith progress on Data Science course
(
    'aad93333-a333-4b33-9c33-d33e33f33333',
    'e0002222-a222-4b22-9c22-d22e22f22222', -- Sample enrollment ID
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    'lesson',
    'b0008888-a888-4b88-9c88-d88e88f88888',
    'completed',
    NULL,
    '{"time_spent": 3600, "completion_date": "2025-05-02T10:15:00Z"}'
),
(
    'aad94444-a444-4b44-9c44-d44e44f44444',
    'e0002222-a222-4b22-9c22-d22e22f22222', -- Sample enrollment ID
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    'assignment',
    'a0002222-a222-4b22-9c22-d22e22f22222',
    'submitted',
    95,
    '{"submission_date": "2025-05-03T16:45:00Z", "feedback": "Excellent work on the visualization project!"}'
);

-- Seed skills and user skills
-- Add skills to users
INSERT INTO user_skills (user_skill_id, user_id, skill_id, skill_level, is_teaching, is_learning, proficiency) VALUES
-- John Doe skills
(
    'aaa91111-a111-4b11-9c11-d11e11f11111',
    '55555555-5555-5555-5555-555555555555', -- John Doe
    1, -- JavaScript - Use integer since skills.skill_id is SERIAL
    'intermediate',
    false,
    true,
    3
),
(
    'aaa92222-a222-4b22-9c22-d22e22f22222',
    '55555555-5555-5555-5555-555555555555', -- John Doe
    3, -- React - Use integer since skills.skill_id is SERIAL
    'beginner',
    false,
    true,
    2
),
-- Jane Smith skills
(
    'aaa93333-a333-4b33-9c33-d33e33f33333',
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    2, -- Python - Use integer since skills.skill_id is SERIAL
    'advanced',
    true,
    false,
    5
),
(
    'aaa94444-a444-4b44-9c44-d44e44f44444',
    '66666666-6666-6666-6666-666666666666', -- Jane Smith
    4, -- Data Analysis - Use integer since skills.skill_id is SERIAL
    'advanced',
    true,
    false,
    5
),
-- Bob Johnson skills
(
    'aaa95555-a555-4b55-9c55-d55e55f55555',
    '77777777-7777-7777-7777-777777777777', -- Bob Johnson
    3, -- React - Use integer since skills.skill_id is SERIAL
    'advanced',
    true,
    false,
    5
),
(
    'aaa96666-a666-4b66-9c66-d66e66f66666',
    '77777777-7777-7777-7777-777777777777', -- Bob Johnson
    9, -- SQL - Use integer since skills.skill_id is SERIAL
    'intermediate',
    false,
    true,
    3
);

-- Add skills to courses
INSERT INTO course_skills (course_skill_id, course_id, skill_id, skill_level, relevance) VALUES
-- Modern JavaScript Fundamentals skills
(
    'aab91111-a111-4b11-9c11-d11e11f11111',
    'c0001111-a111-4b11-9c11-d11e11f11111', -- Modern JavaScript Fundamentals
    1, -- JavaScript - Use integer since skills.skill_id is SERIAL
    'beginner',
    5
),
-- React: From Zero to Hero skills
(
    'aab92222-a222-4b22-9c22-d22e22f22222',
    'c0002222-a222-4b22-9c22-d22e22f22222', -- React: From Zero to Hero
    1, -- JavaScript - Use integer since skills.skill_id is SERIAL
    'intermediate',
    4
),
(
    'aab93333-a333-4b33-9c33-d33e33f33333',
    'c0002222-a222-4b22-9c22-d22e22f22222', -- React: From Zero to Hero
    3, -- React - Use integer since skills.skill_id is SERIAL
    'beginner',
    5
),
-- Introduction to Data Science with Python skills
(
    'aab94444-a444-4b44-9c44-d44e44f44444',
    'c0004444-a444-4b44-9c44-d44e44f44444', -- Introduction to Data Science with Python
    2, -- Python - Use integer since skills.skill_id is SERIAL
    'beginner',
    5
),
(
    'aab95555-a555-4b55-9c55-d55e55f55555',
    'c0004444-a444-4b44-9c44-d44e44f44444', -- Introduction to Data Science with Python
    4, -- Data Analysis - Use integer since skills.skill_id is SERIAL
    'beginner',
    5
);

COMMIT; 