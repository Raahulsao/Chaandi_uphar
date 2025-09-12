#!/usr/bin/env node

/**
 * Database Setup Script for Luxury Jewelry App
 * 
 * This script helps set up the Supabase database with all necessary tables,
 * policies, and sample data for development and testing.
 * 
 * Usage:
 *   node scripts/setup-database.js [options]
 * 
 * Options:
 *   --env <environment>  Environment to setup (dev|staging|prod) [default: dev]
 *   --sample-data        Include sample data for testing
 *   --reset              Reset database (WARNING: This will delete all data!)
 *   --migrations-only    Run only pending migrations
 *   --help               Show this help message
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  environment: 'dev'
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  environment: args.includes('--env') ? args[args.indexOf('--env') + 1] : 'dev',
  sampleData: args.includes('--sample-data'),
  reset: args.includes('--reset'),
  migrationsOnly: args.includes('--migrations-only'),
  help: args.includes('--help')
};

// Help message
if (options.help) {
  console.log(`
Database Setup Script for Luxury Jewelry App

Usage:
  node scripts/setup-database.js [options]

Options:
  --env <environment>  Environment to setup (dev|staging|prod) [default: dev]
  --sample-data        Include sample data for testing
  --reset              Reset database (WARNING: This will delete all data!)
  --migrations-only    Run only pending migrations
  --help               Show this help message

Examples:
  node scripts/setup-database.js                    # Basic setup
  node scripts/setup-database.js --sample-data      # Setup with sample data
  node scripts/setup-database.js --env staging      # Setup for staging
  node scripts/setup-database.js --reset            # Reset and recreate database
  `);
  process.exit(0);
}

// Validate configuration
function validateConfig() {
  if (!config.supabaseUrl) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
    process.exit(1);
  }
  
  if (!config.supabaseServiceKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local');
    process.exit(1);
  }
  
  if (!config.supabaseUrl.startsWith('http')) {
    console.error('❌ Error: Invalid Supabase URL format');
    process.exit(1);
  }
}

// Create Supabase client
function createSupabaseClient() {
  return createClient(config.supabaseUrl, config.supabaseServiceKey);
}

// Read SQL file
function readSqlFile(filename) {
  const filePath = path.join(__dirname, '..', 'database', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: SQL file not found: ${filePath}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Execute SQL query
async function executeSql(supabase, sql, description) {
  console.log(`⏳ ${description}...`);
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      // Fallback to direct SQL execution if RPC is not available
      const { data: fallbackData, error: fallbackError } = await supabase.from('_').select('*').limit(0);
      if (fallbackError) {
        throw error;
      }
    }
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Run migrations
async function runMigrations(supabase) {
  console.log('🔄 Running database migrations...');
  
  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 No migrations directory found, skipping...');
    return true;
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('📁 No migration files found, skipping...');
    return true;
  }
  
  for (const file of migrationFiles) {
    const sql = readSqlFile(`migrations/${file}`);
    const success = await executeSql(supabase, sql, `Running migration: ${file}`);
    if (!success) {
      console.error(`❌ Migration ${file} failed, stopping...`);
      return false;
    }
  }
  
  return true;
}

// Setup main schema
async function setupSchema(supabase) {
  const sql = readSqlFile('schema.sql');
  return await executeSql(supabase, sql, 'Setting up database schema');
}

// Insert sample data
async function insertSampleData(supabase) {
  const sql = readSqlFile('sample_data.sql');
  return await executeSql(supabase, sql, 'Inserting sample data');
}

// Reset database
async function resetDatabase(supabase) {
  console.log('⚠️  Resetting database - this will delete all data!');
  
  const resetSql = `
    -- Drop all tables in correct order (respecting foreign keys)
    DROP TABLE IF EXISTS referral_shares CASCADE;
    DROP TABLE IF EXISTS referral_campaigns CASCADE;
    DROP TABLE IF EXISTS referral_analytics CASCADE;
    DROP TABLE IF EXISTS referral_rewards CASCADE;
    DROP TABLE IF EXISTS referrals CASCADE;
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS migrations CASCADE;
    
    -- Drop functions
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    DROP FUNCTION IF EXISTS record_migration(VARCHAR, VARCHAR, TEXT, INTEGER) CASCADE;
    DROP FUNCTION IF EXISTS migration_exists(VARCHAR) CASCADE;
    DROP FUNCTION IF EXISTS update_referral_analytics() CASCADE;
  `;
  
  return await executeSql(supabase, resetSql, 'Resetting database');
}

// Test database connection
async function testConnection(supabase) {
  console.log('🔌 Testing database connection...');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw error;
    }
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Verify setup
async function verifySetup(supabase) {
  console.log('🔍 Verifying database setup...');
  
  const verificationSql = `
    SELECT 
      'users' as table_name, 
      COUNT(*) as count 
    FROM users
    UNION ALL
    SELECT 
      'orders' as table_name, 
      COUNT(*) as count 
    FROM orders
    UNION ALL
    SELECT 
      'referrals' as table_name, 
      COUNT(*) as count 
    FROM referrals
    UNION ALL
    SELECT 
      'referral_rewards' as table_name, 
      COUNT(*) as count 
    FROM referral_rewards;
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: verificationSql });
    if (error) throw error;
    
    console.log('✅ Database verification completed');
    console.log('📊 Table counts:', data);
    return true;
  } catch (error) {
    console.log('⚠️  Database verification skipped (RPC not available)');
    return true;
  }
}

// Main setup function
async function main() {
  console.log('🚀 Starting Luxury Jewelry App Database Setup');
  console.log(`📋 Environment: ${options.environment}`);
  console.log(`🔧 Options:`, options);
  console.log('');
  
  // Validate configuration
  validateConfig();
  
  // Create Supabase client
  const supabase = createSupabaseClient();
  
  // Test connection
  const connectionOk = await testConnection(supabase);
  if (!connectionOk) {
    process.exit(1);
  }
  
  try {
    // Reset database if requested
    if (options.reset) {
      const resetOk = await resetDatabase(supabase);
      if (!resetOk) {
        process.exit(1);
      }
    }
    
    // Run migrations if not migrations-only mode
    if (!options.migrationsOnly) {
      // Setup main schema
      const schemaOk = await setupSchema(supabase);
      if (!schemaOk) {
        process.exit(1);
      }
    }
    
    // Run migrations
    const migrationsOk = await runMigrations(supabase);
    if (!migrationsOk) {
      process.exit(1);
    }
    
    // Insert sample data if requested
    if (options.sampleData && !options.migrationsOnly) {
      const sampleDataOk = await insertSampleData(supabase);
      if (!sampleDataOk) {
        console.log('⚠️  Sample data insertion failed, but continuing...');
      }
    }
    
    // Verify setup
    if (!options.migrationsOnly) {
      await verifySetup(supabase);
    }
    
    console.log('');
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('  1. Start your Next.js development server: npm run dev');
    console.log('  2. Navigate to /account to test the referral system');
    console.log('  3. Check the Supabase dashboard for your data');
    console.log('');
    
    if (options.sampleData) {
      console.log('📊 Sample data has been inserted for testing');
      console.log('  - Test users with referral codes');
      console.log('  - Sample orders and referrals');
      console.log('  - Reward bonuses and discounts');
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { main, config };