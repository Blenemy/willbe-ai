#!/bin/bash

# Load shared utility functions and common operations
source "./utils.sh"

# Log script start
log "Starting portal nginx configuration process"

# Change directory to project folder
log "Changing directory to: $TARGET_DIR"
cd "$TARGET_DIR" || exit
check_error "Failed to change directory to $TARGET_DIR" "Successfully changed directory to $TARGET_DIR"

# Check nginx status
log "Checking nginx status..."
sudo -n systemctl status nginx
check_error "Nginx is not running" "Nginx is running correctly"

# Copy new configuration from .github/res/portal-nginx
log "Copying portal configuration..."
sudo -n cp ".github/res/portal-nginx" /etc/nginx/sites-available/portal
check_error "Failed to copy portal nginx configuration" "Successfully copied portal nginx configuration"

# Create symbolic link (force overwrite if exists)
log "Creating symbolic link..."
sudo -n ln -sf /etc/nginx/sites-available/portal /etc/nginx/sites-enabled/
check_error "Failed to create symbolic link" "Successfully created symbolic link"

# Test nginx configuration
log "Testing nginx configuration..."
sudo -n nginx -t
check_error "Invalid Nginx configuration" "Nginx configuration is valid"

# Reload nginx configuration
log "Reloading nginx configuration..."
sudo -n nginx -s reload
check_error "Failed to reload Nginx" "Successfully reloaded Nginx configuration"

# Check status after reload
log "Checking nginx status after reload..."
sudo -n systemctl status nginx
check_error "Nginx failed to start after reload" "Nginx successfully started after reload"

# Log script completion
log "Portal nginx configuration process completed successfully"
