-- Update User Token Balance Function
-- Automatically updates user_tokens when a transaction occurs

CREATE OR REPLACE FUNCTION update_user_token_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a record if it doesn't exist
    INSERT INTO user_tokens (user_id, token_balance, last_updated)
    VALUES (NEW.user_id, 0, NOW())
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update the balance
    UPDATE user_tokens
    SET token_balance = token_balance + NEW.amount,
        last_updated = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that calls this function
CREATE TRIGGER trg_token_balance_update
AFTER INSERT ON token_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_token_balance(); 