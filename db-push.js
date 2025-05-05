/**
 * Supabase Database Migration Utility
 * 
 * This script automates database migrations for the course-taking application
 * using the Supabase CLI. It handles common errors and provides feedback.
 */

const { exec } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Configuration
const SUPABASE_CLI_CMD = process.platform === 'win32' ? 'supabase.exe' : 'supabase';
const MIGRATIONS_DIR = path.resolve(__dirname, 'supabase', 'migrations');

/**
 * Execute a command and return a promise
 * @param {string} command Command to execute
 * @returns {Promise<string>} Command output
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Command error:', stderr || error.message);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

/**
 * Check if Supabase CLI is installed and get its version
 */
async function checkSupabaseCLI() {
  try {
    const versionOutput = await runCommand(`${SUPABASE_CLI_CMD} --version`);
    console.log(`Supabase CLI detected: ${versionOutput.trim()}`);
    return true;
  } catch (error) {
    console.error('Error: Supabase CLI not found or not in PATH.');
    console.log('Please install it using: npm install -g supabase');
    return false;
  }
}

/**
 * Check if project is linked to a Supabase project
 */
async function checkProjectLink() {
  try {
    const configFile = path.resolve(__dirname, 'supabase', '.temp', 'project-ref');
    if (fs.existsSync(configFile)) {
      const projectRef = fs.readFileSync(configFile, 'utf8').trim();
      console.log(`Project is linked to Supabase project: ${projectRef}`);
      return true;
    }

    console.error('Error: Project is not linked to a Supabase project.');
    console.log('Run: supabase link --project-ref <project-ref>');
    return false;
  } catch (error) {
    console.error('Error checking project link:', error.message);
    return false;
  }
}

/**
 * Push database migrations to Supabase
 */
async function pushMigrations() {
  try {
    console.log('Pushing database migrations to Supabase...');
    const output = await runCommand(`${SUPABASE_CLI_CMD} db push`);
    
    if (output.includes('error:') || output.includes('Error:')) {
      console.error('Migration error detected:');
      console.error(output);
      return false;
    }
    
    console.log('Migrations successfully applied!');
    console.log(output);
    return true;
  } catch (error) {
    console.error('Migration failed:', error.message);
    
    // Handle common errors
    if (error.message.includes('permission denied to set parameter')) {
      console.log('\nTIP: Remove or comment out any ALTER DATABASE commands that set parameters.');
      console.log('     These are not allowed in Supabase Cloud environments.');
    }
    
    if (error.message.includes('already exists')) {
      console.log('\nTIP: Make policy creations idempotent by wrapping them in DO blocks:');
      console.log('     DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE ...) THEN');
      console.log('       CREATE POLICY ... ;');
      console.log('     END IF; END $$;');
    }
    
    return false;
  }
}

/**
 * Main function to run the migration process
 */
async function main() {
  console.log('=== Supabase Database Migration Tool ===');
  
  // Check prerequisites
  const cliInstalled = await checkSupabaseCLI();
  if (!cliInstalled) return;
  
  const isLinked = await checkProjectLink();
  if (!isLinked) return;
  
  // Push migrations
  await pushMigrations();
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 