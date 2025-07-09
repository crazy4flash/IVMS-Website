# Email Configuration
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'smtp_username': 'your-email@gmail.com',  # Replace with your actual email
    'smtp_password': 'your-app-password',     # Replace with your app password
    'sender_email': 'noreply@ivmsgroup.com',
    'receiver_email': 'info@ivmsgroup.com'
}

# Alternative email providers (uncomment and configure as needed):

# For Outlook/Hotmail:
# EMAIL_CONFIG = {
#     'smtp_server': 'smtp-mail.outlook.com',
#     'smtp_port': 587,
#     'smtp_username': 'your-email@outlook.com',
#     'smtp_password': 'your-password',
#     'sender_email': 'noreply@ivmsgroup.com',
#     'receiver_email': 'info@ivmsgroup.com'
# }

# For custom domain with Gmail:
# EMAIL_CONFIG = {
#     'smtp_server': 'smtp.gmail.com',
#     'smtp_port': 587,
#     'smtp_username': 'noreply@ivmsgroup.com',
#     'smtp_password': 'your-app-password',
#     'sender_email': 'noreply@ivmsgroup.com',
#     'receiver_email': 'info@ivmsgroup.com'
# }

# For custom SMTP server:
# EMAIL_CONFIG = {
#     'smtp_server': 'your-smtp-server.com',
#     'smtp_port': 587,
#     'smtp_username': 'your-username',
#     'smtp_password': 'your-password',
#     'sender_email': 'noreply@ivmsgroup.com',
#     'receiver_email': 'info@ivmsgroup.com'
# } 