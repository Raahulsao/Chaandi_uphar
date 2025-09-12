-- Migration: Enhanced referral system features
-- Version: 003_enhanced_referrals.sql
-- Description: Add additional fields and features to the referral system

-- Check if migration should run
DO $$
BEGIN
  IF migration_exists('003') THEN
    RAISE NOTICE 'Migration 003 already executed, skipping...';
    RETURN;
  END IF;
END $$;

-- Add referral analytics table
CREATE TABLE IF NOT EXISTS referral_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  last_click_at TIMESTAMP WITH TIME ZONE,
  last_conversion_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add referral campaign tracking
CREATE TABLE IF NOT EXISTS referral_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reward_amount DECIMAL(10,2) NOT NULL,
  bonus_multiplier DECIMAL(3,2) DEFAULT 1.0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add campaign tracking to referrals
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES referral_campaigns(id),
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS medium VARCHAR(50) DEFAULT 'referral';

-- Add social sharing tracking
CREATE TABLE IF NOT EXISTS referral_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'whatsapp', 'facebook', 'twitter', 'email', etc.
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_referral_analytics_user_id ON referral_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_analytics_referral_code ON referral_analytics(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_campaigns_active ON referral_campaigns(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_referral_shares_user_id ON referral_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_shares_platform ON referral_shares(platform);

-- Add RLS policies for new tables
ALTER TABLE referral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_shares ENABLE ROW LEVEL SECURITY;

-- Users can view their own analytics
CREATE POLICY "Users can view own referral analytics" ON referral_analytics
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Anyone can view active campaigns
CREATE POLICY "Anyone can view active campaigns" ON referral_campaigns
  FOR SELECT USING (is_active = TRUE);

-- Users can view their own shares
CREATE POLICY "Users can view own referral shares" ON referral_shares
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own shares
CREATE POLICY "Users can insert own referral shares" ON referral_shares
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create trigger for analytics updates
CREATE OR REPLACE FUNCTION update_referral_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when referral is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO referral_analytics (user_id, referral_code, conversions, total_earnings, last_conversion_at)
    VALUES (NEW.referrer_id, NEW.referral_code, 1, NEW.reward_amount, NOW())
    ON CONFLICT (user_id, referral_code) DO UPDATE SET
      conversions = referral_analytics.conversions + 1,
      total_earnings = referral_analytics.total_earnings + NEW.reward_amount,
      last_conversion_at = NOW(),
      conversion_rate = CASE 
        WHEN referral_analytics.clicks > 0 THEN 
          ((referral_analytics.conversions + 1)::decimal / referral_analytics.clicks) * 100
        ELSE 0
      END,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referral_analytics_trigger
  AFTER UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_analytics();

-- Insert default campaign
INSERT INTO referral_campaigns (name, description, reward_amount, bonus_multiplier, is_active) VALUES 
  ('Launch Campaign', 'Default referral campaign for app launch', 500.00, 1.0, TRUE)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL ON referral_analytics TO postgres, authenticated, service_role;
GRANT ALL ON referral_campaigns TO postgres, authenticated, service_role;
GRANT ALL ON referral_shares TO postgres, authenticated, service_role;

-- Record this migration
SELECT record_migration('003', 'enhanced_referrals', 'Add referral analytics, campaigns, and social sharing tracking', 0);