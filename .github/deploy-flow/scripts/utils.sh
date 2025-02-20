#!/bin/bash

# Enable error output
set -e

# Logging function
log() {
    echo "$1"
}

# Error checking function
check_error() {
    if [ $? -ne 0 ]; then
        log "ERROR: $1"
        exit 1
    else
        log "SUCCESS: $2"
    fi
}
