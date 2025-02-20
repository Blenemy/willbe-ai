const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------------
// Helper functions for logging
// ----------------------------------------------------------------------

function log(message, type = 'INFO') {
  console.log(`[${type}] ${message}`);
}

function logAndThrow(message, originalError = null) {
  const errorMessage = originalError
    ? `${message}: ${originalError.message}`
    : message;
  log(errorMessage, 'ERROR');
  process.exit(1);
}

function logInfo(message) {
  log(message, 'INFO');
  return message;
}

// ----------------------------------------------------------------------
// Path and file validation
// ----------------------------------------------------------------------

const templatePath = path.join(__dirname, '../../.env.template');
const outputPath = path.join(__dirname, '../../.env.local');

// Validate template file exists
if (!fs.existsSync(templatePath)) {
  logAndThrow(`Template file not found at ${templatePath}`);
}

// Validate ENV_VARS environment variable
const envVarsString = process.env.ENV_VARS;
if (!envVarsString) {
  logAndThrow('ENV_VARS environment variable is not set');
}

// ----------------------------------------------------------------------
// Template parsing and validation
// ----------------------------------------------------------------------

function parseTemplateFile(templatePath) {
  logInfo(`Reading template file from: ${templatePath}`);

  const templateContent = fs.readFileSync(templatePath, 'utf8');

  // Extract keys from lines in the format KEY=
  const requiredVars = templateContent
    .split('\n')
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => line.split('=')[0].trim());

  logInfo(`Found ${requiredVars.length} required variables in template`);
  return requiredVars;
}

// ----------------------------------------------------------------------
// Environment variables parsing
// ----------------------------------------------------------------------

function parseEnvVars(envVarsString) {
  logInfo('Parsing environment variables');

  try {
    // Try parsing as JSON first
    const parsedJson = JSON.parse(envVarsString);
    logInfo('Successfully parsed environment variables as JSON');
    return parsedJson;
  } catch (e) {
    logInfo('Parsing environment variables as .env format');

    // Parse as .env format
    const vars = {};
    envVarsString.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (
        trimmedLine &&
        trimmedLine.includes('=') &&
        !trimmedLine.startsWith('#')
      ) {
        const [key, ...valueParts] = line.split('=');
        const trimmedKey = key.trim();
        if (trimmedKey) {
          vars[trimmedKey] = valueParts.join('=').trim();
        }
      }
    });

    logInfo(
      `Successfully parsed ${Object.keys(vars).length} environment variables`
    );
    return vars;
  }
}

// ----------------------------------------------------------------------
// Validation functions
// ----------------------------------------------------------------------

function validateEnvVars(requiredVars, providedVars) {
  logInfo('Validating environment variables');

  const missingVars = requiredVars.filter((key) => !(key in providedVars));
  if (missingVars.length > 0) {
    logAndThrow(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  logInfo('All required variables are present');
}

// ----------------------------------------------------------------------
// File generation
// ----------------------------------------------------------------------

function createEnvFile(templatePath, outputPath, envVars) {
  logInfo('Generating .env file');

  const templateContent = fs.readFileSync(templatePath, 'utf8');

  // Replace template placeholders with environment variable values
  const envContent = templateContent
    .split('\n')
    .map((line) => {
      if (!line.includes('=')) return line;
      const [key] = line.split('=');
      const trimmedKey = key.trim();
      const value = envVars[trimmedKey] || '';
      return `${trimmedKey}=${value}`;
    })
    .join('\n');

  try {
    fs.writeFileSync(outputPath, envContent);
    logInfo(`Successfully created .env file at: ${outputPath}`);
  } catch (error) {
    logAndThrow('Failed to write .env file', error);
  }
}

// ----------------------------------------------------------------------
// Main execution
// ----------------------------------------------------------------------

async function main() {
  try {
    logInfo('Starting environment file generation');

    // Parse template and get required variables
    const requiredVars = parseTemplateFile(templatePath);

    // Parse provided environment variables
    const envVars = parseEnvVars(envVarsString);

    // Validate environment variables
    validateEnvVars(requiredVars, envVars);

    // Generate .env file
    createEnvFile(templatePath, outputPath, envVars);

    logInfo('Environment file generation completed successfully');
    process.exit(0);
  } catch (error) {
    logAndThrow('Environment file generation failed', error);
  }
}

// Handle unhandled errors in the main execution
main().catch((error) => {
  log(`Unhandled error in main execution: ${error.message}`, 'ERROR');
  console.error(error);
  process.exit(1);
});
