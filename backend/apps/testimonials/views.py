from rest_framework import serializers, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from .models import Testimonial

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'author_name', 'designation', 'company', 'quote',
            'avatar_url', 'is_approved', 'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicTestimonialView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Testimonial.objects.filter(is_approved=True).order_by('display_order')
        return Response({
            'success': True,
            'data': TestimonialSerializer(qs, many=True).data
        })

class AdminTestimonialViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Testimonial.objects.all().order_by('display_order', '-created_at')
    serializer_class = TestimonialSerializer
