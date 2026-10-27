from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Public Views
from apps.profiles.views import PublicProfileView, AdminProfileView
from apps.site_settings.views import PublicSiteSettingView, AdminSiteSettingView
from apps.navigation.views import PublicNavigationView, AdminNavigationViewSet
from apps.footer.views import PublicFooterView, AdminFooterView
from apps.pages.views import PublicPageView, AdminPageViewSet, AdminPageSectionViewSet, AdminReorderSectionsView
from apps.projects.views import (
    PublicProjectListView, PublicProjectDetailView,
    AdminProjectViewSet, AdminTechTagViewSet, AdminProjectGalleryImageViewSet
)
from apps.skills.views import PublicSkillsView, AdminSkillViewSet, AdminSkillCategoryViewSet
from apps.experience.views import PublicExperienceView, AdminExperienceViewSet
from apps.education.views import PublicEducationView, AdminEducationViewSet
from apps.certifications.views import PublicCertificationView, AdminCertificationViewSet
from apps.testimonials.views import PublicTestimonialView, AdminTestimonialViewSet
from apps.contact.views import PublicContactSubmitView, AdminContactMessageViewSet
from apps.media_library.views import AdminMediaUploadView, AdminMediaAssetViewSet
from apps.seo.views import PublicSEOView, AdminSEOMetadataViewSet
from apps.analytics.views import PublicAnalyticsEventView, AdminAnalyticsOverviewView
from apps.ai_assistant.views import AIAssistantStatusView

class OptionalSlashRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trailing_slash = '/?'

admin_router = OptionalSlashRouter()
admin_router.register(r'pages', AdminPageViewSet, basename='admin-pages')
admin_router.register(r'sections', AdminPageSectionViewSet, basename='admin-sections')
admin_router.register(r'projects', AdminProjectViewSet, basename='admin-projects')
admin_router.register(r'tech-tags', AdminTechTagViewSet, basename='admin-tech-tags')
admin_router.register(r'project-gallery', AdminProjectGalleryImageViewSet, basename='admin-project-gallery')
admin_router.register(r'skills', AdminSkillViewSet, basename='admin-skills')
admin_router.register(r'skill-categories', AdminSkillCategoryViewSet, basename='admin-skill-categories')
admin_router.register(r'experience', AdminExperienceViewSet, basename='admin-experience')
admin_router.register(r'education', AdminEducationViewSet, basename='admin-education')
admin_router.register(r'certifications', AdminCertificationViewSet, basename='admin-certifications')
admin_router.register(r'testimonials', AdminTestimonialViewSet, basename='admin-testimonials')
admin_router.register(r'navigation', AdminNavigationViewSet, basename='admin-navigation')
admin_router.register(r'media', AdminMediaAssetViewSet, basename='admin-media')
admin_router.register(r'contact', AdminContactMessageViewSet, basename='admin-contact')
admin_router.register(r'seo', AdminSEOMetadataViewSet, basename='admin-seo')

urlpatterns = [
    # Optional default django administration (restricted / fallback)
    path('django-admin/', admin.site.urls),

    # Authentication Endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/auth', include('apps.accounts.urls')),

    # Public APIs (Read-only published data + contact submission + silent analytics)
    path('api/v1/public/profile/', PublicProfileView.as_view(), name='public-profile'),
    path('api/v1/public/settings/', PublicSiteSettingView.as_view(), name='public-settings'),
    path('api/v1/public/navigation/', PublicNavigationView.as_view(), name='public-navigation'),
    path('api/v1/public/footer/', PublicFooterView.as_view(), name='public-footer'),
    path('api/v1/public/pages/<slug:slug>/', PublicPageView.as_view(), name='public-page-detail'),
    path('api/v1/public/projects/', PublicProjectListView.as_view(), name='public-projects-list'),
    path('api/v1/public/projects/<slug:slug>/', PublicProjectDetailView.as_view(), name='public-project-detail'),
    path('api/v1/public/skills/', PublicSkillsView.as_view(), name='public-skills'),
    path('api/v1/public/experience/', PublicExperienceView.as_view(), name='public-experience'),
    path('api/v1/public/education/', PublicEducationView.as_view(), name='public-education'),
    path('api/v1/public/certifications/', PublicCertificationView.as_view(), name='public-certifications'),
    path('api/v1/public/testimonials/', PublicTestimonialView.as_view(), name='public-testimonials'),
    path('api/v1/public/contact/', PublicContactSubmitView.as_view(), name='public-contact-submit'),
    path('api/v1/public/analytics/event/', PublicAnalyticsEventView.as_view(), name='public-analytics-event'),
    path('api/v1/public/seo/<str:page_identifier>/', PublicSEOView.as_view(), name='public-seo'),
    path('api/v1/public/seo/', PublicSEOView.as_view(), name='public-seo-global'),
    path('api/v1/public/ai/status/', AIAssistantStatusView.as_view(), name='public-ai-status'),

    # Admin Protected Endpoints
    path('api/v1/admin/profile/', AdminProfileView.as_view(), name='admin-profile'),
    path('api/v1/admin/profile', AdminProfileView.as_view()),
    path('api/v1/admin/settings/', AdminSiteSettingView.as_view(), name='admin-settings'),
    path('api/v1/admin/settings', AdminSiteSettingView.as_view()),
    path('api/v1/admin/footer/', AdminFooterView.as_view(), name='admin-footer'),
    path('api/v1/admin/footer', AdminFooterView.as_view()),
    path('api/v1/admin/analytics/overview/', AdminAnalyticsOverviewView.as_view(), name='admin-analytics-overview'),
    path('api/v1/admin/analytics/overview', AdminAnalyticsOverviewView.as_view()),
    path('api/v1/admin/media/upload/', AdminMediaUploadView.as_view(), name='admin-media-upload'),
    path('api/v1/admin/media/upload', AdminMediaUploadView.as_view()),
    path('api/v1/admin/pages/reorder-sections/', AdminReorderSectionsView.as_view(), name='admin-reorder-sections'),
    path('api/v1/admin/pages/reorder-sections', AdminReorderSectionsView.as_view()),
    path('api/v1/admin/', include(admin_router.urls)),
    path('api/v1/admin', include(admin_router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
