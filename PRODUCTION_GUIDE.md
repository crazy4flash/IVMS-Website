# IVMS Website Production Guide

## Overview

This guide documents the production-ready implementation of the IVMS website, including security measures, legal compliance, and technical configurations.

## 🚀 Quick Start

1. **Run the deployment script:**
   ```bash
   ./deploy_production.sh
   ```

2. **Start the service:**
   ```bash
   sudo systemctl start ivms-website
   ```

3. **Check status:**
   ```bash
   sudo systemctl status ivms-website
   ```

## 🔒 Security Implementation

### Security Headers
- **Content Security Policy (CSP):** Implemented with strict directives
- **X-Frame-Options:** DENY (prevents clickjacking)
- **X-Content-Type-Options:** nosniff (prevents MIME sniffing)
- **X-XSS-Protection:** 1; mode=block (XSS protection)
- **Strict-Transport-Security:** 1 year max-age (HTTPS enforcement)
- **Referrer-Policy:** strict-origin-when-cross-origin

### CSRF Protection
- All forms include CSRF tokens
- Server-side validation of tokens
- Automatic token generation for each form submission

### Rate Limiting
- Contact form: 5 requests per minute
- Government form: 3 requests per minute
- General API: 200 requests per day, 50 per hour

### Input Validation & Sanitization
- Email validation with regex patterns
- Input sanitization to prevent XSS
- Required field validation
- SQL injection prevention through parameterized queries

### Error Handling
- Custom 404 and 500 error pages
- No sensitive information in error messages
- Proper logging without information disclosure

## 📋 Legal Compliance

### GDPR Compliance
- **Cookie Consent Banner:** Implemented with accept/decline options
- **Privacy Policy:** Comprehensive policy covering data collection and usage
- **Terms of Service:** Detailed terms covering service usage
- **Cookie Policy:** Specific policy for cookie usage
- **Accessibility Statement:** WCAG 2.1 AA compliance commitment

### Required Legal Pages
1. **Privacy Policy** (`/privacy-policy`)
   - Data collection practices
   - User rights (access, deletion, portability)
   - Contact information for data requests

2. **Terms of Service** (`/terms-of-service`)
   - Service usage terms
   - Intellectual property rights
   - Limitation of liability
   - Governing law (UAE)

3. **Cookie Policy** (`/cookie-policy`)
   - Cookie types and purposes
   - Third-party cookie information
   - User consent management

4. **Accessibility Statement** (`/accessibility-statement`)
   - WCAG 2.1 AA compliance status
   - Accessibility features implemented
   - Contact information for accessibility issues

## 🛠 Technical Implementation

### Production Configuration
- **Debug Mode:** Disabled in production
- **Environment Variables:** Properly configured
- **Secret Key:** Automatically generated
- **HTTPS Enforcement:** Enabled with HSTS

### Performance Optimizations
- **Static File Serving:** Optimized for production
- **Caching Headers:** Implemented for static assets
- **GZIP Compression:** Enabled
- **Image Optimization:** Compressed and optimized

### SEO Implementation
- **robots.txt:** Properly configured
- **sitemap.xml:** All pages included
- **Meta Tags:** Comprehensive meta descriptions
- **Structured Data:** Ready for implementation

### Monitoring & Logging
- **Error Logging:** Structured logging system
- **Access Logs:** Request tracking
- **Security Events:** Logged for audit
- **Performance Monitoring:** Ready for integration

## 📁 File Structure

```
IVMS-Website/
├── server.py                 # Main Flask application
├── config.py                 # Email configuration
├── requirements.txt          # Python dependencies
├── deploy_production.sh     # Deployment script
├── robots.txt               # SEO configuration
├── sitemap.xml             # Site structure
├── index.html              # Homepage
├── contact.html            # Contact page
├── privacy-policy.html     # Privacy policy
├── terms-of-service.html   # Terms of service
├── cookie-policy.html      # Cookie policy
├── accessibility-statement.html # Accessibility statement
├── src/
│   ├── js/
│   │   └── main.js        # Production JavaScript (no console.log)
│   ├── css/
│   │   └── styles.css     # Optimized CSS
│   └── images/            # Optimized images
└── static/                # Static assets
```

## 🔧 Configuration

### Environment Variables
```bash
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=your-secret-key-here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@ivmsgroup.com
RECEIVER_EMAIL=info@ivmsgroup.com
```

### Email Configuration
Update `config.py` with your actual email settings:
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

## 🚀 Deployment

### Automated Deployment
```bash
./deploy_production.sh
```

### Manual Deployment
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=0
   export SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
   ```

3. **Start the server:**
   ```bash
   python3 server.py
   ```

### Systemd Service
The deployment script creates a systemd service for automatic startup:
```bash
sudo systemctl start ivms-website
sudo systemctl enable ivms-website
sudo systemctl status ivms-website
```

## 🔍 Security Checklist

### Pre-Deployment
- [ ] Debug mode disabled
- [ ] Console.log statements removed
- [ ] CSRF tokens implemented
- [ ] Rate limiting configured
- [ ] Input validation active
- [ ] Security headers enabled
- [ ] Error handling implemented
- [ ] Legal pages created
- [ ] Cookie consent active
- [ ] SSL certificates configured (if using HTTPS)

### Post-Deployment
- [ ] Test all forms with real email delivery
- [ ] Verify all links work correctly
- [ ] Test contact information accuracy
- [ ] Verify privacy policy completeness
- [ ] Test mobile responsiveness
- [ ] Validate HTML and CSS
- [ ] Run security scans
- [ ] Test page load speeds
- [ ] Verify analytics tracking

## 📊 Monitoring

### Logs
```bash
# View service logs
sudo journalctl -u ivms-website -f

# View error logs
sudo journalctl -u ivms-website -p err

# View recent logs
sudo journalctl -u ivms-website --since "1 hour ago"
```

### Health Checks
- **Service Status:** `sudo systemctl status ivms-website`
- **Port Check:** `netstat -tlnp | grep :5000`
- **Process Check:** `ps aux | grep server.py`

## 🔧 Maintenance

### Updates
1. **Backup current version:**
   ```bash
   cp -r . ../ivms-backup-$(date +%Y%m%d)
   ```

2. **Update code and restart:**
   ```bash
   sudo systemctl restart ivms-website
   ```

### SSL Certificate Renewal
If using Let's Encrypt:
```bash
sudo certbot renew
sudo systemctl reload ivms-website
```

### Database Backups (if applicable)
```bash
# Example for SQLite (if used)
cp database.db backups/database-$(date +%Y%m%d).db
```

## 🆘 Troubleshooting

### Common Issues

**Service won't start:**
```bash
sudo journalctl -u ivms-website -n 50
```

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Permission issues:**
```bash
sudo chown -R $USER:$USER /path/to/ivms-website
chmod 755 server.py
```

**Email not working:**
- Check SMTP settings in `config.py`
- Verify email credentials
- Check firewall settings

## 📞 Support

### Contact Information
- **Technical Issues:** development@ivmsgroup.com
- **Legal Questions:** legal@ivmsgroup.com
- **Accessibility:** accessibility@ivmsgroup.com
- **General Support:** info@ivmsgroup.com

### Emergency Contacts
- **Server Issues:** +971 50 123 4567
- **Security Incidents:** security@ivmsgroup.com

## 📈 Performance Metrics

### Target Metrics
- **Page Load Time:** < 3 seconds
- **Uptime:** > 99.9%
- **Response Time:** < 500ms
- **Error Rate:** < 0.1%

### Monitoring Tools
- **Uptime Monitoring:** UptimeRobot (recommended)
- **Performance Monitoring:** Google PageSpeed Insights
- **Security Monitoring:** Security Headers Check
- **SEO Monitoring:** Google Search Console

## 🔐 Security Best Practices

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Review security logs weekly
- [ ] Test backup restoration monthly
- [ ] Review access logs daily
- [ ] Update SSL certificates before expiry

### Incident Response
1. **Identify the issue**
2. **Contain the threat**
3. **Eradicate the cause**
4. **Recover systems**
5. **Document lessons learned**

## 📋 Compliance Checklist

### GDPR Requirements
- [ ] Cookie consent implemented
- [ ] Privacy policy comprehensive
- [ ] Data subject rights documented
- [ ] Data breach procedures in place
- [ ] Lawful basis for processing documented

### Accessibility Requirements
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation working
- [ ] Screen reader compatibility
- [ ] Color contrast ratios met
- [ ] Alt text for all images

### Legal Requirements
- [ ] Terms of service comprehensive
- [ ] Privacy policy current
- [ ] Cookie policy detailed
- [ ] Accessibility statement published
- [ ] Contact information accurate

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintained by:** IVMS Development Team 