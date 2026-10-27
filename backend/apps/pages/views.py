from rest_framework import views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from apps.core.models import PublishableStatus
from .models import Page, PageSection
from .serializers import PageSerializer, PageSectionSerializer, PublicPageSerializer

class PublicPageView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        page = Page.objects.prefetch_related('sections').filter(
            slug=slug, 
            status=PublishableStatus.PUBLISHED
        ).first()

        if not page:
            return Response({
                'success': False,
                'error': {
                    'code': 'NOT_FOUND',
                    'message': f"Page with slug '{slug}' not found or not published."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'success': True,
            'data': PublicPageSerializer(page).data
        })

class AdminPageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Page.objects.all().order_by('display_order', 'title')
    serializer_class = PageSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })

class AdminPageSectionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = PageSection.objects.all().order_by('display_order')
    serializer_class = PageSectionSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        page_id = self.request.query_params.get('page')
        page_slug = self.request.query_params.get('page_slug')
        if page_id:
            qs = qs.filter(page_id=page_id)
        elif page_slug:
            qs = qs.filter(page__slug=page_slug)
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'success': True,
            'message': 'Section updated successfully.',
            'data': serializer.data
        })

class AdminReorderSectionsView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def post(self, request):
        """
        Accepts: { "order": [ { "id": "uuid", "display_order": 0 }, ... ] }
        or direct list: [ { "id": "uuid", "display_order": 0 }, ... ]
        """
        if isinstance(request.data, list):
            order_data = request.data
        elif isinstance(request.data, dict):
            order_data = request.data.get('order', [])
        else:
            order_data = []

        for item in order_data:
            if isinstance(item, dict):
                section_id = item.get('id')
                new_order = item.get('display_order')
                if section_id and new_order is not None:
                    PageSection.objects.filter(id=section_id).update(display_order=new_order)

        return Response({
            'success': True,
            'message': 'Section order updated successfully.'
        })
