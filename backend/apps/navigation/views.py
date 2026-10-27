from rest_framework import serializers, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from .models import NavigationItem

class NavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = [
            'id', 'label', 'destination', 'is_external',
            'menu_location', 'display_order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicNavigationView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        location = request.query_params.get('location', 'header')
        qs = NavigationItem.objects.filter(is_active=True)
        if location in ['header', 'footer']:
            qs = qs.filter(menu_location__in=[location, 'both'])
        qs = qs.order_by('display_order')
        return Response({
            'success': True,
            'data': NavigationItemSerializer(qs, many=True).data
        })

class AdminNavigationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = NavigationItem.objects.all().order_by('display_order')
    serializer_class = NavigationItemSerializer
