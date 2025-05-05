-- Indexes for the users table
-- Improves query performance for common lookups

-- Index on email for faster lookups during authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on name for search functionality
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Partial index on admin users (usually a small subset)
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(user_id) WHERE is_admin = true; 