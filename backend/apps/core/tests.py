from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.profiles.models import Profile
from apps.pages.models import Page, PageSection, SectionType
from apps.projects.models import Project
from apps.skills.models import SkillCategory, Skill
from apps.contact.models import ContactMessage
from apps.core.models import PublishableStatus

User = get_user_model()

class PortfolioAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Admin user
        self.admin = User.objects.create_superuser(
            username='testadmin',
            email='admin@test.com',
            password='TestPassword123!'
        )

        # Profile
        self.profile = Profile.objects.create(
            full_name='Raj Antala',
            headline='AI Engineer | Data Science | Generative AI',
            email='contact@rajantala.com'
        )

        # Page and section
        self.page = Page.objects.create(
            title='Home',
            slug='home',
            status=PublishableStatus.PUBLISHED
        )
        self.section1 = PageSection.objects.create(
            page=self.page,
            section_type=SectionType.HERO,
            title='Hero',
            display_order=1,
            is_active=True
        )
        self.section2 = PageSection.objects.create(
            page=self.page,
            section_type=SectionType.PROJECTS,
            title='Projects',
            display_order=2,
            is_active=True
        )

        # Published project
        self.project_pub = Project.objects.create(
            title='Published AI Project',
            slug='published-ai-project',
            short_description='A published project description',
            full_description='Detailed description',
            status=PublishableStatus.PUBLISHED
        )

        # Draft project
        self.project_draft = Project.objects.create(
            title='Draft AI Project',
            slug='draft-ai-project',
            short_description='A draft project description',
            full_description='Detailed draft description',
            status=PublishableStatus.DRAFT
        )

    def test_public_profile_endpoint(self):
        url = reverse('public-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['full_name'], 'Raj Antala')

    def test_public_projects_only_returns_published(self):
        url = reverse('public-projects-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['slug'], 'published-ai-project')

    def test_public_page_endpoint(self):
        url = reverse('public-page-detail', kwargs={'slug': 'home'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']['sections']), 2)

    def test_public_contact_submission(self):
        url = reverse('public-contact-submit')
        payload = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'subject': 'Project Consultation',
            'message': 'We would love to collaborate with you on an AI pipeline.'
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(ContactMessage.objects.count(), 1)
        msg = ContactMessage.objects.first()
        self.assertEqual(msg.sender_name, 'Jane Doe')
        self.assertFalse(msg.is_read)

    def test_admin_endpoints_require_authentication(self):
        # Anonymous request to admin overview
        url = reverse('admin-analytics-overview')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_login_and_access(self):
        login_url = reverse('auth_login')
        login_res = self.client.post(login_url, {
            'username': 'testadmin',
            'password': 'TestPassword123!'
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res.data['success'])

        # Now access admin overview
        url = reverse('admin-analytics-overview')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('metrics', response.data['data'])

    def test_admin_reorder_sections(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('admin-reorder-sections')
        payload = {
            'order': [
                {'id': str(self.section1.id), 'display_order': 5},
                {'id': str(self.section2.id), 'display_order': 1}
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.section1.refresh_from_db()
        self.section2.refresh_from_db()
        self.assertEqual(self.section1.display_order, 5)
        self.assertEqual(self.section2.display_order, 1)
