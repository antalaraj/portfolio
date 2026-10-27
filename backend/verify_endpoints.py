import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()
client = APIClient()

print("Testing all Public Endpoints...")
endpoints = [
    '/api/v1/public/profile/',
    '/api/v1/public/settings/',
    '/api/v1/public/navigation/',
    '/api/v1/public/footer/',
    '/api/v1/public/pages/home/',
    '/api/v1/public/projects/',
    '/api/v1/public/skills/',
    '/api/v1/public/experience/',
    '/api/v1/public/education/',
    '/api/v1/public/certifications/',
    '/api/v1/public/testimonials/',
    '/api/v1/public/seo/',
    '/api/v1/public/ai/status/',
]

for ep in endpoints:
    res = client.get(ep)
    status_str = "OK" if res.status_code == 200 else f"FAIL ({res.status_code})"
    print(f"[{status_str}] GET {ep}")

print("\nTesting Authenticated Admin Endpoints...")
admin = User.objects.filter(is_superuser=True).first()
if admin:
    client.force_authenticate(user=admin)
    admin_endpoints = [
        '/api/v1/admin/analytics/overview/',
        '/api/v1/admin/profile/',
        '/api/v1/admin/settings/',
        '/api/v1/admin/footer/',
        '/api/v1/admin/pages/',
        '/api/v1/admin/projects/',
        '/api/v1/admin/skills/',
        '/api/v1/admin/skill-categories/',
        '/api/v1/admin/experience/',
        '/api/v1/admin/education/',
        '/api/v1/admin/certifications/',
        '/api/v1/admin/testimonials/',
        '/api/v1/admin/navigation/',
        '/api/v1/admin/media/',
        '/api/v1/admin/contact/',
        '/api/v1/admin/seo/',
    ]
    for a_ep in admin_endpoints:
        res = client.get(a_ep)
        status_str = "OK" if res.status_code == 200 else f"FAIL ({res.status_code})"
        print(f"[{status_str}] GET {a_ep}")
else:
    print("No superuser found.")
