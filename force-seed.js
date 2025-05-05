/**
 * Supabase Database Seed Utility
 * 
 * This script runs the seed.sql file to populate the database with initial data.
 * It directly uses the seed file without creating a migration for it.
 */

const { exec } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Configuration
const SUPABASE_CLI_CMD = process.platform === 'win32' ? 'supabase.exe' : 'supabase';
const SEED_FILE = path.resolve(__dirname, 'supabase', 'seed.sql');

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
 * Check if seed file exists
 */
function checkSeedFile() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error(`Error: Seed file not found at ${SEED_FILE}`);
    return false;
  }
  
  console.log(`Found seed file: ${SEED_FILE}`);
  return true;
}

/**
 * Run the seed file
 */
async function runSeed() {
  try {
    console.log('Running seed file...');
    // We use the db execute command with the file content
    const seedSQL = fs.readFileSync(SEED_FILE, 'utf8');
    
    // Create a temporary file with properly escaped content
    const tempSeedFile = path.resolve(__dirname, 'temp-seed.sql');
    fs.writeFileSync(tempSeedFile, seedSQL);
    
    // Execute the SQL
    const output = await runCommand(`${SUPABASE_CLI_CMD} db execute --file "${tempSeedFile}"`);
    
    // Clean up temp file
    fs.unlinkSync(tempSeedFile);
    
    if (output.includes('error:') || output.includes('Error:')) {
      console.error('Seed error detected:');
      console.error(output);
      return false;
    }
    
    console.log('Seed successfully applied!');
    console.log(output);
    return true;
  } catch (error) {
    console.error('Seed failed:', error.message);
    return false;
  }
}

/**
 * Main function to run the seed process
 */
async function main() {
  console.log('=== Supabase Database Seed Tool ===');
  
  // Check prerequisites
  const cliInstalled = await checkSupabaseCLI();
  if (!cliInstalled) return;
  
  const isLinked = await checkProjectLink();
  if (!isLinked) return;
  
  const seedExists = checkSeedFile();
  if (!seedExists) return;
  
  // Run seed
  await runSeed();
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 