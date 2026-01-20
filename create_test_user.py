"""
Quick script to create a test user account.
Run this with: python create_test_user.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cores.settings')
django.setup()

from django.contrib.auth.models import User

# Create a test user
username = 'admin'
password = 'admin123'  # Change this to a secure password!

# Check if user already exists
if User.objects.filter(username=username).exists():
    print(f"User '{username}' already exists!")
    print("You can use these credentials to login:")
    print(f"Username: {username}")
    print(f"Password: {password}")
else:
    # Create new user
    user = User.objects.create_user(
        username=username,
        password=password,
        is_staff=True,  # Makes them an admin
        is_superuser=True
    )
    print("=" * 50)
    print("Test user created successfully!")
    print("=" * 50)
    print(f"Username: {username}")
    print(f"Password: {password}")
    print("=" * 50)
    print("\nYou can now use these credentials to login to the application.")
