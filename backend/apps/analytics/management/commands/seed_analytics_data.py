import random
import hashlib
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.analytics.models import AnalyticsEvent

class Command(BaseCommand):
    help = "Seeds realistic telemetry and visitor analytics for the last 14 days"

    def handle(self, *args, **options):
        # If there are already a good number of events, don't duplicate
        existing_count = AnalyticsEvent.objects.count()
        if existing_count >= 50:
            self.stdout.write(self.style.NOTICE(f"Analytics already contains {existing_count} events. Skipping seed."))
            return

        self.stdout.write(self.style.NOTICE("Seeding realistic visitor analytics data for Raj Antala's portfolio..."))

        paths_weighted = [
            ("/", 50),
            ("/#projects", 25),
            ("/#skills", 15),
            ("/#experience", 12),
            ("/resume", 18),
            ("/projects/enterprise-rag-platform", 10),
            ("/projects/ai-multimodal-assistant", 8),
            ("/contact", 6),
        ]

        referrers_weighted = [
            ("https://github.com/antalaraj", 35),
            ("https://linkedin.com/in/antalaraj", 30),
            ("https://www.google.com/search?q=Raj+Antala+AI+Engineer", 15),
            ("Direct / Bookmark", 12),
            ("https://twitter.com/antalaraj", 8),
        ]

        user_agents = [
            ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36", "Desktop"),
            ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36", "Desktop"),
            ("Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1", "Mobile"),
            ("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36", "Mobile"),
            ("Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", "Tablet"),
        ]

        # Generate 20 distinct visitor IP hashes
        visitor_hashes = [
            hashlib.sha256(f"raj-salt-visitor-{i}.128.45.{random.randint(1, 254)}".encode('utf-8')).hexdigest()
            for i in range(25)
        ]

        now = timezone.now()
        events_to_create = []

        # Generate day by day traffic for the past 14 days
        for day_offset in range(13, -1, -1):
            day_date = now - timedelta(days=day_offset)
            # Recent days have higher traffic as activity ramps up
            base_count = 18 + int((14 - day_offset) * 2.2) + random.randint(-4, 6)

            for _ in range(base_count):
                path = random.choices(
                    [p[0] for p in paths_weighted],
                    weights=[p[1] for p in paths_weighted]
                )[0]

                ref = random.choices(
                    [r[0] for r in referrers_weighted],
                    weights=[r[1] for r in referrers_weighted]
                )[0]
                if ref == "Direct / Bookmark":
                    ref = ""

                ua, _ = random.choice(user_agents)
                ip_hash = random.choice(visitor_hashes)

                # Time within the day
                hour = random.randint(8, 23)
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                event_time = day_date.replace(hour=hour, minute=minute, second=second)

                event_type = 'pageview'
                if path == '/resume':
                    event_type = random.choice(['pageview', 'resume_download'])

                event = AnalyticsEvent(
                    event_type=event_type,
                    path=path,
                    referrer=ref,
                    ip_hash=ip_hash,
                    user_agent=ua,
                    metadata={"seeded": True}
                )
                events_to_create.append((event, event_time))

        # Save and backdate timestamps
        created_events = AnalyticsEvent.objects.bulk_create([e[0] for e in events_to_create])
        
        # In SQLite/Django, auto_now_add overrides on create, so update timestamps explicitly
        for (item, event_time) in events_to_create:
            AnalyticsEvent.objects.filter(id=item.id).update(timestamp=event_time)

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(created_events)} analytics events across the last 14 days."))
