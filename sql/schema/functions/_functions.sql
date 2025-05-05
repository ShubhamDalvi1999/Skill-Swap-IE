-- Main file for loading all database functions

-- Authentication and user management functions
\i 'schema/functions/handle_new_user.sql'

-- Token management functions
\i 'schema/functions/update_user_token_balance.sql'

-- Helper functions (if any)
-- \i 'schema/functions/other_helpers.sql' 