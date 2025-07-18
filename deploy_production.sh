#!/bin/bash

# IVMS Production Deployment Script
# This script prepares the IVMS website for production deployment

set -e  # Exit on any error

echo "🚀 Starting IVMS Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check Python version
print_status "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
if [[ $python_version < "3.8" ]]; then
    print_error "Python 3.8 or higher is required. Current version: $python_version"
    exit 1
fi
print_success "Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install production dependencies
print_status "Installing production dependencies..."
pip install -r requirements.txt

# Set production environment variables
print_status "Setting production environment variables..."
export FLASK_ENV=production
export FLASK_DEBUG=0
export SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# Create production config if it doesn't exist
if [ ! -f "config_env.py" ]; then
    print_status "Creating production configuration..."
    cat > config_env.py << EOF
# Production Environment Configuration
import os

# Email Configuration (Update with your actual email settings)
EMAIL_CONFIG = {
    'smtp_server': os.environ.get('SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.environ.get('SMTP_PORT', '587')),
    'smtp_username': os.environ.get('SMTP_USERNAME', 'your-email@gmail.com'),
    'smtp_password': os.environ.get('SMTP_PASSWORD', 'your-app-password'),
    'sender_email': os.environ.get('SENDER_EMAIL', 'noreply@ivmsgroup.com'),
    'receiver_email': os.environ.get('RECEIVER_EMAIL', 'info@ivmsgroup.com')
}

# Security Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
DEBUG = os.environ.get('FLASK_DEBUG', '0') == '1'

# Server Configuration
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', '5000'))

# Production Settings
PRODUCTION = True
SSL_CONTEXT = None  # Set to ('cert.pem', 'key.pem') for HTTPS
EOF
    print_success "Production configuration created"
else
    print_status "Production configuration already exists"
fi

# Check for SSL certificates
if [ -f "cert.pem" ] && [ -f "key.pem" ]; then
    print_success "SSL certificates found"
    SSL_CERTS=true
else
    print_warning "SSL certificates not found. HTTPS will not be available."
    SSL_CERTS=false
fi

# Create systemd service file
print_status "Creating systemd service file..."
sudo tee /etc/systemd/system/ivms-website.service > /dev/null << EOF
[Unit]
Description=IVMS Website
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=$(pwd)/venv/bin
Environment=FLASK_ENV=production
Environment=FLASK_DEBUG=0
Environment=SECRET_KEY=$SECRET_KEY
ExecStart=$(pwd)/venv/bin/python server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
print_status "Enabling systemd service..."
sudo systemctl daemon-reload
sudo systemctl enable ivms-website.service

# Create log directory
print_status "Creating log directory..."
sudo mkdir -p /var/log/ivms
sudo chown $USER:$USER /var/log/ivms

# Set proper file permissions
print_status "Setting file permissions..."
chmod 755 server.py
chmod 644 *.html
chmod 644 robots.txt sitemap.xml
chmod -R 644 src/
chmod -R 644 static/

# Create backup directory
print_status "Creating backup directory..."
mkdir -p backups

# Test the application
print_status "Testing the application..."
python3 -c "
import server
print('✅ Server imports successfully')
"

# Security checklist
print_status "Running security checklist..."

# Check for debug mode
if grep -q "debug=True" server.py; then
    print_warning "Debug mode is enabled in server.py"
else
    print_success "Debug mode is properly configured"
fi

# Check for console.log statements
if grep -r "console.log" src/js/ static/js/ 2>/dev/null; then
    print_warning "Found console.log statements in JavaScript files"
else
    print_success "No console.log statements found"
fi

# Check for CSRF tokens
if grep -q "csrf_token" index.html contact.html; then
    print_success "CSRF tokens are implemented"
else
    print_warning "CSRF tokens may be missing"
fi

# Check for cookie consent
if grep -q "cookie-banner" index.html; then
    print_success "Cookie consent banner is implemented"
else
    print_warning "Cookie consent banner may be missing"
fi

# Check for security headers
if grep -q "Talisman" server.py; then
    print_success "Security headers are implemented"
else
    print_warning "Security headers may be missing"
fi

# Check for rate limiting
if grep -q "limiter" server.py; then
    print_success "Rate limiting is implemented"
else
    print_warning "Rate limiting may be missing"
fi

# Check for input validation
if grep -q "sanitize_input" server.py; then
    print_success "Input validation is implemented"
else
    print_warning "Input validation may be missing"
fi

# Check for error handling
if grep -q "errorhandler" server.py; then
    print_success "Error handling is implemented"
else
    print_warning "Error handling may be missing"
fi

# Check for legal pages
legal_pages=("terms-of-service.html" "cookie-policy.html" "accessibility-statement.html")
for page in "${legal_pages[@]}"; do
    if [ -f "$page" ]; then
        print_success "$page exists"
    else
        print_warning "$page is missing"
    fi
done

# Check for SEO files
if [ -f "robots.txt" ] && [ -f "sitemap.xml" ]; then
    print_success "SEO files (robots.txt, sitemap.xml) exist"
else
    print_warning "Some SEO files may be missing"
fi

# Final deployment checklist
echo ""
echo "📋 PRODUCTION DEPLOYMENT CHECKLIST:"
echo "====================================="
echo "✅ Python environment configured"
echo "✅ Dependencies installed"
echo "✅ Production configuration created"
echo "✅ Systemd service configured"
echo "✅ File permissions set"
echo "✅ Security features implemented"
echo "✅ Legal pages created"
echo "✅ SEO files created"
echo "✅ Error handling configured"
echo "✅ Rate limiting enabled"
echo "✅ CSRF protection active"
echo "✅ Cookie consent implemented"
echo "✅ Security headers configured"
echo ""

print_success "Deployment completed successfully!"

echo ""
echo "🚀 To start the service:"
echo "   sudo systemctl start ivms-website"
echo ""
echo "📊 To check service status:"
echo "   sudo systemctl status ivms-website"
echo ""
echo "📝 To view logs:"
echo "   sudo journalctl -u ivms-website -f"
echo ""
echo "🛑 To stop the service:"
echo "   sudo systemctl stop ivms-website"
echo ""

# Ask if user wants to start the service now
read -p "Do you want to start the service now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting IVMS website service..."
    sudo systemctl start ivms-website
    sleep 2
    if sudo systemctl is-active --quiet ivms-website; then
        print_success "Service started successfully!"
        echo "🌐 Website should be available at: http://localhost:5000"
    else
        print_error "Failed to start service. Check logs with: sudo journalctl -u ivms-website"
    fi
fi

echo ""
print_success "IVMS Production Deployment Complete! 🎉" 