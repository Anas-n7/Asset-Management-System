import os

req_file = 'requirements.txt'
content = ""

try:
    with open(req_file, 'r', encoding='utf-16') as f:
        content = f.read()
except:
    try:
        with open(req_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading: {e}")
        # Default content if read fails
        content = """django>=4.0
djangorestframework
django-cors-headers
django-filter
python-decouple
dj-database-url
whitenoise
gunicorn
"""

# Add psycopg2-binary if not present
if 'psycopg2-binary' not in content:
    content += "\npsycopg2-binary"

# Write back as utf-8
with open(req_file, 'w', encoding='utf-8') as f:
    f.write(content.strip() + "\n")

print("Updated requirements.txt")
