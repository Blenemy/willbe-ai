const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Helper function for logging messages
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}\n`;

  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage);
}

// Helper function for logging empty line separator
function logSpace() {
  console.log('');
  fs.appendFileSync(logFile, '\n');
}

// Helper function for logging errors and throwing exceptions
function logAndThrow(message, originalError = null) {
  const errorMessage = originalError
    ? `${message}: ${originalError.message}`
    : message;
  log(errorMessage, 'ERROR');
  throw new Error(errorMessage);
}

// Helper function for logging information messages
function logInfo(message) {
  log(message, 'INFO');
  return message;
}

// ----------------------------------------------------------------------

// Helper function to validate directory name
function validateDirName(name) {
  const validDirNameRegex = /^[a-z0-9-]{2,20}$/;

  if (!name) {
    return 'DIR_NAME environment variable is required';
  }

  if (!validDirNameRegex.test(name)) {
    return 'DIR_NAME must contain only lowercase letters, numbers, and hyphens (2-20 characters)';
  }

  return null;
}

// Environment variables validation
const baseDir = process.env.BASE_DIR;
const userName = process.env.USER_NAME;
const logFile = process.env.LOG_FILE;
const dirName = process.env.DIR_NAME;
const phase = process.env.DEPLOY_PHASE;

if (!baseDir) logAndThrow('BASE_DIR environment variable is required');
if (!userName) logAndThrow('USER_NAME environment variable is required');
if (!logFile) logAndThrow('LOG_FILE environment variable is required');

const dirNameError = validateDirName(dirName);
if (dirNameError) logAndThrow(dirNameError);

if (!phase || !['prepare', 'deploy'].includes(phase)) {
  logAndThrow('DEPLOY_PHASE must be either "prepare" or "deploy"');
}

// Config and schema paths setup
const configPath = path.join(__dirname, 'flow.json');
const schemaPath = path.join(__dirname, 'flow.schema.json');
const scriptsDir = path.join(path.dirname(configPath), 'scripts');

if (!fs.existsSync(configPath))
  logAndThrow(`Config file not found: ${configPath}`);
if (!fs.existsSync(schemaPath))
  logAndThrow(`Schema file not found: ${schemaPath}`);
if (!fs.existsSync(scriptsDir))
  logAndThrow(`Scripts directory not found: ${scriptsDir}`);

// ----------------------------------------------------------------------

let config;
let schema;

try {
  logInfo('Starting config validation');
  logInfo(`Loading config from: ${configPath}`);
  const configContent = fs.readFileSync(configPath, 'utf8');

  logInfo(`Loading schema from: ${schemaPath}`);
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  try {
    config = JSON.parse(configContent);
  } catch (parseError) {
    logAndThrow('Failed to parse config file', parseError);
  }

  try {
    schema = JSON.parse(schemaContent);
  } catch (parseError) {
    logAndThrow('Failed to parse schema file', parseError);
  }

  // Config validation against schema
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  logInfo('Validating config against schema...');
  if (!validate(config)) {
    const errors = validate.errors
      .map((error) => `${error.instancePath} ${error.message}`)
      .join('\n');
    logAndThrow(`Config validation failed:\n${errors}`);
  }

  logInfo('Config validation successful');
  logInfo(`Found ${config.flows.length} flows to execute`);
} catch (error) {
  logAndThrow('Failed to load and validate config', error);
}

// ----------------------------------------------------------------------

// Find and collect all bash scripts in the directory
function findBashScripts(startPath) {
  const scripts = new Map();

  function traverse(currentPath) {
    try {
      const files = fs.readdirSync(currentPath);

      for (const file of files) {
        const filePath = path.join(currentPath, file);
        try {
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            traverse(filePath);
          } else if (file.endsWith('.sh')) {
            scripts.set(file, {
              name: file,
              path: filePath,
              directory: currentPath,
            });
          }
        } catch (statError) {
          logAndThrow(`Failed to get stats for file ${filePath}`, statError);
        }
      }
    } catch (readError) {
      logAndThrow(`Failed to read directory ${currentPath}`, readError);
    }
  }

  traverse(startPath);
  return scripts;
}

// Process bash script content and handle source commands
function processScript(scriptPath, scriptsMap) {
  try {
    let content = fs.readFileSync(scriptPath, 'utf8');
    const scriptDir = path.dirname(scriptPath);
    logInfo(`Processing script: ${scriptPath}`);

    content = content.replace(
      /source\s+["']?([^"'\n]+)["']?/g,
      (match, sourcePath) => {
        try {
          sourcePath = sourcePath.replace(/["']/g, '');

          // Handle relative paths
          if (sourcePath.startsWith('./') || sourcePath.startsWith('../')) {
            const absolutePath = path.resolve(scriptDir, sourcePath);
            logInfo(`Resolved relative path ${sourcePath} to ${absolutePath}`);
            return `source "${absolutePath}"`;
          }

          // Handle script name references
          const scriptFile = path.basename(sourcePath);
          if (scriptsMap.has(scriptFile)) {
            const resolvedPath = scriptsMap.get(scriptFile).path;
            logInfo(`Resolved script ${scriptFile} to ${resolvedPath}`);
            return `source "${resolvedPath}"`;
          }

          log(`Unable to resolve source path: ${sourcePath}`, 'WARN');
          return match;
        } catch (error) {
          logAndThrow(
            `Error processing source command for ${sourcePath}`,
            error
          );
        }
      }
    );

    // Create temporary script file
    const tempPath = scriptPath + '.tmp';
    try {
      fs.writeFileSync(tempPath, content);
      logInfo(`Created temporary script file: ${tempPath}`);
      return tempPath;
    } catch (writeError) {
      logAndThrow(
        `Failed to write temporary script file ${tempPath}`,
        writeError
      );
    }
  } catch (error) {
    logAndThrow(`Failed to process script ${scriptPath}`, error);
  }
}

// Execute a script with provided flow configuration
async function executeScript(flow) {
  let processedScriptPath = null;

  // Cleanup helper function
  const cleanup = () => {
    if (processedScriptPath && fs.existsSync(processedScriptPath)) {
      try {
        fs.unlinkSync(processedScriptPath);
        logInfo(`Cleaned up temporary script file: ${processedScriptPath}`);
      } catch (unlinkError) {
        log(
          `Failed to clean up temporary script file: ${unlinkError.message}`,
          'WARN'
        );
      }
    }
  };

  try {
    const scriptPath = path.join(path.dirname(configPath), flow.script);
    if (!fs.existsSync(scriptPath)) {
      logAndThrow(`Script not found: ${scriptPath}`);
    }

    logSpace();
    logInfo(`Finding bash scripts in directory: ${scriptsDir}`);
    const scriptsMap = findBashScripts(scriptsDir);
    logInfo(`Found ${scriptsMap.size} bash scripts`);

    processedScriptPath = processScript(scriptPath, scriptsMap);

    return new Promise((resolve, reject) => {
      logSpace();
      logInfo(`Starting flow: ${flow.name}`);
      logInfo(`Executing script: ${scriptPath}`);

      try {
        fs.chmodSync(processedScriptPath, '755');
      } catch (chmodError) {
        cleanup();
        logAndThrow(`Failed to set execute permissions on script`, chmodError);
      }

      const child = spawn(processedScriptPath, [], {
        env: {
          ...process.env,
          FLOW_NAME: flow.name,
          USER_NAME: userName,
          BASE_DIR: baseDir,
          DIR_NAME: dirName,
          TARGET_DIR: `${baseDir}/${dirName}`,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      // Handle stdout data
      child.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          output.split('\n').forEach((line) => {
            if (line.trim()) logInfo(`[${flow.name}] ${line}`);
          });
        }
      });

      // Handle stderr data
      child.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          output.split('\n').forEach((line) => {
            if (line.trim()) log(`[${flow.name}] ${line}`, 'ERROR');
          });
        }
      });

      // Handle script completion
      child.on('close', (code) => {
        cleanup();
        if (code === 0) {
          logInfo(`Successfully completed flow: ${flow.name}`);
          resolve(true);
        } else {
          const errorMessage = `Script exited with code ${code}`;
          log(`Failed to execute ${flow.name}: ${errorMessage}`, 'ERROR');
          if (flow.continueOnError) {
            resolve(false);
          } else {
            reject(new Error(errorMessage));
          }
        }
      });

      // Handle script execution errors
      child.on('error', (error) => {
        cleanup();
        log(`Failed to execute ${flow.name}: ${error.message}`, 'ERROR');
        if (flow.continueOnError) {
          resolve(false);
        } else {
          reject(error);
        }
      });

      // Handle timeout if specified
      if (flow.timeout) {
        setTimeout(() => {
          child.kill();
          cleanup();
          const errorMessage = 'Script execution timeout';
          log(`Failed to execute ${flow.name}: ${errorMessage}`, 'ERROR');
          if (flow.continueOnError) {
            resolve(false);
          } else {
            reject(new Error(errorMessage));
          }
        }, flow.timeout);
      }
    });
  } catch (error) {
    cleanup();
    throw error;
  }
}

// ----------------------------------------------------------------------

// Display execution plan
function displayExecutionPlan(flows, phase) {
  logInfo('=== Execution Plan ===');
  flows.forEach((flow, index) => {
    const stepNumber = index + 1;
    const description = flow.description || 'No description provided';
    logInfo(`${stepNumber}. [${flow.name}] ${description}`);
    logInfo(`   Script: ${flow.script}`);
  });
  logInfo(`Phase: ${phase}`);
  logInfo('===================\n');
}

// Main execution flow
async function main() {
  try {
    // Get flows for the current phase
    const flows = config.flows[phase];

    // Display execution plan
    displayExecutionPlan(flows, phase);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Execute flows
    logInfo(`Beginning execution of ${phase} phase flows...\n`);

    for (const flow of flows) {
      const success = await executeScript(flow);
      if (!success && !flow.continueOnError) {
        logAndThrow(`Flow ${flow.name} failed and continueOnError is false`);
      }
    }

    logInfo(`${phase} phase execution completed`);
    process.exit(0);
  } catch (error) {
    logAndThrow('Flow execution failed', error);
    process.exit(1);
  }
}

// Handle unhandled errors in the main execution
main().catch((error) => {
  log(`Unhandled error in main execution: ${error.message}`, 'ERROR');
  console.error(error);
  process.exit(1);
});
