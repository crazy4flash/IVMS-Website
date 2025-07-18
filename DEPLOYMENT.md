# IVMS Website - Production Deployment Guide

## Email Configuration

### 1. Gmail Setup (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update config.py**:
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

### 2. Custom Domain Email Setup

If you have a custom domain (ivmsgroup.com):

1. **Configure DNS records** for your domain
2. **Set up email hosting** (Gmail Workspace, Outlook 365, etc.)
3. **Update config.py** with your domain email settings

### 3. Alternative Email Providers

#### Outlook/Hotmail:
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

#### Custom SMTP Server:
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

## Production Server Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables (Optional)
Create a `.env` file for sensitive data:
```bash
# .env
EMAIL_SMTP_USERNAME=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password
```

### 3. Production Server Options

#### Option A: Gunicorn (Recommended)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 server:app
```

#### Option B: Waitress (Windows)
```bash
pip install waitress
waitress-serve --host=0.0.0.0 --port=8000 server:app
```

#### Option C: uWSGI
```bash
pip install uwsgi
uwsgi --http :8000 --module server:app
```

### 4. Reverse Proxy Setup (Nginx)

Create `/etc/nginx/sites-available/ivms-website`:
```nginx
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
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ivms-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Security Considerations

### 1. Environment Variables
Move sensitive data to environment variables:
```python
import os
EMAIL_CONFIG = {
    'smtp_username': os.getenv('EMAIL_SMTP_USERNAME'),
    'smtp_password': os.getenv('EMAIL_SMTP_PASSWORD'),
    # ... other config
}
```

### 2. Rate Limiting
Add rate limiting to prevent spam:
```bash
pip install flask-limiter
```

### 3. CSRF Protection
Add CSRF tokens to forms:
```bash
pip install flask-wtf
```

### 4. Input Validation
Add server-side validation for all form inputs.

## Monitoring and Logging

### 1. Application Logs
```bash
# Log to file
gunicorn -w 4 -b 0.0.0.0:8000 --access-logfile access.log --error-logfile error.log server:app
```

### 2. System Monitoring
```bash
# Monitor with systemd
sudo systemctl enable ivms-website
sudo systemctl start ivms-website
```

## Testing

### 1. Test Email Configuration
```bash
python -c "
from server import send_email
send_email('Test Email', 'This is a test email from IVMS website.')
"
```

### 2. Test Form Submissions
```bash
curl -X POST http://localhost:8000/submit-contact \
  -d "first_name=Test&last_name=User&company=TestCo&email=test@example.com&phone=1234567890&job_title=Manager&message=Test message"
```

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check SMTP credentials and firewall settings
2. **Port already in use**: Change port or kill existing process
3. **Permission denied**: Check file permissions and user rights
4. **SSL errors**: Verify SSL certificate configuration

### Debug Mode:
```bash
python server.py --port 8000
```

## Backup and Recovery

### 1. Database Backup (if applicable)
```bash
# Backup configuration
cp config.py config.py.backup
```

### 2. File Backup
```bash
# Backup entire application
tar -czf ivms-website-backup-$(date +%Y%m%d).tar.gz .
```

## Performance Optimization

### 1. Static File Serving
Configure Nginx to serve static files directly:
```nginx
location /static/ {
    alias /path/to/your/static/files/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Gzip Compression
Enable gzip in Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## Maintenance

### 1. Regular Updates
- Keep Python packages updated
- Monitor security advisories
- Update SSL certificates

### 2. Log Rotation
Configure logrotate for application logs.

### 3. Health Checks
Implement health check endpoints for monitoring. 