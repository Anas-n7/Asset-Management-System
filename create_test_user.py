import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cores.settings')
django.setup()

from django.contrib.auth.models import User

# Get credentials from environment variables or use defaults
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')

# Check if user already exists
if User.objects.filter(username=username).exists():
    print(f"User '{username}' already exists.")
else:
    # Create new user
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"Superuser '{username}' created successfully.")
