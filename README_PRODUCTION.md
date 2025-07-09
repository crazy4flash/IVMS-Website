# IVMS Website - Production Ready Setup

## 🚀 Quick Start

### 1. Email Configuration

First, set up your email credentials:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your email credentials
nano .env
```

Update the `.env` file with your email settings:

```bash
# For Gmail (recommended)
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USERNAME=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-16-digit-app-password
EMAIL_SENDER=noreply@ivmsgroup.com
EMAIL_RECEIVER=info@ivmsgroup.com
```

### 2. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use this 16-digit password in your `.env` file

### 3. Start Production Server

```bash
# Make the startup script executable
chmod +x start_production.sh

# Start the production server
./start_production.sh
```

## 🔧 Manual Setup

### Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configure Email

Edit `config.py` with your email settings:

```python
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'smtp_username': 'your-email@gmail.com',
    'smtp_password': 'your-16-digit-app-password',
    'sender_email': 'noreply@ivmsgroup.com',
    'receiver_email': 'info@ivmsgroup.com'
}
```

### Start Server

```bash
# Development mode
python server.py --port 8000

# Production mode with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 server:app
```

## 🌐 Production Deployment

### Option 1: Automated Setup (Linux/Ubuntu)

```bash
# Run the automated setup script
sudo ./setup_production.sh
```

### Option 2: Manual Setup

1. **Install system dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nginx
   ```

2. **Deploy application:**
   ```bash
   sudo mkdir -p /var/www/ivms-website
   sudo cp -r . /var/www/ivms-website/
   sudo chown -R www-data:www-data /var/www/ivms-website
   ```

3. **Setup Python environment:**
   ```bash
   cd /var/www/ivms-website
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Configure systemd service:**
   ```bash
   sudo cp ivms-website.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable ivms-website
   ```

5. **Setup Nginx:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/ivms-website
   sudo ln -s /etc/nginx/sites-available/ivms-website /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Start the service:**
   ```bash
   sudo systemctl start ivms-website
   sudo systemctl status ivms-website
   ```

## 📧 Email Provider Options

### Gmail (Recommended)
```python
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'smtp_username': 'your-email@gmail.com',
    'smtp_password': 'your-app-password',
    'sender_email': 'noreply@ivmsgroup.com',
    'receiver_email': 'info@ivmsgroup.com'
}
```

### Outlook/Hotmail
```python
EMAIL_CONFIG = {
    'smtp_server': 'smtp-mail.outlook.com',
    'smtp_port': 587,
    'smtp_username': 'your-email@outlook.com',
    'smtp_password': 'your-password',
    'sender_email': 'noreply@ivmsgroup.com',
    'receiver_email': 'info@ivmsgroup.com'
}
```

### Custom SMTP Server
```python
EMAIL_CONFIG = {
    'smtp_server': 'your-smtp-server.com',
    'smtp_port': 587,
    'smtp_username': 'your-username',
    'smtp_password': 'your-password',
    'sender_email': 'noreply@ivmsgroup.com',
    'receiver_email': 'info@ivmsgroup.com'
}
```

## 🔒 Security Features

- ✅ Environment variable configuration
- ✅ Secure SMTP authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting ready
- ✅ CSRF protection ready

## 📊 Monitoring

### View Logs
```bash
# Application logs
tail -f /var/log/ivms-website/access.log
tail -f /var/log/ivms-website/error.log

# System logs
journalctl -u ivms-website -f
```

### Check Status
```bash
# Service status
systemctl status ivms-website

# Nginx status
systemctl status nginx
```

## 🧪 Testing

### Test Email Configuration
```bash
python -c "
from server import send_email
send_email('Test Email', 'This is a test email from IVMS website.')
"
```

### Test Form Submissions
```bash
# Contact form
curl -X POST http://localhost:8000/submit-contact \
  -d "first_name=Test&last_name=User&company=TestCo&email=test@example.com&phone=1234567890&job_title=Manager&message=Test message"

# Government form
curl -X POST http://localhost:8000/submit-government \
  -d "department=Transport&fleet_size=51-200 vehicles&challenges=Route optimization&timeline=Short-term (3-6 months)&contact_name=John Doe&email=john@example.com&phone=1234567890"
```

## 🔧 Troubleshooting

### Common Issues

1. **Email not sending:**
   - Check SMTP credentials
   - Verify firewall settings
   - Check server logs

2. **Port already in use:**
   ```bash
   lsof -i :8000
   kill -9 <PID>
   ```

3. **Permission denied:**
   ```bash
   sudo chown -R www-data:www-data /var/www/ivms-website
   sudo chmod -R 755 /var/www/ivms-website
   ```

4. **SSL errors:**
   - Verify SSL certificate configuration
   - Check Nginx configuration

### Debug Mode
```bash
python server.py --port 8000
```

## 📁 File Structure

```
IVMS-Website/
├── server.py              # Main Flask application
├── config.py              # Email configuration
├── config_env.py          # Environment-based config
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── start_production.sh   # Production startup script
├── setup_production.sh   # Automated setup script
├── ivms-website.service  # Systemd service file
├── DEPLOYMENT.md         # Detailed deployment guide
└── README_PRODUCTION.md  # This file
```

## 🚀 Quick Commands

```bash
# Start development server
python server.py --port 8000

# Start production server
./start_production.sh

# Setup production (Ubuntu/Debian)
sudo ./setup_production.sh

# Check service status
systemctl status ivms-website

# View logs
journalctl -u ivms-website -f

# Restart service
systemctl restart ivms-website
```

## 📞 Support

For issues or questions:
- Check the logs: `journalctl -u ivms-website -f`
- Test email configuration: See testing section above
- Verify environment variables: Check `.env` file
- Review deployment guide: `DEPLOYMENT.md`

---

**Production Ready!** ✅

Your IVMS website is now configured for production deployment with:
- ✅ Secure email functionality
- ✅ Professional deployment scripts
- ✅ Systemd service management
- ✅ Nginx reverse proxy
- ✅ Comprehensive monitoring
- ✅ Security best practices 