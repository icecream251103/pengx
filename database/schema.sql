-- Create database tables for PentaGold project

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    kyc_status TEXT CHECK (kyc_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    kyc_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_data JSONB
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_hash TEXT UNIQUE NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('buy', 'sell', 'transfer', 'dca', 'lending', 'borrowing')) NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    token_symbol TEXT NOT NULL,
    price_at_time DECIMAL(18,8) NOT NULL,
    gas_fee DECIMAL(18,8) DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- DCA Strategies table
CREATE TABLE IF NOT EXISTS dca_strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_symbol TEXT NOT NULL,
    amount_per_period DECIMAL(18,8) NOT NULL,
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    next_execution TIMESTAMP WITH TIME ZONE NOT NULL,
    total_invested DECIMAL(18,8) DEFAULT 0,
    total_tokens_acquired DECIMAL(18,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Price History table
CREATE TABLE IF NOT EXISTS price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token_symbol TEXT NOT NULL,
    price_usd DECIMAL(18,8) NOT NULL,
    price_vnd DECIMAL(18,2) NOT NULL,
    volume_24h DECIMAL(18,8) DEFAULT 0,
    market_cap DECIMAL(18,2) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT NOT NULL
);

-- User Portfolios table
CREATE TABLE IF NOT EXISTS user_portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_symbol TEXT NOT NULL,
    balance DECIMAL(18,8) NOT NULL DEFAULT 0,
    locked_balance DECIMAL(18,8) DEFAULT 0,
    average_cost DECIMAL(18,8) DEFAULT 0,
    total_invested DECIMAL(18,8) DEFAULT 0,
    unrealized_pnl DECIMAL(18,8) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token_symbol)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- KYC Data table
CREATE TABLE IF NOT EXISTS kyc_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    id_number TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT NOT NULL,
    id_front_image TEXT NOT NULL,
    id_back_image TEXT NOT NULL,
    selfie_image TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES users(id)
);

-- Lending Positions table
CREATE TABLE IF NOT EXISTS lending_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_symbol TEXT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    annual_rate DECIMAL(5,4) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    earned_interest DECIMAL(18,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Borrowing Positions table
CREATE TABLE IF NOT EXISTS borrowing_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    collateral_token TEXT NOT NULL,
    collateral_amount DECIMAL(18,8) NOT NULL,
    borrowed_token TEXT NOT NULL,
    borrowed_amount DECIMAL(18,8) NOT NULL,
    interest_rate DECIMAL(5,4) NOT NULL,
    liquidation_threshold DECIMAL(5,4) NOT NULL,
    health_factor DECIMAL(5,4) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('active', 'repaid', 'liquidated')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_dca_strategies_user_id ON dca_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_dca_strategies_next_execution ON dca_strategies(next_execution);
CREATE INDEX IF NOT EXISTS idx_price_history_symbol_timestamp ON price_history(token_symbol, timestamp);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_id ON user_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_kyc_data_user_id ON kyc_data(user_id);
CREATE INDEX IF NOT EXISTS idx_lending_positions_user_id ON lending_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_positions_user_id ON borrowing_positions(user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dca_strategies_updated_at BEFORE UPDATE ON dca_strategies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_portfolios_updated_at BEFORE UPDATE ON user_portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lending_positions_updated_at BEFORE UPDATE ON lending_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_borrowing_positions_updated_at BEFORE UPDATE ON borrowing_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dca_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE lending_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowing_positions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can only manage their own DCA strategies
CREATE POLICY "Users can view own DCA strategies" ON dca_strategies FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can manage own DCA strategies" ON dca_strategies FOR ALL USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can only see their own portfolios
CREATE POLICY "Users can view own portfolios" ON user_portfolios FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can manage own portfolios" ON user_portfolios FOR ALL USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can only see their own KYC data
CREATE POLICY "Users can view own KYC data" ON kyc_data FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can manage own KYC data" ON kyc_data FOR ALL USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can only see their own lending positions
CREATE POLICY "Users can view own lending positions" ON lending_positions FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can manage own lending positions" ON lending_positions FOR ALL USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can only see their own borrowing positions
CREATE POLICY "Users can view own borrowing positions" ON borrowing_positions FOR SELECT USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
CREATE POLICY "Users can manage own borrowing positions" ON borrowing_positions FOR ALL USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Price history is public (read-only)
CREATE POLICY "Price history is public" ON price_history FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO users (wallet_address, email, kyc_status, kyc_level) VALUES 
('0x1234567890abcdef1234567890abcdef12345678', 'user1@example.com', 'approved', 1),
('0xabcdef1234567890abcdef1234567890abcdef12', 'user2@example.com', 'pending', 0);

INSERT INTO price_history (token_symbol, price_usd, price_vnd, volume_24h, market_cap, source) VALUES 
('PenGx', 2400.50, 59000000, 1000000, 2400000000, 'oracle'),
('PenSx', 28.75, 700000, 500000, 28750000, 'oracle'),
('PenPx', 950.25, 23500000, 200000, 950250000, 'oracle');
