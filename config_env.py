import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Email Configuration with Environment Variables
EMAIL_CONFIG = {
    'smtp_server': os.getenv('EMAIL_SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.getenv('EMAIL_SMTP_PORT', '587')),
    'smtp_username': os.getenv('EMAIL_SMTP_USERNAME', 'your-email@gmail.com'),
    'smtp_password': os.getenv('EMAIL_SMTP_PASSWORD', 'your-app-password'),
    'sender_email': os.getenv('EMAIL_SENDER', 'noreply@ivmsgroup.com'),
    'receiver_email': os.getenv('EMAIL_RECEIVER', 'info@ivmsgroup.com')
}

# Production settings
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here') 