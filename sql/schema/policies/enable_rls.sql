-- Enable Row Level Security (RLS) on relevant tables
-- This enforces access control at the database level

-- Core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- User data tables
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_submissions ENABLE ROW LEVEL SECURITY;

-- Add more tables as needed 