#!/bin/bash

# Enable error output for better debugging
set -e

# ===== Utility Functions =====

# Log messages with timestamp to specified log file
# Usage: log "Your message here"
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check for errors and exit if encountered
# Usage: check_error "Error message if failed"
check_error() {
    if [ $? -ne 0 ]; then
        log "ERROR: $1"
        exit 1
    fi
}

# ===== Script Parameters =====
# $1 - Download URL for the repository archive
# $2 - Username - ubuntu user
# $3 - Directory name (e.g., backend, frontend, server)
DOWNLOAD_URL="$1"
USER_NAME="$2"
DIR_NAME="$3"
ARCHIVE_NAME="repo-${DIR_NAME}.tar.gz"

# ===== Directory Configuration =====
# Define all required directory paths and logging configuration
BASE_DIR="/home/$USER_NAME"
TEMP_DIR="$BASE_DIR/temp"
TARGET_DIR="$BASE_DIR/$DIR_NAME"
LOGS_DIR="$BASE_DIR/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOGS_DIR/${DIR_NAME}_flow_$TIMESTAMP.log"

# ===== Initial Setup =====
# Create required directories first
mkdir -p "$LOGS_DIR"
chown -R "$USER_NAME:$USER_NAME" "$BASE_DIR"
chmod -R 755 "$BASE_DIR"

# Now we can start logging
log "Starting deployment process"

# ===== Main Deployment Process =====
# Start asynchronous deployment process
log "Starting main deployment process"
(
    # Create heredoc for running as specified user
    # This allows for proper permission handling and user context
    cat << EOF | sudo -u "$USER_NAME" bash
    # Redefine utility functions in user context
    log() {
        echo "[\$(date +'%Y-%m-%d %H:%M:%S')] \$1" >> "$LOG_FILE"
    }

    check_error() {
        if [ \$? -ne 0 ]; then
            log "ERROR: \$1"
            exit 1
        fi
    }

    # Verify execution context
    log "Running as user: \$(whoami)"

    # Initialize working directory
    log "Setting up working environment"
    cd "$BASE_DIR"
    log "Working from directory: $BASE_DIR"

    # Prepare temporary directory
    log "Preparing temporary directory"
    mkdir -p "$TEMP_DIR"
    check_error "Failed to create temp directory"

    # Download deployment package
    log "Downloading deployment package"
    curl -sSL "$DOWNLOAD_URL" -o "$TEMP_DIR/$ARCHIVE_NAME"
    check_error "Failed to download deployment package"

    # Prepare target directory
    log "Preparing target directory"
    rm -rf "$TARGET_DIR"
    mkdir -p "$TARGET_DIR"
    check_error "Failed to prepare target directory"

    # Extract deployment package
    log "Extracting deployment package"
    tar -xzf "$TEMP_DIR/$ARCHIVE_NAME" -C "$TARGET_DIR"
    check_error "Failed to extract deployment package"

    # Set deployment file permissions
    log "Configuring deployment file permissions"
    chmod -R 755 "$TARGET_DIR"
    check_error "Failed to set deployment permissions"

    log "Executing preparation phase"
    cd "$TARGET_DIR/.github/deploy-flow"
    check_error "Failed to change to deploy-flow directory"
    sudo -E BASE_DIR=$BASE_DIR USER_NAME=$USER_NAME LOG_FILE=$LOG_FILE DIR_NAME=$DIR_NAME DEPLOY_PHASE=prepare node flow.runner.js
    check_error "Preparation phase failed"

    log "Executing deployment flow"
    sudo -E BASE_DIR=$BASE_DIR USER_NAME=$USER_NAME LOG_FILE=$LOG_FILE DIR_NAME=$DIR_NAME DEPLOY_PHASE=deploy node flow.runner.js
    check_error "Deployment phase failed"

    log "Deployment flow completed successfully"
EOF
) &

# ===== Log File Management =====
# Create symbolic link to latest log file for easy access
log "Creating symbolic link to latest log file"
ln -sf "$LOG_FILE" "$LOGS_DIR/${DIR_NAME}_flow_latest.log"

# ===== Final Output =====
# Display log file locations for monitoring
echo "Flow process started in background. Check logs at:"
echo "Current log: $LOG_FILE"
echo "Latest log: $LOGS_DIR/${DIR_NAME}_flow_latest.log"
