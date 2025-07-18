#!/bin/bash

# IVMS Website Production Startup Script

echo "Starting IVMS Website in production mode..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Please create one based on .env.example"
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo "Please edit .env file with your email credentials before starting the server."
    exit 1
fi

# Check if config is properly set
echo "Checking email configuration..."
python -c "
from config_env import EMAIL_CONFIG
if EMAIL_CONFIG['smtp_username'] == 'your-email@gmail.com':
    print('ERROR: Please update your email configuration in .env file')
    exit(1)
else:
    print('Email configuration looks good!')
"

if [ $? -ne 0 ]; then
    echo "Please update your email configuration in .env file"
    exit 1
fi

# Start the server
echo "Starting Gunicorn server..."
gunicorn -w 4 -b 0.0.0.0:8000 --access-logfile access.log --error-logfile error.log server:app 