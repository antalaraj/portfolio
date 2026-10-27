from rest_framework import views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from apps.core.permissions import IsSuperAdminUser
from apps.core.models import PublishableStatus
from .models import TechTag, Project, ProjectGalleryImage
from .serializers import TechTagSerializer, ProjectListSerializer, ProjectDetailSerializer, ProjectGalleryImageSerializer

class PublicProjectListView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Project.objects.filter(status=PublishableStatus.PUBLISHED).prefetch_related('technologies')
        
        # Filtering
        featured = request.query_params.get('featured')
        if featured == 'true':
            qs = qs.filter(is_featured=True)
            
        tech = request.query_params.get('tech')
        if tech:
            qs = qs.filter(technologies__name__iexact=tech)
            
        q = request.query_params.get('q')
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(short_description__icontains=q) | Q(technologies__name__icontains=q)).distinct()

        qs = qs.order_by('display_order', '-created_at')
        serializer = ProjectListSerializer(qs, many=True)
        return Response({
            'success': True,
            'count': qs.count(),
            'data': serializer.data
        })

class PublicProjectDetailView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            project = Project.objects.prefetch_related('technologies', 'gallery_images').get(
                slug=slug, status=PublishableStatus.PUBLISHED
            )
        except Project.DoesNotExist:
            return Response({
                'success': False,
                'error': {
                    'code': 'NOT_FOUND',
                    'message': f"Project '{slug}' not found or not published."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'success': True,
            'data': ProjectDetailSerializer(project).data
        })

class AdminProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Project.objects.all().order_by('display_order', '-created_at')

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return ProjectDetailSerializer
        return ProjectListSerializer

class AdminTechTagViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = TechTag.objects.all()
    serializer_class = TechTagSerializer

class AdminProjectGalleryImageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = ProjectGalleryImage.objects.all()
    serializer_class = ProjectGalleryImageSerializer
