#!/bin/bash

# Load shared utility functions and common operations
source "./utils.sh"

# Log script start
log "Starting pre-deployment process for portal"


# Change directory to project folder
log "Changing directory to: $TARGET_DIR"
cd "$TARGET_DIR" || exit
check_error "Failed to change directory to $TARGET_DIR" "Successfully changed directory to $TARGET_DIR"

# Stop and delete PM2 processes with portal namespace
log "Attempting to stop PM2 processes in portal namespace..."

# Stop processes in portal namespace
pm2 stop portal 2>/dev/null || {
    log "NOTICE: No active PM2 processes in portal namespace to stop"
}

# Delete processes in portal namespace
pm2 delete portal 2>/dev/null || {
    log "NOTICE: No PM2 processes in portal namespace to delete"
}

check_error "Failed to clean up PM2 processes in portal namespace" "Successfully cleaned up all PM2 processes in portal namespace"


# Log script completion
log "Pre-deployment process for portal completed successfully"
