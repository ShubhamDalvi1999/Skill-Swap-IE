-- Row Level Security Policies for the users table
-- Controls who can view, edit, and delete user data

-- Policy: Users can view all users (for basic profile data)
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

-- Policy: Users can only update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Only admins can delete users
CREATE POLICY "Only admins can delete users" ON users
    FOR DELETE USING (
        (SELECT is_admin FROM users WHERE user_id = auth.uid())
    ); 