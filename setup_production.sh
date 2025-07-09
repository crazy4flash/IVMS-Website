#!/bin/bash

# IVMS Website Production Setup Script

echo "Setting up IVMS Website for production..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

# Create application directory
echo "Creating application directory..."
mkdir -p /var/www/ivms-website
cp -r . /var/www/ivms-website/

# Set permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/ivms-website
chmod -R 755 /var/www/ivms-website

# Create log directory
echo "Creating log directory..."
mkdir -p /var/log/ivms-website
chown -R www-data:www-data /var/log/ivms-website

# Install system dependencies
echo "Installing system dependencies..."
apt update
apt install -y python3 python3-pip python3-venv nginx

# Create virtual environment
echo "Setting up Python virtual environment..."
cd /var/www/ivms-website
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy systemd service
echo "Setting up systemd service..."
cp ivms-website.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable ivms-website

# Setup Nginx
echo "Setting up Nginx..."
cat > /etc/nginx/sites-available/ivms-website << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/ivms-website/src/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/ivms-website /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "Production setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit /var/www/ivms-website/.env with your email credentials"
echo "2. Update /etc/nginx/sites-available/ivms-website with your domain"
echo "3. Start the service: systemctl start ivms-website"
echo "4. Check status: systemctl status ivms-website"
echo "5. View logs: journalctl -u ivms-website -f" 