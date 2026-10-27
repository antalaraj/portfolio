from rest_framework import serializers, views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from .models import SEOMetadata

class SEOMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMetadata
        fields = [
            'id', 'page_identifier', 'title', 'meta_description',
            'keywords', 'canonical_url', 'og_title', 'og_description',
            'og_image_url', 'robots_directive', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicSEOView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, page_identifier='global'):
        seo = SEOMetadata.objects.filter(page_identifier=page_identifier).first()
        if not seo and page_identifier != 'global':
            seo = SEOMetadata.objects.filter(page_identifier='global').first()
        if not seo:
            seo = SEOMetadata.objects.create(
                page_identifier=page_identifier,
                title="Raj Antala | AI Engineer & Data Scientist",
                meta_description="Personal portfolio of Raj Antala — AI Engineer, Machine Learning Specialist, and Generative AI Developer."
            )
        return Response({
            'success': True,
            'data': SEOMetadataSerializer(seo).data
        })

class AdminSEOMetadataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = SEOMetadata.objects.all().order_by('page_identifier')
    serializer_class = SEOMetadataSerializer
