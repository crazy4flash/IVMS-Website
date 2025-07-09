from flask import Flask, send_from_directory, request, jsonify
import os
import argparse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from config import EMAIL_CONFIG

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/speedsense')
def speedsense():
    return send_from_directory('.', 'speedsense.html')

@app.route('/rental-leasing')
def rental_leasing():
    return send_from_directory('.', 'rental-leasing.html')

@app.route('/governments')
def governments():
    return send_from_directory('.', 'governments.html')

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    try:
        # Get form data
        first_name = request.form.get('first_name', '')
        last_name = request.form.get('last_name', '')
        company = request.form.get('company', '')
        email = request.form.get('email', '')
        phone = request.form.get('phone', '')
        job_title = request.form.get('job_title', '')
        message = request.form.get('message', '')
        
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
        """
        
        # Send email
        send_email(subject, email_body)
        
        return jsonify({'success': True, 'message': 'Thank you for your enquiry. We will contact you within 24 hours.'})
        
    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500

@app.route('/submit-government', methods=['POST'])
def submit_government():
    try:
        # Get form data
        department = request.form.get('department', '')
        fleet_size = request.form.get('fleet_size', '')
        challenges = request.form.get('challenges', '')
        timeline = request.form.get('timeline', '')
        contact_name = request.form.get('contact_name', '')
        email = request.form.get('email', '')
        phone = request.form.get('phone', '')
        
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
        """
        
        # Send email
        send_email(subject, email_body)
        
        return jsonify({'success': True, 'message': 'Thank you for your government demo request. We will contact you within 24 hours.'})
        
    except Exception as e:
        print(f"Error processing government form: {str(e)}")
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
        
        print(f"Email sent successfully to {receiver_email}")
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        # Fallback: print email content for debugging
        print("=" * 50)
        print("EMAIL CONTENT (for debugging):")
        print(f"To: {receiver_email}")
        print(f"Subject: {subject}")
        print(f"Body:\n{body}")
        print("=" * 50)

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Flask server.')
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    args = parser.parse_args()
    print("Starting Flask server...")
    print(f"Server running at http://localhost:{args.port}")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, host='0.0.0.0', port=args.port) 