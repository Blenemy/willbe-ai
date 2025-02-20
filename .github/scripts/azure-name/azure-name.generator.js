const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// ----------------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------------

function log(message, type = 'INFO') {
  console.log(`[${type}] ${message}`);
}

function logAndThrow(message, originalError = null) {
  const errorMessage = originalError
    ? `${message}: ${originalError.message}`
    : message;
  log(errorMessage, 'ERROR');
  throw new Error(errorMessage);
}

// ----------------------------------------------------------------------
// Branch name processing
// ----------------------------------------------------------------------

function processBranchName(branchName) {
  // Special cases for environment mapping
  const envMap = {
    main: 'prod',
    master: 'prod',
    development: 'dev',
    staging: 'stage',
  };

  // First check if it's a special branch
  const normalizedBranch = branchName.toLowerCase().trim();
  if (envMap[normalizedBranch]) {
    return envMap[normalizedBranch];
  }

  // For feature branches and others, clean up the name
  return (
    normalizedBranch
      // Remove all special characters except letters and numbers
      .replace(/[^a-z0-9]/g, '')
      // Remove any remaining dashes
      .replace(/-+/g, '')
      // Ensure we don't have any unwanted characters
      .replace(/[^a-z0-9]/g, '')
  );
}

// ----------------------------------------------------------------------
// Name generation
// ----------------------------------------------------------------------

function generateAzureName(configValues, branchName) {
  const { prefix, project, region_short, instance } = configValues;
  const env = processBranchName(branchName);

  // Construct name following pattern: prefix + project + env + region + instance
  return `${prefix}${project}${env}${region_short}${instance}`.toLowerCase();
}

// ----------------------------------------------------------------------
// Main execution
// ----------------------------------------------------------------------

async function main() {
  try {
    // Get branch name from command line arguments
    const branchName = process.argv[2];
    if (!branchName) {
      logAndThrow('Branch name argument is required');
    }

    // Load and validate configuration
    const schemaPath = path.join(__dirname, 'azure-name.schema.json');
    const configPath = path.join(__dirname, 'azure-name.json');

    if (!fs.existsSync(schemaPath)) logAndThrow('Schema file not found');
    if (!fs.existsSync(configPath)) logAndThrow('Config file not found');

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Validate config
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    if (!validate(configFile)) {
      const errors = validate.errors
        .map((error) => `${error.instancePath} ${error.message}`)
        .join('\n');
      logAndThrow(`Config validation failed:\n${errors}`);
    }

    // Generate Azure resource name using the config object
    const azureName = generateAzureName(configFile.config, branchName);
    log(`Generated Azure resource name: ${azureName}`);

    // Output the name (can be captured by terraform)
    console.log(azureName);

    process.exit(0);
  } catch (error) {
    logAndThrow('Name generation failed', error);
    process.exit(1);
  }
}

// Handle unhandled errors
main().catch((error) => {
  log(`Unhandled error: ${error.message}`, 'ERROR');
  console.error(error);
  process.exit(1);
});
