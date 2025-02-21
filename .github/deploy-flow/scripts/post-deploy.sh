#!/bin/bash

# Load shared utility functions and common operations
source "./utils.sh"

# Log script start
log "Starting post-deployment process for portal"

# Change directory to project folder
log "Changing directory to: $TARGET_DIR"
cd "$TARGET_DIR" || exit
check_error "Failed to change directory to $TARGET_DIR" "Successfully changed directory to $TARGET_DIR"

# Start applications with PM2
log "Starting portal application with PM2..."
pm2 start ecosystem.config.js
check_error "Failed to start portal PM2 application" "Successfully started portal PM2 application"

# Save PM2 configuration
log "Saving PM2 configuration..."
pm2 save
check_error "Failed to save PM2 configuration" "Successfully saved PM2 configuration"

# Log script completion
log "Post-deployment process for portal completed successfully"
