import hashlib
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from apps.projects.models import Project
from apps.skills.models import Skill
from apps.contact.models import ContactMessage
from apps.pages.models import Page
from .models import AnalyticsEvent

class PublicAnalyticsEventView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        path = request.data.get('path', '/')
        referrer = request.data.get('referrer', '')
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]

        # Extract client IP and hash with salt
        ip = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip:
            ip = ip.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')

        ip_hash = hashlib.sha256(f"raj-salt-{ip}".encode('utf-8')).hexdigest()

        AnalyticsEvent.objects.create(
            path=path[:255],
            referrer=referrer[:255],
            ip_hash=ip_hash,
            user_agent=user_agent
        )

        return Response({'success': True}, status=status.HTTP_201_CREATED)

class AdminAnalyticsOverviewView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)

        total_events = AnalyticsEvent.objects.count()
        unique_visitors = AnalyticsEvent.objects.values('ip_hash').distinct().count()
        recent_events = AnalyticsEvent.objects.filter(timestamp__gte=thirty_days_ago).count()

        # Popular paths
        popular_paths = AnalyticsEvent.objects.values('path').annotate(
            visits=Count('id')
        ).order_by('-visits')[:8]

        # 7-day traffic chart data
        traffic_history = []
        for i in range(6, -1, -1):
            day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            day_count = AnalyticsEvent.objects.filter(timestamp__gte=day_start, timestamp__lt=day_end).count()
            traffic_history.append({
                'date': day_start.strftime('%b %d'),
                'views': day_count
            })

        # Summary entity counts
        total_projects = Project.objects.count()
        published_projects = Project.objects.filter(status='published').count()
        total_skills = Skill.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        total_messages = ContactMessage.objects.count()
        published_pages = Page.objects.filter(status='published').count()

        return Response({
            'success': True,
            'data': {
                'metrics': {
                    'total_views': total_events,
                    'unique_visitors': unique_visitors,
                    'monthly_views': recent_events,
                    'unread_messages': unread_messages,
                    'total_messages': total_messages,
                    'total_projects': total_projects,
                    'published_projects': published_projects,
                    'total_skills': total_skills,
                    'published_pages': published_pages
                },
                'traffic_history': traffic_history,
                'popular_paths': list(popular_paths)
            }
        })
