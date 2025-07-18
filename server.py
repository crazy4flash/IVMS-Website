from flask import Flask, send_from_directory, request, jsonify, render_template_string
import os
import argparse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from config import EMAIL_CONFIG
import secrets
import re
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Input validation and sanitization
def sanitize_input(text):
    if not text:
        return ""
    # Remove potentially dangerous characters
    text = re.sub(r'[<>"\']', '', text)
    return text.strip()

def validate_email(email):
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@app.after_request
def set_security_headers(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Content-Security-Policy'] = "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https://www.ivmsglobal.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self';"
    
    # Add cache-busting headers for images
    if request.path.endswith(('.webp', '.png', '.jpg', '.jpeg', '.gif')):
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    
    return response

@app.after_request
def log_request(response):
    logger.info(f"{request.remote_addr} - {request.method} {request.path} - {response.status_code}")
    return response

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/index.html')
def index_html():
    return send_from_directory('.', 'index.html')

@app.route('/contact.html')
def contact():
    return send_from_directory('.', 'contact.html')

@app.route('/about.html')
def about():
    return send_from_directory('.', 'about.html')

@app.route('/speedsense')
def speedsense():
    return send_from_directory('.', 'speedsense.html')

@app.route('/speedsense.html')
def speedsense_html():
    return send_from_directory('.', 'speedsense.html')

@app.route('/rental-leasing')
def rental_leasing():
    return send_from_directory('.', 'rental-leasing.html')

@app.route('/rental-leasing.html')
def rental_leasing_html():
    return send_from_directory('.', 'rental-leasing.html')

@app.route('/governments')
def governments():
    return send_from_directory('.', 'governments.html')

@app.route('/governments.html')
def governments_html():
    return send_from_directory('.', 'governments.html')

@app.route('/logistics.html')
def logistics():
    return send_from_directory('.', 'logistics.html')

@app.route('/privacy-policy')
def privacy_policy():
    return send_from_directory('.', 'privacy-policy.html')

@app.route('/privacy-policy.html')
def privacy_policy_html():
    return send_from_directory('.', 'privacy-policy.html')

@app.route('/terms-of-service')
def terms_of_service():
    return send_from_directory('.', 'terms-of-service.html')

@app.route('/terms-of-service.html')
def terms_of_service_html():
    return send_from_directory('.', 'terms-of-service.html')

@app.route('/cookie-policy')
def cookie_policy():
    return send_from_directory('.', 'cookie-policy.html')

@app.route('/cookie-policy.html')
def cookie_policy_html():
    return send_from_directory('.', 'cookie-policy.html')

@app.route('/accessibility-statement')
def accessibility_statement():
    return send_from_directory('.', 'accessibility-statement.html')

@app.route('/accessibility-statement.html')
def accessibility_statement_html():
    return send_from_directory('.', 'accessibility-statement.html')

@app.route('/ipay-privacy-policy')
def ipay_privacy_policy():
    return send_from_directory('.', 'ipay-privacy-policy.html')

@app.route('/ipay-privacy-policy.html')
def ipay_privacy_policy_html():
    return send_from_directory('.', 'ipay-privacy-policy.html')

@app.route('/clear-cache')
def clear_cache():
    return send_from_directory('.', 'clear-cache.html')

@app.route('/nuclear-cache-bust')
def nuclear_cache_bust():
    return send_from_directory('.', 'nuclear-cache-bust.html')

@app.route('/test-logo')
def test_logo():
    return send_from_directory('.', 'test-logo.html')

@app.route('/cache-buster-sw.js')
def cache_buster_sw():
    return send_from_directory('.', 'cache-buster-sw.js', mimetype='application/javascript')

@app.route('/force-clear')
def force_clear():
    return send_from_directory('.', 'force-clear.html')

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    try:
        # Get and sanitize form data
        first_name = sanitize_input(request.form.get('first_name', ''))
        last_name = sanitize_input(request.form.get('last_name', ''))
        company = sanitize_input(request.form.get('company', ''))
        email = request.form.get('email', '').strip()
        phone = sanitize_input(request.form.get('phone', ''))
        job_title = sanitize_input(request.form.get('job_title', ''))
        message = sanitize_input(request.form.get('message', ''))
        
        # Validate required fields
        if not first_name or not last_name or not email or not message:
            return jsonify({'success': False, 'message': 'Please fill in all required fields.'}), 400
        
        # Validate email
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Please enter a valid email address.'}), 400
        
        # Create email content
        subject = f"New Contact Form Submission - {first_name} {last_name}"
        
        email_body = f"""
        New contact form submission received:
        
        Name: {first_name} {last_name}
        Company: {company}
        Email: {email}
        Phone: {phone}
        Job Title: {job_title}
        Message: {message}
        
        Submitted on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        IP Address: {request.remote_addr}
        """
        
        # Send email
        send_email(subject, email_body)
        
        return jsonify({'success': True, 'message': 'Thank you for your enquiry. We will contact you within 24 hours.'})
        
    except Exception as e:
        # Log error but don't expose details to user
        app.logger.error(f"Error processing contact form: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500

@app.route('/submit-government', methods=['POST'])
def submit_government():
    try:
        # Get and sanitize form data
        department = sanitize_input(request.form.get('department', ''))
        fleet_size = sanitize_input(request.form.get('fleet_size', ''))
        challenges = sanitize_input(request.form.get('challenges', ''))
        timeline = sanitize_input(request.form.get('timeline', ''))
        contact_name = sanitize_input(request.form.get('contact_name', ''))
        email = request.form.get('email', '').strip()
        phone = sanitize_input(request.form.get('phone', ''))
        
        # Validate required fields
        if not contact_name or not email or not department:
            return jsonify({'success': False, 'message': 'Please fill in all required fields.'}), 400
        
        # Validate email
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Please enter a valid email address.'}), 400
        
        # Create email content
        subject = f"New Government Demo Request - {contact_name}"
        
        email_body = f"""
        New government demo request received:
        
        Contact Name: {contact_name}
        Department: {department}
        Fleet Size: {fleet_size}
        Current Challenges: {challenges}
        Implementation Timeline: {timeline}
        Email: {email}
        Phone: {phone}
        
        Submitted on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        IP Address: {request.remote_addr}
        """
        
        # Send email
        send_email(subject, email_body)
        
        return jsonify({'success': True, 'message': 'Thank you for your government demo request. We will contact you within 24 hours.'})
        
    except Exception as e:
        # Log error but don't expose details to user
        app.logger.error(f"Error processing government form: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500

def send_email(subject, body):
    """Send email to info@ivmsgroup.com"""
    try:
        # Email configuration from config file
        sender_email = EMAIL_CONFIG['sender_email']
        receiver_email = EMAIL_CONFIG['receiver_email']
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = subject
        
        # Add body to email
        msg.attach(MIMEText(body, 'plain'))
        
        # Production SMTP configuration
        smtp_server = EMAIL_CONFIG['smtp_server']
        smtp_port = EMAIL_CONFIG['smtp_port']
        smtp_username = EMAIL_CONFIG['smtp_username']
        smtp_password = EMAIL_CONFIG['smtp_password']
        
        # Connect to SMTP server and send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        
        app.logger.info(f"Email sent successfully to {receiver_email}")
        
    except Exception as e:
        app.logger.error(f"Error sending email: {str(e)}")
        # Don't expose email details in production

@app.route('/<path:path>')
def serve_static(path):
    response = send_from_directory('.', path)
    # Set cache headers for static assets
    if any(path.endswith(ext) for ext in ['.js', '.css', '.webp', '.jpg', '.jpeg', '.png', '.svg', '.woff2', '.ico']):
        response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
    else:
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en-GB">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page Not Found - IVMS</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Return to Home
            </a>
        </div>
    </body>
    </html>
    '''), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en-GB">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Error - IVMS</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">500</h1>
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Server Error</h2>
            <p class="text-gray-600 mb-8">Something went wrong on our end. Please try again later.</p>
            <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Return to Home
            </a>
        </div>
    </body>
    </html>
    '''), 500

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Flask server.')
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode (not recommended for production)')
    args = parser.parse_args()
    
    # Production configuration
    debug_mode = args.debug and os.environ.get('FLASK_ENV') == 'development'
    
    print("Starting Flask server...")
    print(f"Server running at http://localhost:{args.port}")
    print(f"Debug mode: {'ENABLED' if debug_mode else 'DISABLED'}")
    print("Press Ctrl+C to stop the server")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=args.port) 