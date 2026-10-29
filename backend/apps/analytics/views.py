import hashlib
from datetime import timedelta
from urllib.parse import urlparse
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

def parse_device_type(user_agent: str) -> str:
    ua = (user_agent or '').lower()
    if 'tablet' in ua or 'ipad' in ua:
        return 'Tablet'
    elif 'mobile' in ua or 'android' in ua or 'iphone' in ua:
        return 'Mobile'
    return 'Desktop'

def parse_referrer_name(referrer: str) -> str:
    if not referrer:
        return 'Direct / Bookmark'
    ref = referrer.lower().strip()
    if 'github.com' in ref:
        return 'GitHub'
    if 'linkedin.com' in ref:
        return 'LinkedIn'
    if 'google.' in ref:
        return 'Google Search'
    if 'twitter.com' in ref or 'x.com' in ref or 't.co' in ref:
        return 'X (Twitter)'
    try:
        parsed = urlparse(referrer)
        if parsed.netloc:
            return parsed.netloc.replace('www.', '')
    except Exception:
        pass
    return referrer[:30]

class PublicAnalyticsEventView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        path = str(request.data.get('path', '/'))[:255]
        
        # Don't track admin console paths as visitor analytics
        if path.startswith('/admin') or path.startswith('/api/'):
            return Response({'success': True, 'skipped': True}, status=status.HTTP_200_OK)

        referrer = str(request.data.get('referrer', ''))[:255]
        event_type = str(request.data.get('event_type', 'pageview'))[:50]
        metadata = request.data.get('metadata')
        if not isinstance(metadata, dict):
            metadata = {}

        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]

        # Extract client IP and hash with salt for privacy
        ip = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip:
            ip = ip.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')

        ip_hash = hashlib.sha256(f"raj-salt-{ip}".encode('utf-8')).hexdigest()

        AnalyticsEvent.objects.create(
            event_type=event_type,
            path=path,
            referrer=referrer,
            ip_hash=ip_hash,
            user_agent=user_agent,
            metadata=metadata
        )

        return Response({'success': True}, status=status.HTTP_201_CREATED)

class AdminAnalyticsOverviewView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        seven_days_ago = now - timedelta(days=7)
        fourteen_days_ago = now - timedelta(days=14)
        thirty_days_ago = now - timedelta(days=30)

        total_events = AnalyticsEvent.objects.count()
        unique_visitors = AnalyticsEvent.objects.values('ip_hash').distinct().count()
        monthly_views = AnalyticsEvent.objects.filter(timestamp__gte=thirty_days_ago).count()
        today_views = AnalyticsEvent.objects.filter(timestamp__gte=today_start).count()

        # Growth metrics (comparing last 7 days vs previous 7 days)
        views_last_7 = AnalyticsEvent.objects.filter(timestamp__gte=seven_days_ago).count()
        views_prev_7 = AnalyticsEvent.objects.filter(timestamp__gte=fourteen_days_ago, timestamp__lt=seven_days_ago).count()
        if views_prev_7 > 0:
            views_growth_pct = round(((views_last_7 - views_prev_7) / views_prev_7) * 100, 1)
        elif views_last_7 > 0:
            views_growth_pct = 100.0
        else:
            views_growth_pct = 0.0

        visitors_last_7 = AnalyticsEvent.objects.filter(timestamp__gte=seven_days_ago).values('ip_hash').distinct().count()
        visitors_prev_7 = AnalyticsEvent.objects.filter(timestamp__gte=fourteen_days_ago, timestamp__lt=seven_days_ago).values('ip_hash').distinct().count()
        if visitors_prev_7 > 0:
            visitors_growth_pct = round(((visitors_last_7 - visitors_prev_7) / visitors_prev_7) * 100, 1)
        elif visitors_last_7 > 0:
            visitors_growth_pct = 100.0
        else:
            visitors_growth_pct = 0.0

        # Popular paths with percentage calculation
        popular_paths_qs = AnalyticsEvent.objects.exclude(path__startswith='/admin').values('path').annotate(
            visits=Count('id')
        ).order_by('-visits')[:8]

        popular_paths = []
        for p in popular_paths_qs:
            pct = round((p['visits'] / total_events) * 100, 1) if total_events > 0 else 0.0
            popular_paths.append({
                'path': p['path'],
                'visits': p['visits'],
                'percentage': pct
            })

        # 7-day traffic chart data (daily views and unique visitors)
        traffic_history = []
        for i in range(6, -1, -1):
            day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            day_events = AnalyticsEvent.objects.filter(timestamp__gte=day_start, timestamp__lt=day_end)
            views_count = day_events.count()
            visitors_count = day_events.values('ip_hash').distinct().count()
            traffic_history.append({
                'date': day_start.strftime('%b %d'),
                'views': views_count,
                'visitors': visitors_count
            })

        # Top Referrers
        all_referrers = AnalyticsEvent.objects.values_list('referrer', flat=True)[:500]
        ref_counts = {}
        for r in all_referrers:
            name = parse_referrer_name(r)
            ref_counts[name] = ref_counts.get(name, 0) + 1
        sorted_refs = sorted(ref_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        top_referrers = [{'name': name, 'count': count} for name, count in sorted_refs]

        # Device Breakdown
        all_uas = AnalyticsEvent.objects.values_list('user_agent', flat=True)[:500]
        devices = {'Desktop': 0, 'Mobile': 0, 'Tablet': 0}
        for ua in all_uas:
            dev = parse_device_type(ua)
            devices[dev] = devices.get(dev, 0) + 1
        device_breakdown = [{'device': k, 'count': v} for k, v in devices.items() if v > 0]
        if not device_breakdown:
            device_breakdown = [{'device': 'Desktop', 'count': 0}, {'device': 'Mobile', 'count': 0}]

        # Live Recent Activity Stream (last 8 events)
        recent_events_qs = AnalyticsEvent.objects.exclude(path__startswith='/admin')[:8]
        recent_activity = []
        for ev in recent_events_qs:
            diff_sec = int((now - ev.timestamp).total_seconds())
            if diff_sec < 60:
                time_ago = 'Just now'
            elif diff_sec < 3600:
                time_ago = f"{diff_sec // 60}m ago"
            elif diff_sec < 86400:
                time_ago = f"{diff_sec // 3600}h ago"
            else:
                time_ago = f"{diff_sec // 86400}d ago"

            recent_activity.append({
                'id': ev.id,
                'path': ev.path,
                'event_type': ev.event_type,
                'referrer': parse_referrer_name(ev.referrer),
                'device': parse_device_type(ev.user_agent),
                'time_ago': time_ago,
                'timestamp': ev.timestamp.strftime('%Y-%m-%d %H:%M')
            })

        # Summary entity counts
        total_projects = Project.objects.count()
        published_projects = Project.objects.filter(status='published').count()
        total_skills = Skill.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        total_messages = ContactMessage.objects.count()
        published_pages = Page.objects.filter(status='published').count()
        resume_downloads = AnalyticsEvent.objects.filter(event_type='resume_download').count()

        return Response({
            'success': True,
            'data': {
                'metrics': {
                    'total_views': total_events,
                    'unique_visitors': unique_visitors,
                    'monthly_views': monthly_views,
                    'today_views': today_views,
                    'views_growth_pct': views_growth_pct,
                    'visitors_growth_pct': visitors_growth_pct,
                    'unread_messages': unread_messages,
                    'total_messages': total_messages,
                    'total_projects': total_projects,
                    'published_projects': published_projects,
                    'total_skills': total_skills,
                    'published_pages': published_pages,
                    'resume_downloads': resume_downloads
                },
                'traffic_history': traffic_history,
                'popular_paths': popular_paths,
                'top_referrers': top_referrers,
                'device_breakdown': device_breakdown,
                'recent_activity': recent_activity
            }
        })
