-- Migration: Add database versioning system
-- Version: 001_init_versioning.sql
-- Description: Creates a migrations table to track database schema versions

-- Create migrations tracking table
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  execution_time_ms INTEGER,
  checksum VARCHAR(64)
);

-- Insert initial migration record
INSERT INTO migrations (version, name, description, execution_time_ms, checksum) VALUES 
  ('001', 'init_versioning', 'Initialize database versioning system', 0, 'init')
ON CONFLICT (version) DO NOTHING;

-- Create a function to record migrations
CREATE OR REPLACE FUNCTION record_migration(
  migration_version VARCHAR(50),
  migration_name VARCHAR(255),
  migration_description TEXT DEFAULT NULL,
  execution_time INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
  INSERT INTO migrations (version, name, description, execution_time_ms)
  VALUES (migration_version, migration_name, migration_description, execution_time)
  ON CONFLICT (version) DO UPDATE SET
    executed_at = NOW(),
    execution_time_ms = EXCLUDED.execution_time_ms;
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if migration exists
CREATE OR REPLACE FUNCTION migration_exists(migration_version VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM migrations WHERE version = migration_version);
END;
$$ LANGUAGE plpgsql;

-- Record the main schema migration
SELECT record_migration('002', 'main_schema', 'Create main application tables (users, orders, referrals)', 0);

-- Grant permissions
GRANT ALL ON migrations TO postgres, authenticated, service_role;
GRANT ALL ON SEQUENCE migrations_id_seq TO postgres, authenticated, service_role;